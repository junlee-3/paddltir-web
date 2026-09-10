# Custom domain split: paddltir.com + app.paddltir.com

**Date:** 2026-09-10  
**Status:** Approved design  
**Repo:** `junlee-3/paddltir-web` (single GitHub repo, two Vercel projects)

## Goal

- `https://paddltir.com` → marketing website (Next.js in `website/`)
- `https://www.paddltir.com` → 308 redirect to apex `paddltir.com`
- `https://app.paddltir.com` → product app (Vite + React Router at repo root)
- “Open App” CTAs → `https://app.paddltir.com` (not same-origin `/app`)
- Old host `https://paddltir-web.vercel.app` → redirect to `paddltir.com`
- Old path `https://paddltir-web.vercel.app/app/*` → redirect to `https://app.paddltir.com/*`

## Current state (why this breaks if we only add a domain)

Today there is **one** Vercel project (`paddltir-web`) that:

1. Runs `vite build` with `base: '/app/'`
2. Copies `dist/` into `website/public/app`
3. Builds Next.js and serves marketing at `/` and the SPA at `/app`

Root `vercel.json`:

- `framework: nextjs`
- `buildCommand: npm run build:app && npm run build --prefix website`
- `outputDirectory: website/.next`

Pointing `paddltir.com` and `app.paddltir.com` at this single project without splitting would leave the app path-prefixed and confuse which host owns which surface.

## Stack clarity (do not mix)

| Surface | Directory | Framework | Must deploy as |
|--------|-----------|-----------|----------------|
| Marketing | `website/` | Next.js 15 (React) | Next.js project |
| App | repo root (`src/`, `vite.config.ts`) | Vite + React 18 + React Router | Vite / static SPA project |

These are **not** interchangeable. Each Vercel project must use the matching framework preset and build command.

## Architecture

### Vercel Project A — `paddltir-web` (reuse existing)

- Git: same repo `junlee-3/paddltir-web`
- Root Directory: `website`
- Framework: Next.js
- Install: `npm install` (inside `website`; adjust if monorepo install from parent is required)
- Build: `next build` only — **never** run `vite build` or copy app into `public/app`
- Domains: `paddltir.com`, `www.paddltir.com`
- Redirects:
  - `/app`, `/app/:path*` → `https://app.paddltir.com/:path*`
  - `/install`, `/install/:path*` → `https://app.paddltir.com`
  - MCP probe paths that currently point at `/app` → `https://app.paddltir.com`
- Remove SPA middleware that rewrites `/app` → `/app/index.html` (or replace with redirects only)
- Canonical site URL: `https://paddltir.com` (env-driven preferred: `NEXT_PUBLIC_SITE_URL`)
- App URL for CTAs: `https://app.paddltir.com` (env-driven preferred: `NEXT_PUBLIC_APP_URL`)

### Vercel Project B — `paddltir-app` (new)

- Git: same repo `junlee-3/paddltir-web`
- Root Directory: `.` (repository root)
- Framework: Vite
- Build: `vite build` → `dist/`
- Output: `dist`
- Domains: `app.paddltir.com`
- Vite `base: '/'`
- React Router: remove `basename="/app"` (use `/` or omit)
- Disable/remove production use of the `copy-app-into-website` Vite plugin for this deploy path
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (copy from current project)

### Old combined build

- Stop using root `vercel.json` that builds app + website together for production Project A.
- Keep local `npm run build` only if useful for optional one-shot local checks; production deploys are split.

## Code rewire checklist

1. Replace hardcoded `https://paddltir-web.vercel.app` with `https://paddltir.com` (or `NEXT_PUBLIC_SITE_URL`) in:
   - `website/lib/schema.ts`, `website/lib/breadcrumbs.ts`
   - `website/app/layout.tsx`, `sitemap.ts`, `robots.ts`
   - page JSON-LD (`page.tsx`, `about`, `docs`, etc.)
   - `website/public/llms.txt`, `llms-full.txt`
   - privacy/terms copy
2. Change Open App / CTAs from `href="/app"` to app origin in:
   - `website/components/site/Nav.tsx`
   - `website/components/site/ClosingCta.tsx`
   - `website/app/page.tsx`
3. Update `website/next.config.ts` CSP `connect-src`, Link headers, redirects
4. Vite app: `base`, `basename`, ErrorBoundary home path
5. Optional: redirect leftover marketing `/app` traffic permanently to subdomain

## Supabase Auth

User confirmed password auth is in use.

In Supabase Dashboard → Authentication → URL configuration:

- **Site URL:** `https://app.paddltir.com`
- **Redirect URLs:** add `https://app.paddltir.com/**`
- Keep `https://paddltir-web.vercel.app/app/**` temporarily during cutover, then remove after verification

## DNS (Porkbun — user action)

Domain stays registered at Porkbun. Do **not** transfer to Vercel.

After domains are added in Vercel, user adds Porkbun DNS records Vercel shows, typically:

| Host | Type | Value |
|------|------|--------|
| `@` (apex) | A | `76.76.21.21` (confirm in Vercel UI) |
| `www` | CNAME | Vercel CNAME target |
| `app` | CNAME | Vercel CNAME target |

Propagation can take minutes to hours. SSL issues on Vercel once DNS verifies.

## Cutover order (do not scramble)

1. **Code + Vercel project split** (agent) — land redirects and dual projects on preview/production vercel.app hosts first where possible
2. **Add custom domains in Vercel** (agent) — get exact DNS records
3. **Tell user: Porkbun DNS now** — user pastes records; agent waits for verification
4. **Tell user: Supabase URL config now** — user updates Site URL + redirects
5. **Verify** — apex site, www redirect, app login, Open App CTA, old `/app` redirect
6. **Cleanup** — remove temporary old redirect allowlists; stop nesting SPA under Next

## Ownership

| Task | Who |
|------|-----|
| Code rewire, Vercel projects, domain attach, env copy | Agent |
| Porkbun DNS record edits | User (when agent says go) |
| Supabase Auth URL settings | User (when agent says go) |
| Domain purchase/transfer | Not needed (already on Porkbun) |

## Out of scope

- Moving email / MX records
- Changing contact email (`hello@paddltir.app` vs `@paddltir.com`)
- Formal Turborepo conversion
- Splitting into two GitHub repositories

## Success criteria

- Visiting `paddltir.com` shows marketing site only (no app shell)
- Visiting `app.paddltir.com` shows the Vite app at `/` (not `/app`)
- Open App from marketing lands on `app.paddltir.com`
- Login works after Supabase URL update
- `www.paddltir.com` redirects to apex
- Old `paddltir-web.vercel.app/app` redirects to `app.paddltir.com`
- Marketing Vercel build does not invoke Vite; app Vercel build does not invoke Next.js
