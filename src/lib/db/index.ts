import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type User = Database['public']['Tables']['users']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Prospect = Database['public']['Tables']['prospects']['Row']
export type GeneratedEmail = Database['public']['Tables']['generated_emails']['Row']
export type UsageLog = Database['public']['Tables']['usage_logs']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) return null
  return data
}

export const getUserById = async (id: string): Promise<User | null> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export const updateUser = async (id: string, updates: Database['public']['Tables']['users']['Update']): Promise<User> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getCampaignsByUser = async (user_id: string): Promise<Campaign[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createCampaign = async (user_id: string, name: string): Promise<Campaign> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ user_id, name, status: 'draft' })
    .select()
    .single()

  if (error) throw error
  return data
}

export const deductCredits = async (user_id: string, amount: number): Promise<void> => {
  const supabase = createClient()
  const { error } = await supabase.rpc('deduct_credits', {
    p_user_id: user_id,
    p_amount: amount
  })

  if (error) throw error
}

export const createProspect = async (prospect: Database['public']['Tables']['prospects']['Insert']): Promise<Prospect> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('prospects')
    .insert(prospect)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getProspectsByCampaign = async (campaign_id: string): Promise<Prospect[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('campaign_id', campaign_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createGeneratedEmail = async (email: Database['public']['Tables']['generated_emails']['Insert']): Promise<GeneratedEmail> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('generated_emails')
    .insert(email)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getGeneratedEmailsByProspect = async (prospect_id: string): Promise<GeneratedEmail[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('generated_emails')
    .select('*')
    .eq('prospect_id', prospect_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const updateGeneratedEmail = async (id: string, updates: Database['public']['Tables']['generated_emails']['Update']): Promise<GeneratedEmail> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('generated_emails')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserUsageLogs = async (user_id: string): Promise<UsageLog[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getSubscriptionByUser = async (user_id: string): Promise<Subscription | null> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (error) return null
  return data
}
