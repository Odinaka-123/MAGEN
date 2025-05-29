import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BreachDetails } from "@/components/breach-details"

export default async function BreachDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BreachDetails id={id} />
      </div>
    </div>
  )
}
