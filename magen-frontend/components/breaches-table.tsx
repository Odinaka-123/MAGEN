"use client"

import { useState } from "react"
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

// Sample data
const breaches = [
  {
    id: "1",
    date: "2023-10-15",
    source: "Have I Been Pwned",
    affectedData: ["Email", "Password"],
    status: "New",
  },
  {
    id: "2",
    date: "2023-09-22",
    source: "Dark Web Monitor",
    affectedData: ["Email", "Phone", "Address"],
    status: "Active",
  },
  {
    id: "3",
    date: "2023-08-05",
    source: "Have I Been Pwned",
    affectedData: ["Email"],
    status: "Resolved",
  },
  {
    id: "4",
    date: "2023-07-18",
    source: "Security Alert",
    affectedData: ["Password", "Username"],
    status: "Resolved",
  },
  {
    id: "5",
    date: "2023-06-30",
    source: "Dark Web Monitor",
    affectedData: ["Credit Card"],
    status: "Active",
  },
]

export function BreachesTable() {
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Breaches</CardTitle>
        <CardDescription>A list of your recent data breaches and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Affected Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breaches.map((breach) => (
              <TableRow key={breach.id}>
                <TableCell className="font-medium">{breach.date}</TableCell>
                <TableCell>{breach.source}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {breach.affectedData.map((data) => (
                      <Badge key={data} variant="outline" className="text-xs">
                        {data}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(breach.status)}>{breach.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
