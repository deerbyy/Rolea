# Rolea

Rolea is a Russian-language AI roleplay storytelling product. Users create worlds, characters, and stories, then play through scenes in a chat where AI acts as the story director.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth/Postgres/RLS
- Gemini API through server-side routes
- Stripe webhook placeholder for subscriptions

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without env values, the app runs in demo mode with local sample data and mocked Gemini responses.

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Supabase

Apply `supabase/migrations/001_initial_schema.sql` to create the first schema and RLS policies.

## Implemented flows

- Landing page with Rolea positioning and CTA.
- Auth page with Supabase browser client and demo fallback.
- Onboarding wizard: genre, format, world, character, user role, first scene generation.
- App dashboard: stories, characters, worlds, community and subscription placeholders.
- Story chat: narrative messages, character replies, user actions, suggestions, publication toggle.
- API routes for Gemini generation, chat continuation, story publication, and Stripe webhook handling.
