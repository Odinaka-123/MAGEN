"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowRight, Clock, MoreHorizontal, Shield } from "lucide-react"
import { getBreaches, scanBreaches } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export const BreachesCards = forwardRef(function BreachesCards(_, ref) {
  const [filter, setFilter] = useState("all")
  const [breaches, setBreaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast();
  const [scanEmail, setScanEmail] = useState("");
  const [scanning, setScanning] = useState(false);

  const fetchBreaches = () => {
    setLoading(true)
    setError(null)
    return getBreaches()
      .then((data) => {
        const breachesData = Array.isArray(data) ? data : data.breaches || [];
        setBreaches(breachesData)
        console.log("Updated breaches state:", breachesData); // Debugging line
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useImperativeHandle(ref, () => ({ refetch: fetchBreaches }), [])

  useEffect(() => {
    fetchBreaches()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const filteredBreaches =
    filter === "all"
      ? breaches
      : breaches.filter((breach) => {
          const status = breach.status || breach.breach_status || "New";
          return filter === "active"
            ? status === "New" || status === "Active"
            : status === "Resolved";
        })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Active":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Resolved":
        return <Shield className="h-5 w-5 text-green-500" />
      default:
        return <Shield className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-red-500"
      case "Active":
        return "bg-yellow-500"
      case "Resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleManualScan = async () => {
    if (!scanEmail) return toast({ title: "Please enter an email." });
    setScanning(true);
    try {
      const data = await scanBreaches(scanEmail); // Use the scanBreaches function from api.ts
      if (data) {
        if (data.error) {
          toast({ title: "Scan failed", description: data.error, variant: "destructive" });
        } else if (data.message) {
          toast({ title: data.breaches && data.breaches.length > 0 ? "Breaches Found" : "No Breaches Found", description: data.message, variant: data.breaches && data.breaches.length > 0 ? undefined : "default" });
        } else {
          toast({ title: "Scan complete", description: "Scan finished." });
        }
        fetchBreaches();
      } else {
        toast({ title: "Scan failed", description: "Error scanning for breaches.", variant: "destructive" });
      }
    } catch (e) {
      const errorMessage = (e instanceof Error && e.message) ? e.message : "Network or server error.";
      toast({ title: "Scan failed", description: errorMessage, variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Manual email scan UI */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <input
          type="email"
          placeholder="Enter email to scan for breaches"
          className="border rounded px-2 py-1 text-sm"
          value={scanEmail}
          onChange={e => setScanEmail(e.target.value)}
          disabled={scanning}
          style={{ minWidth: 220 }}
        />
        <Button size="sm" onClick={handleManualScan} disabled={scanning || !scanEmail}>
          {scanning ? "Scanning..." : "Scan Email"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All Breaches
        </Button>
        <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
          Active
        </Button>
        <Button variant={filter === "resolved" ? "default" : "outline"} size="sm" onClick={() => setFilter("resolved")}>
          Resolved
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBreaches.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-2"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
            <span>No breaches found for this filter.</span>
          </div>
        ) : (
          filteredBreaches.map((breach, idx) => (
            <Card key={(typeof breach.id === 'string' ? breach.id : 'db-' + breach.id) + '-' + idx} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(breach.status || breach.breach_status || "New")}
                    <CardTitle className="text-lg flex items-center gap-2">
                      {breach.source || breach.breach_source || "Unknown Source"}
                      {breach.id && typeof breach.id === "string" && breach.id.startsWith("csv-") && (
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300 ml-2">CSV</Badge>
                      )}
                    </CardTitle>
                  </div>
                  <Badge className={getStatusColor(breach.status || breach.breach_status || "New")}>{breach.status || breach.breach_status || "New"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Detected: {breach.date || breach.breach_timestamp ? new Date(breach.breach_timestamp).toLocaleDateString() : "Unknown"}
                </p>
                <p className="text-sm mb-3">
                  {breach.description || `Source: ${breach.breach_source || breach.source}`}
                  {breach.email && <><br/>Email: {breach.email}</>}
                  {breach.phone && <><br/>Phone: {breach.phone}</>}
                  {breach.password && <><br/>Password: {breach.password}</>}
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(breach.affectedData) && breach.affectedData.length > 0
                    ? breach.affectedData.map((data: string, idx2: number) => (
                        <Badge key={data + '-' + idx2} variant="outline" className="text-xs">{data}</Badge>
                      ))
                    : [
                        breach.email ? "Email" : undefined,
                        breach.phone ? "Phone" : undefined,
                        breach.password ? "Password" : undefined
                      ]
                        .filter((d): d is string => typeof d === "string")
                        .map((data, idx2) => (
                          <Badge key={data + '-' + idx2} variant="outline" className="text-xs">{data}</Badge>
                        ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/breach/${breach.id}`} className="flex items-center gap-1">
                    View details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/breach/${breach.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                    <DropdownMenuItem>Ignore</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
})
