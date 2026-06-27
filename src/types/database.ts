export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          company_name: string | null
          credits_remaining: number
          stripe_customer_id: string | null
          subscription_tier: string | null
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          company_name?: string | null
          credits_remaining?: number
          stripe_customer_id?: string | null
          subscription_tier?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company_name?: string | null
          credits_remaining?: number
          stripe_customer_id?: string | null
          subscription_tier?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          status: 'draft' | 'active' | 'paused' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          status?: 'draft' | 'active' | 'paused' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          status?: 'draft' | 'active' | 'paused' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      prospects: {
        Row: {
          id: string
          campaign_id: string | null
          user_id: string
          linkedin_url: string | null
          company_name: string
          prospect_name: string | null
          job_title: string | null
          research_data: Json | null
          status: 'pending' | 'researched' | 'generated' | 'sent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          user_id: string
          linkedin_url?: string | null
          company_name: string
          prospect_name?: string | null
          job_title?: string | null
          research_data?: Json | null
          status?: 'pending' | 'researched' | 'generated' | 'sent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          user_id?: string
          linkedin_url?: string | null
          company_name?: string
          prospect_name?: string | null
          job_title?: string | null
          research_data?: Json | null
          status?: 'pending' | 'researched' | 'generated' | 'sent'
          created_at?: string
          updated_at?: string
        }
      }
      generated_emails: {
        Row: {
          id: string
          prospect_id: string
          user_id: string
          campaign_id: string | null
          subject: string
          body: string
          variant_type: 'cold_intro' | 'value_prop' | 'connection'
          ab_test_group: string | null
          status: 'draft' | 'sent' | 'opened' | 'replied'
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prospect_id: string
          user_id: string
          campaign_id?: string | null
          subject: string
          body: string
          variant_type: 'cold_intro' | 'value_prop' | 'connection'
          ab_test_group?: string | null
          status?: 'draft' | 'sent' | 'opened' | 'replied'
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prospect_id?: string
          user_id?: string
          campaign_id?: string | null
          subject?: string
          body?: string
          variant_type?: 'cold_intro' | 'value_prop' | 'connection'
          ab_test_group?: string | null
          status?: 'draft' | 'sent' | 'opened' | 'replied'
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          tier: 'starter' | 'pro' | 'agency'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          tier: 'starter' | 'pro' | 'agency'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          tier?: 'starter' | 'pro' | 'agency'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action: 'research' | 'generate' | 'subject'
          credits_consumed: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: 'research' | 'generate' | 'subject'
          credits_consumed: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: 'research' | 'generate' | 'subject'
          credits_consumed?: number
          created_at?: string
        }
      }
    }
  }
}
