"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getBreaches } from "@/services/api"

export function BreachesTable() {
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [breaches, setBreaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getBreaches()
      .then((data) => {
        const breachesData = Array.isArray(data) ? data : data.breaches || []
        setBreaches(breachesData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
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

  if (loading) return <div>Loading...</div>

  // Remove the Breach History card entirely
  return null
}
