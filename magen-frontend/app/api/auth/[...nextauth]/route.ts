import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { getUserByEmail } from "@/services/database"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get user from database
          const user = await getUserByEmail(credentials.email)

          if (!user) {
            return null
          }

          // Check password
          const isPasswordValid = await compare(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding/1",
  },
})

export { handler as GET, handler as POST }
