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
          company: string | null
          credits_remaining: number
          stripe_customer_id: string | null
          subscription_tier: string
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          company?: string | null
          credits_remaining?: number
          stripe_customer_id?: string | null
          subscription_tier?: string
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company?: string | null
          credits_remaining?: number
          stripe_customer_id?: string | null
          subscription_tier?: string
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
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      prospects: {
        Row: {
          id: string
          campaign_id: string
          user_id: string
          linkedin_url: string | null
          company_name: string | null
          role: string | null
          research_data: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          user_id: string
          linkedin_url?: string | null
          company_name?: string | null
          role?: string | null
          research_data?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          user_id?: string
          linkedin_url?: string | null
          company_name?: string | null
          role?: string | null
          research_data?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      generated_emails: {
        Row: {
          id: string
          prospect_id: string
          user_id: string
          subject: string | null
          body: string | null
          variant: string | null
          type: string | null
          status: string
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prospect_id: string
          user_id: string
          subject?: string | null
          body?: string | null
          variant?: string | null
          type?: string | null
          status?: string
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prospect_id?: string
          user_id?: string
          subject?: string | null
          body?: string | null
          variant?: string | null
          type?: string | null
          status?: string
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
