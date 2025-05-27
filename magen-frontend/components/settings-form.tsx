"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile } from "@/services/api"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  emailAlerts: z.boolean(),
  inAppAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
})

export function SettingsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      emailAlerts: true,
      inAppAlerts: true,
      weeklyDigest: false,
    },
  })

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserProfile()
        form.reset({
          name: userData.name,
          email: userData.email,
          emailAlerts: userData.emailAlerts || true,
          inAppAlerts: userData.inAppAlerts || true,
          weeklyDigest: userData.weeklyDigest || false,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  )
}
