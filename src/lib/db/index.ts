import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type User = Database['public']['Tables']['users']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Prospect = Database['public']['Tables']['prospects']['Row']
export type GeneratedEmail = Database['public']['Tables']['generated_emails']['Row']

export const getUserByEmail = async (email: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  return data
}

export const getUserById = async (id: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createCampaign = async (user_id: string, name: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ user_id, name, status: 'draft' })
    .select()
    .single()

  if (error) throw error
  return data
}

export const deductCredits = async (user_id: string, amount: number) => {
  const supabase = createClient()
  const { error } = await supabase.rpc('deduct_credits', {
    p_user_id: user_id,
    p_amount: amount
  })

  if (error) throw error
}

export const createProspect = async (prospect: Database['public']['Tables']['prospects']['Insert']) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('prospects')
    .insert(prospect)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getProspectsByCampaign = async (campaign_id: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('campaign_id', campaign_id)

  if (error) throw error
  return data
}

export const createGeneratedEmail = async (email: Database['public']['Tables']['generated_emails']['Insert']) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('generated_emails')
    .insert(email)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateGeneratedEmail = async (id: string, updates: Database['public']['Tables']['generated_emails']['Update']) => {
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
