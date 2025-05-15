import Link from "next/link"
import { ExternalLink, Lock, Shield, Smartphone, Key } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const recommendations = [
  {
    id: "1",
    title: "Use strong, unique passwords",
    description:
      "Create complex passwords that are at least 12 characters long with a mix of letters, numbers, and symbols. Never reuse passwords across different accounts.",
    icon: Lock,
    link: "https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/password-managers",
    linkText: "Learn about password managers",
  },
  {
    id: "2",
    title: "Enable two-factor authentication (2FA)",
    description:
      "Add an extra layer of security by requiring a second form of verification beyond just your password. This significantly reduces the risk of unauthorized access.",
    icon: Smartphone,
    link: "https://www.ncsc.gov.uk/guidance/setting-two-factor-authentication-2fa",
    linkText: "How to set up 2FA",
  },
  {
    id: "3",
    title: "Regularly update your software",
    description:
      "Keep your operating system, browsers, and apps updated with the latest security patches to protect against known vulnerabilities.",
    icon: Shield,
    link: "https://www.cisa.gov/news-events/news/importance-software-updates",
    linkText: "Why updates matter",
  },
  {
    id: "4",
    title: "Use a password manager",
    description:
      "Password managers can generate, store, and autofill strong unique passwords for all your accounts, so you only need to remember one master password.",
    icon: Key,
    link: "https://www.consumer.ftc.gov/articles/password-managers",
    linkText: "Choosing a password manager",
  },
  {
    id: "5",
    title: "Be cautious with personal information",
    description:
      "Limit the personal information you share online, especially on social media. Cybercriminals can use this information for identity theft or targeted attacks.",
    icon: Shield,
    link: "https://www.ftc.gov/business-guidance/privacy-security/privacy-shield",
    linkText: "Privacy protection tips",
  },
]

export function PrivacyRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Recommendations</CardTitle>
        <CardDescription>
          Follow these best practices to enhance your online security and protect your personal data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendations.map((recommendation, index) => (
          <div key={recommendation.id}>
            <div className="flex gap-4">
              <div className="mt-0.5">
                <recommendation.icon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">{recommendation.title}</h3>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                <Button variant="link" className="p-0 h-auto text-blue-500" asChild>
                  <Link
                    href={recommendation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    {recommendation.linkText}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            {index < recommendations.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
