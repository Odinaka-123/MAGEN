import { PrivacyRecommendations } from "@/components/privacy-recommendations"

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Recommendations</h1>
        <p className="text-muted-foreground">Best practices to enhance your online security</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-3xl">
        <PrivacyRecommendations />
      </div>
    </div>
  )
}
