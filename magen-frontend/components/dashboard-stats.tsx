"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBreachStats } from "@/services/api"
import { Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Risk color and icon
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 50) return "text-yellow-500";
    return "text-green-500";
  };
  const getRiskIcon = (score: number) => {
    if (score >= 80) return <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>;
    if (score >= 50) return <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16h.01" /></svg>;
    return <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16h.01" /></svg>;
  };

  useEffect(() => {
    getBreachStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            Total Breaches
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                Number of breaches detected for your account.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBreaches}</div>
          <p className="text-xs text-muted-foreground">+{stats.breachesChange} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            Active Alerts
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                Number of active alerts for your account.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeAlerts}</div>
          <p className="text-xs text-muted-foreground">+{stats.alertsChange} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            Risk Score
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                Your overall risk score based on detected breaches and alerts.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          {getRiskIcon(stats.riskScore)}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRiskColor(stats.riskScore)}`}>{stats.riskScoreLabel}</div>
          <p className="text-xs text-muted-foreground">{stats.riskScore}/100 points</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            Resolved
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                Number of breaches you have marked as resolved.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.resolvedBreaches}</div>
          <p className="text-xs text-muted-foreground">+{stats.resolvedChange} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            Breached Passwords in Database
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                Number of unique breached passwords loaded from CSV.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.breachedPasswordsCount ?? 0}</div>
          <p className="text-xs text-muted-foreground">Loaded from CSV</p>
        </CardContent>
      </Card>
    </div>
  )
}
