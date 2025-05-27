"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { scanBreaches } from "@/services/api"

export function DashboardHeader({ onScanComplete }: { onScanComplete?: () => void }) {
  const [scanning, setScanning] = useState(false)
  const [scanMsg, setScanMsg] = useState<string|null>(null)

  const handleScan = async () => {
    setScanning(true)
    setScanMsg(null)
    try {
      const res = await scanBreaches()
      console.log("Scan response:", res);
      // Prefer showing the actual scanned email if available
      if (res && res.email) {
        setScanMsg(res.message?.replace(/test@example.com/gi, res.email) || "Scan complete.")
      } else {
        setScanMsg(res.message || "Scan complete.")
      }
      if (onScanComplete) onScanComplete()
    } catch (err: any) {
      setScanMsg(err.message || "Scan failed.")
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your data breach alerts</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2" onClick={handleScan} disabled={scanning}>
          {scanning ? "Scanning..." : "Scan for Breaches"}
        </Button>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
          <Badge className="ml-1 bg-red-500">3</Badge>
        </Button>
      </div>
      {scanMsg && <div className="text-xs text-muted-foreground mt-2">{scanMsg}</div>}
    </div>
  )
}
