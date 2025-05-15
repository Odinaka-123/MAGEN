import Image from "next/image"

export function OnboardingStepOne() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <Image
            src="/placeholder.svg?height=256&width=256"
            alt="MAGEN Security"
            width={256}
            height={256}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium">Protect Your Digital Identity</h3>
        <p className="text-sm text-muted-foreground">
          MAGEN helps you detect and protect your sensitive information from unauthorized leaks. We'll monitor your data
          across the web and alert you when your information is compromised.
        </p>
      </div>
    </div>
  )
}
