# Phase 1 Roadmap (Foundation)

Purpose: establish the core foundation so Phase 2 work can start without rework. This plan follows the order in the master documents and keeps scope tightly within Phase 1.

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

## Phase 1 Goals
- App scaffold initialized
- Design system applied (colors, typography, spacing, zero radius)
- UI stack: Tailwind CSS + custom components (Framer Motion later)
- Supabase configured (project, env vars, schema, client helpers)
- Auth flows working (Google, GitHub, email)
- Onboarding creates first skill and redirects to dashboard

## Task 1.1: Project Setup
Owner: You

1.1.1 Initialize Next.js project
- [x] Create the Next.js app with TypeScript and Tailwind
- [x] Confirm dev server runs locally

1.1.2 Install core dependencies
- [x] Install Supabase client and auth helpers (@supabase/supabase-js @supabase/ssr)
- [x] Install date utilities, schema validation, and forms (date-fns, zod, react-hook-form)
- [x] Install charts and animation libraries (recharts, framer-motion, lucide-react)
- [x] Install Radix UI primitives (dialog, select, slider, tabs, progress, label, tooltip)

1.1.3 Configure Tailwind with Digital Temple system
- [x] Add @theme tokens to globals.css (colors, fonts, zero radius) — Tailwind v4 CSS-first
- [x] Load fonts via next/font/google in layout.tsx (Newsreader, Inter, Space Mono)
- [x] Confirm tokens are usable in styles — copper, gold, dark bg, all three fonts verified ✅

1.1.4 Create folder structure
- [x] Create app route groups and layout — (auth)/, (dashboard)/, auth/callback/
- [x] Create lib folders for Supabase and types — lib/supabase/, lib/utils/, lib/types/
- [x] Create components folders — components/ui/, focus-timer/, skill-card/, charts/
- [x] Create src/proxy.ts placeholder (Next.js 16: `middleware.ts` renamed to `proxy.ts`)

Acceptance checks
- [x] No TypeScript errors — tsc --noEmit clean ✅
- [x] Dev server runs ✅
- [x] Tailwind tokens are available — copper, gold, fonts, dark bg all verified ✅

## ✅ TASK 1.1 COMPLETE

## Task 1.2: Supabase Setup
Owner: You

1.2.1 Create Supabase project
- [x] Project created — project ref: utpbnnfnetxicduftjlw
- [x] URL and publishable key confirmed accessible

1.2.2 Configure environment variables
- [x] .env.local created with real credentials (not committed)
- [x] .env.example committed with safe placeholder values
- [x] .env* pattern in .gitignore covers all env files
- [x] SUPABASE_SERVICE_ROLE_KEY added to .env.local ✅

1.2.3 Run database migrations
- [x] Schema SQL run in Supabase SQL editor ✅
- [x] Tables confirmed: profiles, skills, focus_sessions ✅
- [x] Triggers confirmed: on_auth_user_created, handle_profiles_updated_at, handle_skills_updated_at ✅
- [x] RLS enabled on all three tables ✅

1.2.4 Generate TypeScript types
- [x] Auto-generated types via: supabase gen types typescript --project-id utpbnnfnetxicduftjlw ✅
- [x] src/lib/types/index.ts exports Tables, TablesInsert, TablesUpdate, Enums helpers ✅
- [x] Note: re-run this command after any schema change

1.2.5 Create Supabase client helpers
- [x] src/lib/supabase/client.ts — browser client (createBrowserClient)
- [x] src/lib/supabase/server.ts — server client with cookie handling (async)
- [x] src/lib/supabase/middleware.ts — session refresh + route protection (updateSession)
- [x] src/proxy.ts — wired to call updateSession on every request
- [x] Note: uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (new Supabase format, not ANON_KEY)

1.2.6 Set up OAuth providers
- [x] Google OAuth enabled in Supabase dashboard ✅
- [x] GitHub OAuth enabled in Supabase dashboard ✅
- [x] Callback URL set: https://utpbnnfnetxicduftjlw.supabase.co/auth/v1/callback ✅

Acceptance checks
- [x] All three providers enabled in Supabase: Email, Google, GitHub ✅
- [x] All helpers compile — tsc --noEmit clean ✅

## ✅ TASK 1.2 COMPLETE

## Task 1.3: Authentication Flow
Owner: Claude (agent implemented)

1.3.1 Build landing page
- [x] Digital Temple design — copper headline, mandala watermark, corner anchors ✅
- [x] Google, GitHub, Email auth buttons with loading states ✅
- [x] Server component — redirects logged-in users to /dashboard ✅

1.3.2 Implement Google OAuth login
- [x] signInWithOAuth with redirect to /auth/callback?next=/onboarding ✅

1.3.3 Implement GitHub OAuth login
- [x] signInWithOAuth with redirect to /auth/callback?next=/onboarding ✅

1.3.4 Implement email signup
- [x] Zod validation (email, password strength, confirm match) ✅
- [x] Success state — "check your email" message ✅
- [x] emailRedirectTo → /auth/callback?next=/onboarding ✅

1.3.5 Implement email login
- [x] signInWithPassword with error handling ✅
- [x] Password show/hide toggle ✅
- [x] Redirects to /dashboard on success ✅

1.3.6 Create auth callback route
- [x] exchangeCodeForSession → redirect to `next` param ✅
- [x] Fallback to /login?error=auth_callback_failed ✅

1.3.7 Create auth middleware
- [x] proxy.ts → updateSession on every request ✅
- [x] Protected routes: /dashboard, /skills, /analytics, /onboarding ✅
- [x] Auth routes: /login, /signup (redirect to /dashboard if logged in) ✅

1.3.8 Test auth flows end to end
- [ ] Google OAuth — test in browser
- [ ] GitHub OAuth — test in browser
- [ ] Email signup and login — test in browser
- [ ] Logout — test in browser

Acceptance checks
- [ ] Auth success redirects correctly — test in browser
- [ ] Session persists on refresh — test in browser

## Task 1.4: Onboarding (First Skill)
Owner: Claude (agent implemented)

1.4.1 Create onboarding page
- [x] Digital Temple design — corner anchors, deepest black bg ✅
- [x] Server component — redirects if user already has skills ✅

1.4.2 Build skill creation form
- [x] Zod validation on skill name ✅
- [x] Error messages inline ✅

1.4.3 Create icon picker
- [x] 12 emoji options, tap to select ✅
- [x] Color picker — 8 colors ✅

1.4.4 Implement create skill mutation
- [x] Inserts into skills table with user_id, icon, color, target_hours, daily_goal_minutes ✅
- [x] Error handling from Supabase ✅

1.4.5 Redirect to dashboard after creation
- [x] router.push('/dashboard') on success ✅

1.4.6 Handle skip flow
- [x] Skip button → router.push('/dashboard') ✅
- [x] Dashboard handles zero skills gracefully ✅

Acceptance checks
- [ ] New user can create a skill — test in browser
- [ ] Redirect works — test in browser

## ⚠️ ADMIN SETUP — Run after first login
After signing in for the first time, your User ID is shown on the dashboard.
Run this in Supabase SQL editor (replace the UUID):

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-ID-HERE';
```

The Admin badge will appear in the nav on next page load.

## Progress Notes
- Date:
- Notes:
- Blockers:
