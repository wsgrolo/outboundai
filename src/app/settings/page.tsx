import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

export default async function Settings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium text-gray-500">Name</span>
              <p>{profile?.name || 'Not set'}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p>{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage & Billing</CardTitle>
            <CardDescription>Manage your subscription and credits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium text-gray-500">Current Plan</span>
              <p className="capitalize">{profile?.subscription_tier || 'Free Trial'}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium text-gray-500">Credits Remaining</span>
              <p>{profile?.credits_remaining || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
