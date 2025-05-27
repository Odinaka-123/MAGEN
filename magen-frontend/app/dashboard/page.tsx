"use client"
import { Card } from "@/components/ui/card"
import { BreachesCards } from "@/components/breaches-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { BreachesChart } from "@/components/breaches-chart"
import { RecentAlerts } from "@/components/recent-alerts"
import { useRef } from "react"

export default function DashboardPage() {
  const breachesRef = useRef<any>(null)

  // Callback to refresh breaches after scan
  const handleScanComplete = () => {
    breachesRef.current?.refetch?.()
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader onScanComplete={handleScanComplete} />
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BreachesCards ref={breachesRef} />
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
