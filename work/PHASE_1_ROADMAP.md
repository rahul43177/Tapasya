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
- [ ] SUPABASE_SERVICE_ROLE_KEY still needs to be filled in .env.local

1.2.3 Run database migrations
- [ ] Run schema SQL in Supabase SQL editor (see MASTER_PLAN.md → DATABASE SCHEMA)
- [ ] Confirm tables exist: profiles, skills, focus_sessions
- [ ] Confirm triggers exist: on_auth_user_created, handle_profiles_updated_at, handle_skills_updated_at
- [ ] Confirm RLS enabled on all three tables

1.2.4 Generate TypeScript types
- [x] Hand-written types created at src/lib/types/database.ts (matches schema exactly)
- [ ] Replace with auto-generated types after migrations run:
      npx supabase gen types typescript --project-id utpbnnfnetxicduftjlw > src/lib/types/database.ts

1.2.5 Create Supabase client helpers
- [x] src/lib/supabase/client.ts — browser client (createBrowserClient)
- [x] src/lib/supabase/server.ts — server client with cookie handling (async)
- [x] src/lib/supabase/middleware.ts — session refresh + route protection (updateSession)
- [x] src/proxy.ts — wired to call updateSession on every request
- [x] Note: uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (new Supabase format, not ANON_KEY)

1.2.6 Set up OAuth providers
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Configure GitHub OAuth in Supabase dashboard
- [ ] Verify callback URL is set correctly

Acceptance checks
- [ ] Supabase connection works (test after migrations)
- [x] All helpers compile — tsc --noEmit clean ✅

## Task 1.3: Authentication Flow
Owner: You

1.3.1 Build landing page
- [ ] Implement layout per design system
- [ ] Add auth buttons (Google, GitHub, Email)

1.3.2 Implement Google OAuth login
- [ ] OAuth flow redirects and completes

1.3.3 Implement GitHub OAuth login
- [ ] OAuth flow redirects and completes

1.3.4 Implement email signup
- [ ] Form validation works
- [ ] User created in auth

1.3.5 Implement email login
- [ ] Errors handled and redirected

1.3.6 Create auth callback route
- [ ] Exchange code for session
- [ ] Redirect to onboarding or dashboard

1.3.7 Create auth middleware
- [ ] Protect dashboard routes
- [ ] Avoid redirect loops

1.3.8 Test auth flows end to end
- [ ] Google
- [ ] GitHub
- [ ] Email signup and login
- [ ] Logout

Acceptance checks
- [ ] Auth success redirects correctly
- [ ] Session persists on refresh

## Task 1.4: Onboarding (First Skill)
Owner: You

1.4.1 Create onboarding page
- [ ] Welcome message and layout
- [ ] Form fields visible and styled

1.4.2 Build skill creation form
- [ ] Validation rules
- [ ] Error messages

1.4.3 Create icon picker component
- [ ] Emoji grid
- [ ] Selection works on mobile

1.4.4 Implement create skill mutation
- [ ] Skill saved in database
- [ ] Return created data

1.4.5 Redirect to dashboard after creation
- [ ] Success message
- [ ] Dashboard shows new skill

1.4.6 Handle skip flow
- [ ] Skip button works
- [ ] No errors with zero skills

Acceptance checks
- [ ] New user can create a skill
- [ ] Redirect works

## Progress Notes
- Date:
- Notes:
- Blockers:
