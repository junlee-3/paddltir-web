# Paddltir

Dragon boat crew management — rosters, crewlists, and boat configs.

## License

Proprietary © Jun Lee. All rights reserved. Source is public for inspection only — you may not use, host, modify, distribute, or sell this software without written permission from the copyright holder (a purchase or paid plan is that permission, under the sale terms). See [LICENSE](./LICENSE).

## Stack

- React 18 + TypeScript + Vite + Tailwind
- Supabase — Auth, Postgres, Storage
- Vercel — hosting

## Setup

1. Create a Supabase project and run `supabase/migrations/20260309_init.sql` in the SQL editor.
2. Enable Email auth; create a user.
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

Static marketing pages live in `landing/` (also shipped under `/landing` on deploy).
