"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"

export function OnboardingStepThree() {
  const form = useForm({
    defaultValues: {
      emailAlerts: true,
      inAppAlerts: true,
      weeklyDigest: false,
      dataSharing: false,
    },
  })

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Choose how you want to be notified about potential data breaches and security issues.
      </p>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="emailAlerts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Alerts</FormLabel>
                <FormDescription>Receive email notifications for new breaches</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inAppAlerts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">In-App Alerts</FormLabel>
                <FormDescription>Receive notifications within the application</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weeklyDigest"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Weekly Digest</FormLabel>
                <FormDescription>Receive a weekly summary of your security status</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataSharing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Anonymous Data Sharing</FormLabel>
                <FormDescription>Help improve MAGEN by sharing anonymous usage data</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
