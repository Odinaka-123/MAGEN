import { Card } from "@/components/ui/card"
import { BreachesCards } from "@/components/breaches-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { BreachesChart } from "@/components/breaches-chart"
import { RecentAlerts } from "@/components/recent-alerts"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader />
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BreachesCards />
        </div>
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Breach History</h3>
            <BreachesChart />
          </Card>
          <RecentAlerts />
        </div>
      </div>
    </div>
  )
}
