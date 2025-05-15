import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MAGEN - Personal Data Leak Detector",
  description: "Detect and protect your sensitive information from unauthorized leaks",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased pb-16 md:pb-0`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1">{children}</main>
            </div>
            <MobileNav />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
