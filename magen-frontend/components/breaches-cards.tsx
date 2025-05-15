"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowRight, Clock, MoreHorizontal, Shield } from "lucide-react"
import { getBreaches } from "@/services/api"

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

export function BreachesCards() {
  const [filter, setFilter] = useState("all")
  const [breaches, setBreaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getBreaches()
      .then(setBreaches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const filteredBreaches =
    filter === "all"
      ? breaches
      : breaches.filter((breach) =>
          filter === "active" ? breach.status === "New" || breach.status === "Active" : breach.status === "Resolved",
        )

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

  return (
    <div className="space-y-6">
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
        {filteredBreaches.map((breach) => (
          <Card key={breach.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getStatusIcon(breach.status)}
                  <CardTitle className="text-lg">{breach.source}</CardTitle>
                </div>
                <Badge className={getStatusColor(breach.status)}>{breach.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground mb-2">Detected: {breach.date}</p>
              <p className="text-sm mb-3">{breach.description}</p>
              <div className="flex flex-wrap gap-1">
                {breach.affectedData.map((data: string) => (
                  <Badge key={data} variant="outline" className="text-xs">
                    {data}
                  </Badge>
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
        ))}
      </div>
    </div>
  )
}
