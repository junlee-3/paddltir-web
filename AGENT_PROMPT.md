# AGENT PROMPT — Paddltir (safe fork of CrewCoach IA)

Copy everything below the line into a new agent chat (or continue in this repo) and execute it.

---

## Mission

Create a **working fork** of my Year 12 IB Computer Science IA product as a separate app called **Paddltir**, in this repository:

`/Users/junlee/Documents/programming/paddltir-web`

The fork must keep **all app logic, UI, pages, algorithms, and behaviour identical** to the source, except:

1. **Rebrand** CrewCoach → **Paddltir** (and crewcoach → paddltir)
2. **Replace deployment/backend** from Firebase → **Vercel + Supabase**
3. **Never touch** the original assignment project or its Firebase deployment

This is a **personal/commercial fork** so I can develop Paddltir without risking my IA marks.

---

## CRITICAL SAFETY RULES (NON-NEGOTIABLE)

### 1. Original assignment is READ-ONLY

Source of truth (copy FROM here only):

`/Users/junlee/Documents/CGS/IB/IA/LEEJun-CSIA/Product/crewCoach`

**ABSOLUTE PROHIBITIONS:**

- Do **NOT** edit, move, rename, delete, or write any file under:
  - `/Users/junlee/Documents/CGS/IB/IA/LEEJun-CSIA/`
  - especially `/Users/junlee/Documents/CGS/IB/IA/LEEJun-CSIA/Product/`
- Do **NOT** run any command with cwd inside that tree that mutates files
- Do **NOT** open that project in a way that auto-saves / formats / commits
- Copy with `cp` / `rsync` **into** `paddltir-web` only — never the reverse

If you need to inspect the source, use **read-only** commands (`ls`, `cat`, `rg`, `cp`).

### 2. NEVER touch Firebase deployment

The live IA uses Firebase project **`crewcoach-4e806`**.

**FORBIDDEN forever in this task:**

- `firebase deploy` (any target)
- `firebase deploy --only hosting`
- `firebase deploy --only firestore:rules`
- `firebase use`, `firebase init`, or linking to `crewcoach-4e806`
- Changing anything that could affect `crewcoach-4e806` Auth / Firestore / Storage / Hosting
- Reusing the Firebase config keys from `src/firebase.ts` in the new app as a live backend (they must be removed from the fork)

The new app must have **zero** dependency on the Firebase JS SDK and **zero** connection to `crewcoach-4e806`.

### 3. Work only in the new repo

All writes, installs, commits, env files, Vercel/Supabase setup: **only** in:

`/Users/junlee/Documents/programming/paddltir-web`

---

## Source app snapshot (what you are forking)

- **Stack:** React 18 + TypeScript + Vite + Tailwind + React Router
- **Backend today:** Firebase Auth + Firestore + Storage (+ Analytics)
- **Hosting today:** Firebase Hosting (`firebase.json` SPA rewrites to `index.html`)
- **Data model (Firestore):**
  - `users/{userId}/paddlers/{paddlerId}`
  - `users/{userId}/configs/{configId}`
  - `users/{userId}/crewlists/{crewlistId}`
  - Rules: authenticated user can only R/W their own `userId` subtree
- **Key app areas:**
  - `src/App.tsx` — email/password auth gate
  - `src/components/Layout.tsx` — shell + logout + brand “CrewCoach”
  - `src/pages/*` — Home, PaddlersRoster, Crewlists, CrewlistDetail, Configs, ConfigCrew
  - `src/services/*` — Firestore CRUD + realtime `onSnapshot`
  - `src/services/profile.ts` — avatar upload to Storage + `updateProfile`
  - `src/lib/autoConfig.ts`, `src/lib/suggestions.ts`, `configAlgorithm.py` — keep behaviour identical
  - `landing/` — static marketing site branded CrewCoach
- **Package name:** `crewcoach`
- Visible brand strings in UI, titles, landing, mailto `hello@crewcoach.app`, FAQ mentioning Firebase, etc.

---

## Target outcome

A complete Paddltir app in `paddltir-web` that:

1. Looks and behaves like CrewCoach (same screens, same flows, same algorithms)
2. Is branded **Paddltir**
3. Uses **Supabase** for Auth + Database + Storage
4. Deploys on **Vercel** (SPA / Vite)
5. Has **no Firebase** packages, configs, or deploy scripts wired for production
6. Leaves the IA folder and Firebase project untouched

---

## Execution plan

### Phase 0 — Safety check

Before any copy:

- Confirm target repo is `paddltir-web` and is empty (or only `.git` / this prompt)
- Confirm you will never `cd` into the IA Product tree to write files
- Explicitly refuse any instinct to “also update the original” or “deploy firebase to test”

### Phase 1 — Exact copy into paddltir-web

From the **source** path, copy the full `crewCoach` app contents into `paddltir-web` (not a nested `crewCoach/` folder unless cleaner; prefer flat app root matching the Vite project).

Example approach (adjust as needed; do not write back):

```bash
rsync -a --exclude node_modules --exclude dist --exclude .DS_Store \
  "/Users/junlee/Documents/CGS/IB/IA/LEEJun-CSIA/Product/crewCoach/" \
  "/Users/junlee/Documents/programming/paddltir-web/"
```

Then in `paddltir-web` only:

- Remove Firebase-specific deploy artifacts that would tempt accidental deploy:
  - Delete or neutralize: `.firebaserc`, `firebase.json`, `firestore.rules`
  - Remove `firebase` from `package.json` dependencies after migration
- Keep app source, landing, configs, algorithm files
- Do **not** delete anything in the source tree

### Phase 2 — Rebrand CrewCoach → Paddltir

In **paddltir-web only**, systematically replace user-facing and package branding:

| From | To |
|------|----|
| CrewCoach | Paddltir |
| crewcoach | paddltir |
| crewCoach (folder/package if any remain) | paddltir |
| hello@crewcoach.app | a sensible paddltir contact placeholder (e.g. hello@paddltir.app) or omit until domain exists |
| FAQ / copy saying data is stored in Firebase | say Supabase (or “securely under your account”) |

Update at least:

- `package.json` `name`
- `index.html` `<title>`
- `src/components/Layout.tsx` brand labels
- `landing/index.html`, `landing/style.css` comments, `landing/script.js` comments
- Any other user-visible strings found by search

**Do not** rename domain concepts that are product features unless they are brand:

- Keep terms like paddler, crewlist, config, sweep, drummer if they are feature language
- Only change the **product name** CrewCoach → Paddltir

### Phase 3 — Backend migration: Firebase → Supabase

Replace Firebase Auth / Firestore / Storage with Supabase equivalents **while preserving the same service function signatures and UI behaviour** as much as possible.

#### Auth

Firebase today:

- `signInWithEmailAndPassword`
- `onAuthStateChanged`
- `signOut`
- `User` type (`uid`, `email`, `photoURL`, …)
- `updateProfile` for photo URL

Supabase target:

- Email/password auth via `@supabase/supabase-js`
- Session listener equivalent
- Map `user.id` to the same places `user.uid` was used
- Keep login UX the same (email + password form in `App.tsx`)

#### Database

Firestore paths → Postgres tables (suggested schema; keep semantics):

```text
paddlers  (id, user_id, ...fields, created_at, updated_at)
crewlists (id, user_id, ...fields, created_at, updated_at)
configs   (id, user_id, crewlist_id?, ...fields including lineup JSON, created_at, updated_at)
```

Requirements:

- Row Level Security: users can only CRUD their own rows (`auth.uid() = user_id`)
- Preserve realtime updates if practical (`supabase.channel` / postgres changes) so UI that used `onSnapshot` still live-updates; if realtime is hard, polling is acceptable only as last resort — prefer realtime
- Preserve field shapes expected by existing types/pages (`src/types/*`)
- Replace `Timestamp` types with ISO strings / `Date` equivalents without breaking UI formatting

#### Storage

- Profile avatars: Supabase Storage bucket (e.g. `avatars`) with policies so users can only write under their own folder
- Keep `uploadProfilePhoto` behaviour (size/type checks, update user photo URL)

#### Client wiring

- Replace `src/firebase.ts` with `src/supabase.ts` (or `src/lib/supabaseClient.ts`) using env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Update all imports in services / App / Layout / types
- Remove `firebase` dependency from package.json
- Add `.env.example` (never commit real secrets)
- Add SQL migration file(s) under e.g. `supabase/migrations/` documenting tables + RLS + storage policies so the project is reproducible

### Phase 4 — Hosting: Vercel (not Firebase)

- Configure Vite SPA for Vercel (rewrites all routes → `index.html`)
- Prefer `vercel.ts` / project config as appropriate for a Vite app
- Ensure `landing/` still works as intended (either served as static assets or document how it’s hosted — match current product intent)
- `npm run build` must succeed
- Deploy **only** to Vercel project for Paddltir — never Firebase

### Phase 5 — Verification checklist

Before declaring done:

- [ ] No files under `/Users/junlee/Documents/CGS/IB/IA/LEEJun-CSIA/` were modified (verify with `git status` / timestamps / checksums if that tree is a git repo)
- [ ] No `firebase deploy` was run
- [ ] `rg firebase` in paddltir-web shows no runtime Firebase SDK usage (docs mentioning “migrated from” OK)
- [ ] Brand shows Paddltir in app shell + landing + titles
- [ ] Auth login/logout works against Supabase
- [ ] Paddlers / Crewlists / Configs CRUD works
- [ ] Auto-config / suggestions behaviour unchanged
- [ ] Avatar upload works on Supabase Storage
- [ ] Vercel deploy succeeds (or local build + clear deploy instructions if credentials missing)

### Phase 6 — What to ask the human only if blocked

Only stop to ask if you need:

- Supabase project credentials / permission to create a new Supabase project
- Vercel login / link permission for deploy
- Domain / email decisions for contact links

Do **not** ask whether you may edit the IA folder or deploy Firebase — the answer is always **no**.

---

## Acceptance criteria (definition of done)

1. `paddltir-web` contains a full runnable copy of the app
2. Product name is **Paddltir** everywhere user-facing
3. Backend is Supabase; hosting path is Vercel
4. Feature parity with source UI/logic (aside from backend SDK)
5. Original IA Product folder byte-identical to before (untouched)
6. Firebase project `crewcoach-4e806` never deployed to / never modified

---

## Tone for the executing agent

Move fast, copy first, migrate backend surgically, rebrand carefully. Treat the IA path like a museum exhibit behind glass: look, never touch. If any step risks Firebase or the assignment folder, **abort that step** and choose a safe alternative in `paddltir-web` only.
