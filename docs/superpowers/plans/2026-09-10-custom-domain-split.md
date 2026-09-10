# Custom Domain Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split marketing (Next.js) onto `paddltir.com` and the Vite app onto `app.paddltir.com`, same GitHub repo, two Vercel projects.

**Architecture:** Reuse `paddltir-web` as Next-only (`website/` root). Create `paddltir-app` as Vite-only (repo root). Rewire hardcoded URLs and CTAs. User completes Porkbun DNS + Supabase Auth URLs after Vercel domain attach.

**Tech Stack:** Next.js 15 (`website/`), Vite 7 + React Router (`src/`), Vercel, Porkbun DNS, Supabase Auth

## Global Constraints

- Single GitHub repo `junlee-3/paddltir-web` — never split repos
- Marketing framework must stay Next.js; app must stay Vite — never mix build commands on the wrong project
- Apex `paddltir.com` is canonical; `www` redirects to apex
- Do not commit unless user asks
- Do not tell user to edit Porkbun/Supabase until domains are attached and exact records are known

## File map

| File | Responsibility |
|------|----------------|
| `website/lib/urls.ts` | `SITE_URL` / `APP_URL` constants |
| `website/lib/schema.ts`, `breadcrumbs.ts`, pages, `llms*.txt` | Canonical marketing URLs |
| `website/components/site/Nav.tsx`, `ClosingCta.tsx`, `app/page.tsx` | Open App → app subdomain |
| `website/next.config.ts` | Redirects, CSP, Link header |
| `website/middleware.ts` | Replace SPA rewrite with redirect to app host |
| `website/vercel.json` | Next-only build (no Vite) |
| `vercel.json` (root) | Vite app project config |
| `vite.config.ts` | `base: '/'`, stop copying into website for prod split |
| `src/main.tsx`, `ErrorBoundary.tsx` | Remove `/app` basename |
| Vercel dashboard/CLI | Two projects, domains, env |

---

### Task 1: Centralize site/app URLs in website

**Files:**
- Create: `website/lib/urls.ts`
- Modify: `website/lib/schema.ts`, `website/lib/breadcrumbs.ts`, `website/app/layout.tsx`, `website/app/sitemap.ts`, `website/app/robots.ts`, `website/app/page.tsx`, `website/app/about/page.tsx`, `website/app/docs/page.tsx`

**Interfaces:**
- Produces: `export const SITE_URL = "https://paddltir.com"` and `export const APP_URL = "https://app.paddltir.com"`

- [ ] **Step 1: Add `website/lib/urls.ts`**

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://paddltir.com";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.paddltir.com";
```

- [ ] **Step 2: Replace local `SITE = "https://paddltir-web.vercel.app"` imports/usages with `SITE_URL` from `urls.ts`**
- [ ] **Step 3: Grep for `paddltir-web.vercel.app` under `website/` (excluding `_archived`) and fix remaining copy/SEO files**

---

### Task 2: Point Open App CTAs at app subdomain

**Files:**
- Modify: `website/components/site/Nav.tsx`, `website/components/site/ClosingCta.tsx`, `website/app/page.tsx`

- [ ] **Step 1: Change `href="/app"` to `href={APP_URL}` (or `href={APP_URL}` string)**
- [ ] **Step 2: Verify no remaining marketing CTA uses relative `/app`**

---

### Task 3: Next config + middleware — redirects, not SPA hosting

**Files:**
- Modify: `website/next.config.ts`, `website/middleware.ts`, `website/vercel.json`

- [ ] **Step 1: Update redirects** — `/app` and `/app/:path*` → `https://app.paddltir.com` and `https://app.paddltir.com/:path*`; `/install*` → app URL; MCP probes → app URL
- [ ] **Step 2: Update CSP connect-src and Link service-desc to app/site domains**
- [ ] **Step 3: Replace middleware SPA rewrites with 308 redirects to `APP_URL` (or delete middleware if redirects cover all)**
- [ ] **Step 4: Set `website/vercel.json` to Next-only:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build"
}
```

---

### Task 4: Decouple Vite app from `/app` path

**Files:**
- Modify: `vite.config.ts`, `src/main.tsx`, `src/components/ErrorBoundary.tsx`, root `vercel.json`

- [ ] **Step 1: Set `base: '/'`, remove or gate `copy-app-into-website` plugin**
- [ ] **Step 2: Remove `basename="/app"` from BrowserRouter**
- [ ] **Step 3: ErrorBoundary → `window.location.assign("/")`**
- [ ] **Step 4: Root `vercel.json` for Vite-only app project:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build:app",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

(Confirm SPA fallback syntax for Vite on Vercel; use framework defaults if rewrites redundant.)

---

### Task 5: Vercel — retarget marketing + create app project

- [ ] **Step 1: Inspect current `paddltir-web` settings via CLI/API**
- [ ] **Step 2: Set Root Directory to `website`, Next-only build (no `build:app`)**
- [ ] **Step 3: Create `paddltir-app` from same GitHub repo, root `.`, Vite**
- [ ] **Step 4: Copy `VITE_SUPABASE_*` env vars to `paddltir-app`**
- [ ] **Step 5: Set `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL` on marketing project**
- [ ] **Step 6: Attach domains `paddltir.com`, `www.paddltir.com` → marketing; `app.paddltir.com` → app**
- [ ] **Step 7: Capture exact DNS records Vercel shows → give user Porkbun instructions**

---

### Task 6: User handoff + verify

- [ ] **Step 1: Tell user to add Porkbun DNS (exact records)**
- [ ] **Step 2: After DNS verifies, tell user Supabase Site URL + redirect URLs**
- [ ] **Step 3: Verify apex, www, app, Open App, login, old `/app` redirect**

---

## Spec coverage

- Two projects one repo ✓
- URL map + www ✓
- Old vercel.app redirects ✓
- Supabase ✓
- Porkbun timing ✓
- Next vs Vite build isolation ✓
