import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your data breach alerts</p>
      </div>
      <Button variant="outline" className="gap-2">
        <Bell className="h-4 w-4" />
        Notifications
        <Badge className="ml-1 bg-red-500">3</Badge>
      </Button>
    </div>
  )
}
