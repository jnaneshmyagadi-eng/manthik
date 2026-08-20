# Manthik

**AI Growth Operating System**

> Turn your product into customers.

Not a chatbot. Not a content generator. A growth OS that answers: **What should I do next to get more customers?**

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- Supabase (Auth, Postgres, RLS)
- AI provider abstraction (demo mode without key; xAI-compatible when `AI_API_KEY` is set)
- Vercel

## Core loop

1. Create Growth Project
2. Product / Customer / Competitor intelligence
3. Ranked Opportunity Engine
4. Growth Strategy
5. **Today** — daily actionable tasks
6. Content, Experiments, Growth Memory

## Setup

```bash
npm install
cp .env.example .env.local
```

Required:

```
NEXT_PUBLIC_SUPABASE_URL=https://ejvyklqdqirxfccevvwv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional live AI:

```
AI_API_KEY=
AI_BASE_URL=https://api.x.ai/v1
AI_MODEL=grok-2-latest
```

## Security

- RLS on all project-scoped tables
- `user_project_ids()` helper for membership
- No secrets in client bundles
- Demo data clearly labelled

## Deploy

Import this repo on Vercel, set env vars, add production URL to Supabase Auth redirect URLs.
