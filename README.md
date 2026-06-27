# OutboundAI

Hyper-personalized cold email campaigns in minutes.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Supabase (Auth & Database)
- Stripe (Subscriptions)
- OpenAI API (Email Generation)

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values
4. Run the development server: `npm run dev`

## Database Schema
The database schema is managed via Supabase migrations. The initial schema includes:
- `users`: User profiles and credit tracking
- `campaigns`: Grouping of prospects and outreach
- `prospects`: Individual targets for outreach
- `generated_emails`: AI-generated content variants
- `subscriptions`: Stripe subscription state
- `usage_logs`: Credit consumption history

Refer to `src/types/database.ts` for TypeScript definitions and `src/lib/db/` for helper functions.
