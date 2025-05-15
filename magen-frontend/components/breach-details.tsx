"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// Sample breach data - in a real app, this would come from an API
const breachData = {
  "1": {
    id: "1",
    date: "2023-10-15",
    source: "Have I Been Pwned",
    affectedData: ["Email", "Password"],
    status: "New",
    description:
      "Your data was found in a breach of a major online service. The breach includes email addresses and passwords that were stored with weak encryption.",
    recommendations: [
      "Change your password immediately",
      "Enable two-factor authentication",
      "Don't reuse passwords across services",
    ],
  },
  "2": {
    id: "2",
    date: "2023-09-22",
    source: "Dark Web Monitor",
    affectedData: ["Email", "Phone", "Address"],
    status: "Active",
    description:
      "Your personal information was found being traded on dark web forums. This includes your email, phone number, and physical address.",
    recommendations: [
      "Monitor your accounts for suspicious activity",
      "Consider placing a fraud alert on your credit reports",
      "Be cautious of phishing attempts using your personal information",
    ],
  },
  "3": {
    id: "3",
    date: "2023-08-05",
    source: "Have I Been Pwned",
    affectedData: ["Email"],
    status: "Resolved",
    description:
      "Your email address was found in a marketing database that was exposed. No passwords or sensitive information were included in this breach.",
    recommendations: [
      "Be aware of potential increase in spam emails",
      "Consider using email aliases for different services",
    ],
  },
  "4": {
    id: "4",
    date: "2023-07-18",
    source: "Security Alert",
    affectedData: ["Password", "Username"],
    status: "Resolved",
    description:
      "Your username and password were found in a breach of an online forum. The passwords were stored in plain text.",
    recommendations: [
      "Change your password on all sites where you used this password",
      "Use a password manager to generate unique passwords",
    ],
  },
  "5": {
    id: "5",
    date: "2023-06-30",
    source: "Dark Web Monitor",
    affectedData: ["Credit Card"],
    status: "Active",
    description:
      "Your credit card information was found in a breach of an e-commerce website. This includes the full card number, expiration date, and CVV.",
    recommendations: [
      "Contact your bank to cancel the card and request a new one",
      "Monitor your statements for unauthorized charges",
      "Consider setting up transaction alerts",
    ],
  },
}

export function BreachDetails({ id }: { id: string }) {
  const { toast } = useToast()
  const [status, setStatus] = useState(breachData[id as keyof typeof breachData]?.status || "Unknown")
  const breach = breachData[id as keyof typeof breachData]

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
              <p className="text-base">{breach.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
              <p className="text-base">{breach.source}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Affected Data</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {breach.affectedData.map((data) => (
                  <Badge key={data} variant="outline">
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

        <div>
          <h3 className="text-base font-medium mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {breach.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
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
