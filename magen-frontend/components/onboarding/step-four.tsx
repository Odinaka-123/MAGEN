import { CheckCircle } from "lucide-react"

export function OnboardingStepFour() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-500/20 p-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-medium">You're All Set!</h3>
        <p className="text-sm text-muted-foreground">
          Your MAGEN account is now configured and ready to protect your digital identity. We'll start monitoring your
          data and alert you of any potential breaches.
        </p>
      </div>

      <div className="pt-4">
        <p className="text-sm font-medium">What's next?</p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
          <li>• View your security dashboard</li>
          <li>• Check for existing data breaches</li>
          <li>• Review security recommendations</li>
          <li>• Connect additional accounts</li>
        </ul>
      </div>
    </div>
  )
}
