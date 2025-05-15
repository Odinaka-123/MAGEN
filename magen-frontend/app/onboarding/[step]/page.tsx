"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Shield, Mail, Lock, CheckCircle } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingStepOne } from "@/components/onboarding/step-one"
import { OnboardingStepTwo } from "@/components/onboarding/step-two"
import { OnboardingStepThree } from "@/components/onboarding/step-three"
import { OnboardingStepFour } from "@/components/onboarding/step-four"

export default function OnboardingPage({ params }: { params: { step: string } }) {
  const router = useRouter()
  const currentStep = Number.parseInt(params.step)

  // Create a single form instance to share across steps
  const form = useForm({
    defaultValues: {
      emailAlerts: true,
      inAppAlerts: true,
      weeklyDigest: false,
      dataSharing: false,
    },
  })

  const steps = [
    {
      title: "Welcome to MAGEN",
      description: "Your personal data leak detector",
      icon: Shield,
      component: OnboardingStepOne,
    },
    {
      title: "Connect Your Accounts",
      description: "Let's secure your digital presence",
      icon: Mail,
      component: OnboardingStepTwo,
    },
    {
      title: "Security Preferences",
      description: "Customize your security settings",
      icon: Lock,
      component: OnboardingStepThree,
    },
    {
      title: "All Set!",
      description: "You're ready to start using MAGEN",
      icon: CheckCircle,
      component: OnboardingStepFour,
    },
  ]

  const CurrentStepComponent = steps[currentStep - 1]?.component || steps[0].component
  const CurrentIcon = steps[currentStep - 1]?.icon || Shield

  const handleNext = () => {
    if (currentStep < steps.length) {
      router.push(`/onboarding/${currentStep + 1}`)
    } else {
      router.push("/dashboard")
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/onboarding/${currentStep - 1}`)
    }
  }

  return (
    <FormProvider {...form}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Shield className="h-12 w-12 text-blue-500" />
            <h1 className="text-3xl font-bold">MAGEN</h1>
            <p className="text-muted-foreground">Personal Data Leak Detector</p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-3">
                <CurrentIcon className="h-6 w-6 text-blue-500" />
                <div>
                  <CardTitle className="text-2xl">{steps[currentStep - 1]?.title}</CardTitle>
                  <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Progress indicator */}
              <div className="flex justify-between mb-8">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full flex-1 mx-1 ${index + 1 <= currentStep ? "bg-blue-500" : "bg-gray-700"}`}
                  />
                ))}
              </div>

              <CurrentStepComponent />
            </CardContent>

            <CardFooter className="flex justify-between">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
              )}

              <Button onClick={handleNext}>{currentStep < steps.length ? "Continue" : "Get Started"}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </FormProvider>
  )
}
