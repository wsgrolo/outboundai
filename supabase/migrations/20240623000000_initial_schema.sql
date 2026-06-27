-- OutboundAI Initial Schema
-- Ratified: 2026-06-23

-- Create a table for public user profiles
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  name text,
  company_name text,
  credits_remaining integer default 0 not null,
  stripe_customer_id text,
  subscription_tier text, -- starter/pro/agency
  trial_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for campaigns
create table if not exists public.campaigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  name text not null,
  status text default 'draft' not null, -- draft/active/paused/completed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for prospects
create table if not exists public.prospects (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references public.campaigns on delete cascade,
  user_id uuid references public.users on delete cascade not null,
  linkedin_url text,
  company_name text not null,
  prospect_name text,
  job_title text,
  research_data jsonb,
  status text default 'pending' not null, -- pending/researched/generated/sent
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for generated emails
create table if not exists public.generated_emails (
  id uuid default gen_random_uuid() primary key,
  prospect_id uuid references public.prospects on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  campaign_id uuid references public.campaigns on delete cascade,
  subject text not null,
  body text not null,
  variant_type text not null, -- cold_intro/value_prop/connection
  ab_test_group text,
  status text default 'draft' not null, -- draft/sent/opened/replied
  sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for subscriptions
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  stripe_subscription_id text unique not null,
  tier text not null, -- starter/pro/agency
  status text not null, -- active/canceled/past_due/trialing
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for usage logs
create table if not exists public.usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  action text not null, -- research/generate/subject
  credits_consumed integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.campaigns enable row level security;
alter table public.prospects enable row level security;
alter table public.generated_emails enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_logs enable row level security;

-- Policies for public.users
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Policies for public.campaigns
create policy "Users can view their own campaigns" on public.campaigns
  for select using (auth.uid() = user_id);

create policy "Users can create their own campaigns" on public.campaigns
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own campaigns" on public.campaigns
  for update using (auth.uid() = user_id);

create policy "Users can delete their own campaigns" on public.campaigns
  for delete using (auth.uid() = user_id);

-- Policies for public.prospects
create policy "Users can view their own prospects" on public.prospects
  for select using (auth.uid() = user_id);

create policy "Users can create their own prospects" on public.prospects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own prospects" on public.prospects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own prospects" on public.prospects
  for delete using (auth.uid() = user_id);

-- Policies for public.generated_emails
create policy "Users can view their own emails" on public.generated_emails
  for select using (auth.uid() = user_id);

create policy "Users can create their own emails" on public.generated_emails
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own emails" on public.generated_emails
  for update using (auth.uid() = user_id);

create policy "Users can delete their own emails" on public.generated_emails
  for delete using (auth.uid() = user_id);

-- Policies for public.subscriptions
create policy "Users can view their own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Policies for public.usage_logs
create policy "Users can view their own usage logs" on public.usage_logs
  for select using (auth.uid() = user_id);

-- Create indexes for foreign keys and common query fields
create index if not exists campaigns_user_id_idx on public.campaigns (user_id);
create index if not exists prospects_campaign_id_idx on public.prospects (campaign_id);
create index if not exists prospects_user_id_idx on public.prospects (user_id);
create index if not exists generated_emails_prospect_id_idx on public.generated_emails (prospect_id);
create index if not exists generated_emails_user_id_idx on public.generated_emails (user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists usage_logs_user_id_idx on public.usage_logs (user_id);

-- Trigger to create a public.users row on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to deduct credits from a user
create or replace function public.deduct_credits(p_user_id uuid, p_amount integer)
returns void as $$
begin
  update public.users
  set credits_remaining = credits_remaining - p_amount
  where id = p_user_id;
end;
$$ language plpgsql security definer;
