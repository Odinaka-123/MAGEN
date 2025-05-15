"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, Home, Settings, Shield, User } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  // Don't show on login or register pages
  if (pathname === "/login" || pathname === "/register" || pathname.includes("/onboarding")) {
    return null
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: Bell,
      badge: 3,
    },
    {
      name: "Security",
      href: "/recommendations",
      icon: Shield,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`inline-flex flex-col items-center justify-center px-1 hover:bg-muted ${
                isActive ? "text-blue-500" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
