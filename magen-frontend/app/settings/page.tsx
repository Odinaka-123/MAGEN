import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <SettingsForm />
      </div>
    </div>
  )
}
