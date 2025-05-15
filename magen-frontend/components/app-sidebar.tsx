"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogOut, Settings, Shield } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()

  // Don't show sidebar on login or register pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Privacy Recommendations",
      icon: Shield,
      href: "/recommendations",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold">MAGEN</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/login">
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
