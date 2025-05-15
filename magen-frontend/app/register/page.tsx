import Link from "next/link"
import { Shield } from "lucide-react"

import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Shield className="h-12 w-12 text-blue-500" />
          <h1 className="text-3xl font-bold">MAGEN</h1>
          <p className="text-muted-foreground">Personal Data Leak Detector</p>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Create an account</h2>
              <p className="text-sm text-muted-foreground">Enter your information to get started</p>
            </div>
            <RegisterForm />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="font-medium text-blue-500 hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
