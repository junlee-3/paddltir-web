# Paddltir

Personal fork of the dragon-boat crew management app (rebranded from the school IA product).

## Stack

- React 18 + TypeScript + Vite + Tailwind
- **Supabase** — Auth, Postgres, Storage
- **Vercel** — hosting (SPA rewrites)

This repository has **no** Firebase SDK, Firebase Hosting config, or connection to the original IA Firebase project. Do **not** run `firebase deploy` here.

## Setup

1. Create a Supabase project and run `supabase/migrations/20260309_init.sql` in the SQL editor.
2. Enable Email auth in Supabase Auth settings; create a user for yourself.
3. Copy `.env.example` → `.env.local` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Install and run:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — local Vite server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build

## Landing

Static marketing pages live in `landing/`.
