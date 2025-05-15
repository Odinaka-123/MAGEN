"use client"

import { useState } from "react"
import { Mail, AtSign, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function OnboardingStepTwo() {
  const [email, setEmail] = useState("")

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Primary Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button size="icon" variant="outline" className="shrink-0">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">We'll monitor this email for data breaches</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Connect additional accounts</h3>
        <p className="text-xs text-muted-foreground mb-3">Connect your social accounts to enhance protection</p>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2">
            <AtSign className="h-4 w-4" />
            Connect Additional Email
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Github className="h-4 w-4" />
            Connect GitHub
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Linkedin className="h-4 w-4" />
            Connect LinkedIn
          </Button>
        </div>
      </div>
    </div>
  )
}
