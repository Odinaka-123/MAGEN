"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getBreachById } from "@/services/api"

export function BreachDetails({ id }: { id: string }) {
  const { toast } = useToast()
  const [breach, setBreach] = useState<any>(null)
  const [status, setStatus] = useState<string>("Unknown")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setBreach(null)
    getBreachById(id)
      .then((data) => {
        setBreach(data)
        setStatus(data?.status || data?.breach_status || "Unknown")
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!breach) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Breach Not Found</CardTitle>
          <CardDescription>The breach you're looking for doesn't exist or has been removed.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleResolve = () => {
    setStatus("Resolved")
    toast({
      title: "Breach marked as resolved",
      description: "This breach has been marked as resolved and will be moved to your history.",
    })
  }

  const getStatusIcon = () => {
    switch (status) {
      case "New":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Active":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Shield className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = () => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Breach Details</CardTitle>
            <CardDescription>Detailed information about this data breach</CardDescription>
          </div>
          <Badge className={getStatusColor()}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date Detected</h3>
              <p className="text-base">{breach.date || breach.breach_timestamp || "Unknown"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
              <p className="text-base">{breach.source || breach.breach_source || "Unknown"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Affected Data</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {(breach.affectedData || []).map((data: string, idx: number) => (
                  <Badge key={data + "-" + idx} variant="outline">
                    {data}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
            <p className="text-sm">{breach.description}</p>
          </div>
        </div>

        <Separator />

        {breach.recommendations && breach.recommendations.length > 0 && (
          <div>
            <h3 className="text-base font-medium mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {breach.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Similar Breaches</Button>
        {status !== "Resolved" && (
          <Button onClick={handleResolve} className="bg-green-600 hover:bg-green-700">
            Mark as Resolved
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
