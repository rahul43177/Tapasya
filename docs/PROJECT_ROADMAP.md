# TAPASYA - PROJECT ROADMAP & TASK BREAKDOWN

**Document Purpose**: Detailed phase-by-phase task breakdown for development
**Reference**: MASTER_PLAN.md (source of truth for technical specs)
**Last Updated**: March 26, 2026

---

## 📋 HOW TO USE THIS DOCUMENT

1. **Complete each phase sequentially** (don't skip ahead)
2. **Check off tasks** as you complete them
3. **Review acceptance criteria** before marking done
4. **Reference MASTER_PLAN.md** for implementation details
5. **Update blockers/notes** as you work

---

## 🎯 PROJECT OVERVIEW

**Goal**: Ship MVP in 4 weeks that proves the core loop works

**Core Loop**:
```
Open App → See Progress → Start Focus → Complete Session →
See Updated Progress → Feel Good → Come Back Tomorrow
```

**Success Metrics**:
- [ ] User can create account in < 30 seconds
- [ ] User can start focus session in < 5 seconds from dashboard
- [ ] Dashboard loads in < 1 second
- [ ] Session saves in < 500ms
- [ ] 10 users using app daily for 7+ days

---

# PHASE 1: FOUNDATION (Week 1)

**Goal**: Set up infrastructure, auth, and first skill creation

**Duration**: 5-7 days
**Priority**: CRITICAL (blocks everything else)

---

## 🔧 TASK 1.1: Project Setup

**Owner**: Dev
**Estimated Time**: 2 hours
**Dependencies**: None

### Subtasks

- [x] **1.1.1**: Initialize Next.js project ✅ DONE
  ```bash
  npx create-next-app@latest tapasya-web --typescript --tailwind --app
  ```
  - ✅ **Acceptance Criteria**:
    - Next.js 16.2.1 installed (React 19, Tailwind v4)
    - TypeScript configured
    - Tailwind CSS v4 working (CSS-first, no tailwind.config.ts)
    - App router enabled (React Compiler on)
    - Project runs on `npm run dev`
  > **Note**: Scaffold is in `tapasya-web/` subdirectory. Uses `npm` (not pnpm). Tailwind v4 (not v3 — different config approach).

- [ ] **1.1.2**: Install core dependencies
  > ⚠️ **Note**: Use `npm` (scaffold used npm, not pnpm). `@supabase/auth-helpers-nextjs` is deprecated — use `@supabase/ssr` instead. No shadcn/ui (see 1.1.3).
  ```bash
  # Supabase (use @supabase/ssr, NOT the deprecated @supabase/auth-helpers-nextjs)
  npm install @supabase/supabase-js @supabase/ssr

  # Forms & validation
  npm install react-hook-form zod @hookform/resolvers

  # Radix UI primitives (accessible, unstyled — Phase 1 only)
  npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slider
  npm install @radix-ui/react-tabs @radix-ui/react-progress @radix-ui/react-label @radix-ui/react-tooltip

  # Charts, animation, icons, utils
  npm install recharts framer-motion lucide-react date-fns
  ```
  - ✅ **Acceptance Criteria**:
    - All packages installed without errors
    - `package.json` has correct versions
    - No TypeScript errors

- [ ] **1.1.3**: Set up Radix UI (NO shadcn/ui)
  > **Why no shadcn?** The Digital Temple design is zero-border-radius, dark-only, copper/gold palette — every shadcn default fights this. Radix UI gives you accessibility primitives with zero style opinions. You style everything yourself with Tailwind.
  - No init command needed. Radix packages are installed in 1.1.2.
  - Verify Radix is importable:
    ```typescript
    import * as Dialog from '@radix-ui/react-dialog'
    import * as Select from '@radix-ui/react-select'
    // etc.
    ```
  - ✅ **Acceptance Criteria**:
    - Can import Radix primitives without TypeScript errors
    - No peer dependency warnings

- [ ] **1.1.4**: Configure Tailwind v4 with Digital Temple design system
  - Reference: DESIGN_SYSTEM.md
  > ⚠️ **Tailwind v4 is CSS-first**: There is NO `tailwind.config.ts` in v4. All tokens are defined via `@theme` in `globals.css`. Do NOT create a tailwind.config.ts.

  **Step A** — Load fonts via `next/font/google` in `src/app/layout.tsx`:
  ```tsx
  import { Newsreader, Inter, Space_Mono } from 'next/font/google'

  const newsreader = Newsreader({
    subsets: ['latin'],
    weight: ['400', '600', '800'],
    style: ['normal', 'italic'],
    variable: '--font-newsreader-var',
  })
  const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans-var',
  })
  const spaceMono = Space_Mono({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-mono-var',
  })

  // Apply all three variables on <html>:
  // className={`${newsreader.variable} ${inter.variable} ${spaceMono.variable}`}
  ```

  **Step B** — Add Material Symbols to `<head>` in `layout.tsx`:
  ```html
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  ```

  **Step C** — Replace all contents of `src/app/globals.css` with:
  ```css
  @import "tailwindcss";

  @theme {
    /* Brand — Copper */
    --color-brand-copper: #E05C00;
    --color-primary: #ffb694;
    --color-primary-container: #ef6712;
    --color-on-primary: #571f00;

    /* Accent — Gold */
    --color-secondary: #e9c349;
    --color-secondary-container: #af8d11;
    --color-on-secondary: #3c2f00;

    /* Surfaces (dark hierarchy) */
    --color-background: #141313;
    --color-surface: #141313;
    --color-surface-container-lowest: #0e0e0e;
    --color-surface-container-low: #1c1b1b;
    --color-surface-container: #201f1f;
    --color-surface-container-high: #2a2a2a;
    --color-surface-container-highest: #353434;
    --color-surface-bright: #3a3939;

    /* Text */
    --color-on-surface: #e5e2e1;
    --color-on-surface-variant: #e1c0b2;
    --color-outline: #a88a7e;
    --color-outline-variant: #594237;

    /* Error */
    --color-error: #ffb4ab;
    --color-error-container: #93000a;

    /* Typography — variables reference next/font CSS vars */
    --font-newsreader: var(--font-newsreader-var), serif;
    --font-sans: var(--font-sans-var), ui-sans-serif, system-ui;
    --font-mono: var(--font-mono-var), monospace;

    /* Border radius — ALL ZERO (Digital Temple rule) */
    --radius: 0px;
    --radius-sm: 0px;
    --radius-md: 0px;
    --radius-lg: 0px;
    --radius-xl: 0px;
    --radius-full: 9999px; /* Only for pill badges */
  }

  @layer base {
    html {
      background-color: #141313;
      color: #e5e2e1;
    }
  }
  ```

  - ✅ **Acceptance Criteria**:
    - `bg-brand-copper`, `text-secondary`, `bg-surface-container` etc. work as Tailwind classes
    - `font-newsreader`, `font-sans`, `font-mono` classes apply correct fonts
    - All elements have 0px border radius by default
    - `rounded-full` still works (9999px — for pill badges)
    - Material Symbols icons render correctly
    - Page renders on dark background (#141313) by default
    - No console errors

- [ ] **1.1.5**: Set up folder structure
  ```
  app/
    ├── (auth)/
    │   ├── login/
    │   └── signup/
    ├── (dashboard)/
    │   ├── dashboard/
    │   ├── skills/
    │   ├── analytics/
    │   └── profile/
    ├── api/
    └── layout.tsx
  lib/
    ├── supabase/
    ├── utils/
    └── types/
  components/
    ├── ui/ (shadcn)
    ├── focus-timer/
    ├── skill-card/
    └── charts/
  ```
  - ✅ **Acceptance Criteria**:
    - All folders created
    - Clean structure
    - No unused files

**Blockers**: None
**Notes**:

---

## 🗄️ TASK 1.2: Supabase Setup

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Task 1.1 (Project Setup)

### Subtasks

- [ ] **1.2.1**: Create Supabase project
  - Go to https://supabase.com/dashboard
  - Create new project
  - Name: "tapasya-production"
  - Region: Choose closest to users
  - Password: Generate strong password (save to password manager)
  - ✅ **Acceptance Criteria**:
    - Project created successfully
    - Can access Supabase dashboard
    - Project URL and keys visible

- [ ] **1.2.2**: Configure environment variables
  - Create `.env.local` file
  - Add Supabase URL and anon key
  - Add to `.gitignore`
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
  SUPABASE_SERVICE_ROLE_KEY=xxx
  ```
  - ✅ **Acceptance Criteria**:
    - .env.local exists and not committed
    - All three keys present
    - Keys work (test connection)

- [ ] **1.2.3**: Run database migrations
  - Copy SQL from MASTER_PLAN.md (Database Schema section)
  - Go to SQL Editor in Supabase dashboard
  - Run the following migrations in order:
    1. Enable UUID extension
    2. Create profiles table
    3. Create skills table
    4. Create focus_sessions table
    5. Create RLS policies
    6. Create database functions (update_skill_after_session, etc.)
    7. Create triggers (handle_new_user, handle_updated_at)
  - ✅ **Acceptance Criteria**:
    - All tables created (check Table Editor)
    - RLS enabled on all tables
    - Triggers working
    - No SQL errors

- [ ] **1.2.4**: Generate TypeScript types
  ```bash
  npx supabase gen types typescript --project-id [your-project-ref] > lib/database.types.ts
  ```
  - ✅ **Acceptance Criteria**:
    - database.types.ts file created
    - All tables have types
    - No TypeScript errors when importing

- [ ] **1.2.5**: Create Supabase client helpers
  - Create `lib/supabase/client.ts` (for client components)
  - Create `lib/supabase/server.ts` (for server components)
  - Create `lib/supabase/middleware.ts` (for auth middleware)
  - Reference: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
  - ✅ **Acceptance Criteria**:
    - Can call `createClient()` from client components
    - Can call `createServerClient()` from server components
    - TypeScript types work correctly

- [ ] **1.2.6**: Set up OAuth providers
  - In Supabase dashboard → Authentication → Providers
  - Enable Google OAuth:
    - Create Google OAuth app (Google Cloud Console)
    - Add callback URL from Supabase
    - Copy Client ID and Secret to Supabase
  - Enable GitHub OAuth:
    - Create GitHub OAuth app (GitHub Settings)
    - Add callback URL from Supabase
    - Copy Client ID and Secret to Supabase
  - ✅ **Acceptance Criteria**:
    - Google OAuth enabled and configured
    - GitHub OAuth enabled and configured
    - Test auth URLs work

**Blockers**:
**Notes**:

---

## 🔐 TASK 1.3: Authentication Flow

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: Task 1.2 (Supabase Setup)

### Subtasks

- [ ] **1.3.1**: Build landing page (`app/page.tsx`)
  - Reference: MASTER_PLAN.md → Screen 1: Landing Page
  - Reference: DESIGN_SYSTEM.md → Typography & Components
  - Components:
    - Hero section with app name (use font-newsreader, large italic headline)
    - Tagline (editorial serif style)
    - Value proposition (3 bullet points)
    - Auth buttons (Google, GitHub, Email) - sharp edges (border-radius: 0)
  - Design specifications:
    - Background: surface-container-lowest (#0e0e0e)
    - Headline: font-newsreader text-6xl italic font-bold
    - Primary button: bg-brand-copper with sharp corners
    - Use Material Symbols icons for auth provider logos
  - Use shadcn/ui Button component (customize to remove border-radius)
  - ✅ **Acceptance Criteria**:
    - Landing page renders
    - Typography matches design system (Newsreader headlines, Inter body)
    - Buttons have sharp corners (no border radius)
    - Copper/gold accent colors used
    - Dark surface background
    - Mobile responsive
    - Looks visually aligned with Digital Temple aesthetic

- [ ] **1.3.2**: Implement Google OAuth login
  ```typescript
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`
    }
  });
  ```
  - ✅ **Acceptance Criteria**:
    - Clicking Google button redirects to Google
    - User can authorize
    - Redirects back to app
    - User is authenticated

- [ ] **1.3.3**: Implement GitHub OAuth login
  - Same as Google but with `provider: 'github'`
  - ✅ **Acceptance Criteria**:
    - GitHub OAuth flow works
    - User can sign in
    - Redirects correctly

- [ ] **1.3.4**: Implement email/password signup
  - Create signup form with React Hook Form + Zod
  - Fields: Email, Password, Confirm Password
  - Validation rules
  ```typescript
  const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match"
  });
  ```
  - ✅ **Acceptance Criteria**:
    - Form validates correctly
    - User can sign up
    - Confirmation email sent (check Supabase settings)
    - User created in auth.users

- [ ] **1.3.5**: Implement email/password login
  - Create login form
  - Handle errors (wrong password, user not found)
  - ✅ **Acceptance Criteria**:
    - User can log in
    - Errors shown clearly
    - Redirects to dashboard on success

- [ ] **1.3.6**: Create auth callback route (`app/auth/callback/route.ts`)
  - Handle OAuth callbacks
  - Exchange code for session
  - Redirect to onboarding or dashboard
  - ✅ **Acceptance Criteria**:
    - OAuth flow completes
    - Session created
    - User redirected correctly

- [ ] **1.3.7**: Create auth proxy (route protection)
  > ⚠️ **Next.js 16**: The file is `src/proxy.ts`, NOT `src/middleware.ts`. The export must be a default function named `proxy`.
  - Protect dashboard routes
  - Redirect to login if not authenticated
  - ✅ **Acceptance Criteria**:
    - Unauthenticated users redirected to /login
    - Authenticated users can access /dashboard
    - No infinite redirect loops

- [ ] **1.3.8**: Test auth flows end-to-end
  - Test Google OAuth
  - Test GitHub OAuth
  - Test email signup → email verification → login
  - Test logout
  - ✅ **Acceptance Criteria**:
    - All auth methods work
    - No errors in console
    - User session persists on refresh

**Blockers**:
**Notes**:

---

## 🎯 TASK 1.4: Onboarding (First Skill)

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Task 1.3 (Auth Flow)

### Subtasks

- [ ] **1.4.1**: Create onboarding page (`app/(dashboard)/onboarding/page.tsx`)
  - Reference MASTER_PLAN.md → Screen 2: Onboarding
  - Layout:
    - Welcome message
    - "What skill do you want to master?" heading
    - Form inputs (name, icon, goal, daily target)
  - ✅ **Acceptance Criteria**:
    - Page renders for new users
    - Form visible and styled

- [ ] **1.4.2**: Build skill creation form
  - Fields:
    - Skill name (text input, required, max 50 chars)
    - Icon picker (emoji selector or preset grid)
    - Target hours (radio: 1000 / 10000 / custom)
    - Daily goal (slider: 0.5h - 8h)
  - Use React Hook Form + Zod validation
  - ✅ **Acceptance Criteria**:
    - Form validates correctly
    - All fields work
    - Error messages show

- [ ] **1.4.3**: Create icon picker component
  - Show grid of common emojis (💻 🎹 🎨 🏋️ ⚔️ 📚 etc.)
  - "More" button → full emoji picker (optional, use library)
  - Default: 💡
  - ✅ **Acceptance Criteria**:
    - User can select icon
    - Selected icon highlighted
    - Works on mobile

- [ ] **1.4.4**: Implement createSkill mutation
  ```typescript
  const supabase = createClient();

  const { data, error } = await supabase
    .from('skills')
    .insert({
      user_id: user.id,
      name: formData.name,
      icon: formData.icon,
      target_hours: formData.targetHours,
      daily_goal_minutes: formData.dailyGoalMinutes,
      order: 0
    })
    .select()
    .single();
  ```
  - ✅ **Acceptance Criteria**:
    - Skill created in database
    - No errors
    - Returns skill data

- [ ] **1.4.5**: Redirect to dashboard after skill creation
  - Show success message (toast/notification)
  - Redirect to `/dashboard`
  - ✅ **Acceptance Criteria**:
    - User sees success message
    - Redirects automatically
    - Skill visible on dashboard

- [ ] **1.4.6**: Handle skip flow
  - "Skip for now" button
  - Still redirect to dashboard
  - User can add skill later
  - ✅ **Acceptance Criteria**:
    - Skip button works
    - No errors if no skills

**Blockers**:
**Notes**:

---

## ✅ PHASE 1 DELIVERABLES

- [ ] Next.js project set up with TypeScript + Tailwind
- [ ] Supabase project configured with database tables
- [ ] Authentication working (Google, GitHub, Email)
- [ ] Users can sign up and create first skill
- [ ] Landing page, login, signup, onboarding pages complete

**Phase 1 Complete**: ☐
**Completion Date**: ___________

---

# PHASE 2: FOCUS TIMER & SESSION LOGGING (Week 2)

**Goal**: Build core focus timer and session saving logic

**Duration**: 5-7 days
**Priority**: CRITICAL (core product value)

---

## ⏱️ TASK 2.1: Focus Timer Component

**Owner**: Dev
**Estimated Time**: 6 hours
**Dependencies**: Phase 1 complete

### Subtasks

- [ ] **2.1.1**: Create FocusTimer component structure
  - File: `components/focus-timer/FocusTimer.tsx`
  - State management:
    - `mode: 'stopwatch' | 'pomodoro'`
    - `isRunning: boolean`
    - `elapsedSeconds: number` (stopwatch)
    - `remainingSeconds: number` (pomodoro)
  - ✅ **Acceptance Criteria**:
    - Component renders
    - State initializes correctly
    - TypeScript types defined

- [ ] **2.1.2**: Build timer display
  - Large time display (format: HH:MM:SS)
  - Function to format seconds → time string
  - Design specifications:
    - Font: font-mono (Space Mono) for timer digits
    - Size: text-9xl or larger (very prominent)
    - Color: on-surface (#e5e2e1) or brand-primary (#ffb694)
    - Weight: font-bold (700)
  - Center on screen with dark background
  - ✅ **Acceptance Criteria**:
    - Time displays correctly in Space Mono font
    - Updates every second smoothly
    - Monospace alignment perfect
    - Readable on mobile (scales appropriately)
    - Matches Digital Temple aesthetic

- [ ] **2.1.3**: Implement stopwatch mode
  - Counts up from 00:00:00
  - Start/pause/resume functionality
  - Use `setInterval` for ticking
  - ✅ **Acceptance Criteria**:
    - Timer counts up correctly
    - Start button works
    - Pause preserves time
    - Resume continues from paused time

- [ ] **2.1.4**: Implement pomodoro mode
  - Counts down from selected duration (25/50/90 min)
  - Show progress ring around timer
  - Alert when time reaches 0
  - ✅ **Acceptance Criteria**:
    - Timer counts down
    - Progress ring animates
    - Stops at 0:00:00
    - Plays sound/notification

- [ ] **2.1.5**: Add timer controls
  - Start button (▶️)
  - Pause button (⏸️)
  - Stop & Save button (⏹️)
  - Style with saffron colors
  - ✅ **Acceptance Criteria**:
    - All buttons work
    - Button states update correctly
    - Keyboard shortcuts (Space, Esc)

- [ ] **2.1.6**: Implement timer persistence
  - Save timer state to localStorage
  - On page reload, check for active session
  - Prompt user: "Resume session?" or "Discard?"
  - Calculate elapsed time since reload
  - ✅ **Acceptance Criteria**:
    - Timer survives page refresh
    - Time calculation accurate
    - User can resume or discard

- [ ] **2.1.7**: Create skill selector modal
  - Modal opens when clicking "Start Focus"
  - Dropdown to select skill
  - Radio buttons for mode (stopwatch/pomodoro)
  - Pomodoro duration selector (if pomodoro selected)
  - ✅ **Acceptance Criteria**:
    - Modal opens correctly
    - User can select skill
    - Mode selection works
    - Starts timer on confirm

**Blockers**:
**Notes**:

---

## 💾 TASK 2.2: Session Saving Logic

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: Task 2.1 (Focus Timer)

### Subtasks

- [ ] **2.2.1**: Create session complete modal
  - File: `components/SessionCompleteModal.tsx`
  - Reference: MASTER_PLAN.md → Screen 5: Session Complete
  - Reference: DESIGN_SYSTEM.md → Components & Typography
  - Components:
    - Celebration header (🎉) with Newsreader font
    - Session summary (skill, duration) - Space Mono for duration
    - Focus rating (1-5 stars) - copper color for filled stars
    - Notes textarea - sharp corners
    - Session stats preview - Space Mono for numbers
    - Save button - bg-brand-copper with sharp corners
  - Design specifications:
    - Modal background: surface-container (#201f1f)
    - Border: 1px solid brand-copper or none
    - No border radius (sharp corners)
    - Headline: font-newsreader font-semibold
    - Stats: font-mono
  - ✅ **Acceptance Criteria**:
    - Modal renders correctly
    - All fields present
    - Typography matches design system
    - Sharp corners on all elements
    - Copper accents on interactive elements

- [ ] **2.2.2**: Build focus rating component
  - 5 clickable stars
  - Hover effect
  - Default: 3 stars selected
  - ✅ **Acceptance Criteria**:
    - User can click stars
    - Visual feedback (filled/unfilled)
    - State updates correctly

- [ ] **2.2.3**: Create saveFocusSession function
  - File: `lib/sessions/saveSession.ts`
  - Reference MASTER_PLAN.md → Key Database Operations → Save Focus Session
  - Steps:
    1. Insert into focus_sessions table
    2. Call update_skill_after_session RPC
    3. Call update_user_after_session RPC
    4. Update streak (separate function)
  - ✅ **Acceptance Criteria**:
    - Session saves to database
    - Skill totals update
    - User totals update
    - No errors

- [ ] **2.2.4**: Implement streak calculation
  - File: `lib/sessions/updateStreak.ts`
  - Reference MASTER_PLAN.md → Calculate Streak section
  - Logic:
    - Check if practiced today (min 30 min)
    - Check last practice date
    - If consecutive, increment streak
    - If not, reset to 1
    - Update longest streak if needed
  - ✅ **Acceptance Criteria**:
    - Streak increments correctly
    - Streak resets when broken
    - Longest streak tracked
    - Edge cases handled (timezone, midnight)

- [ ] **2.2.5**: Wire up save button
  - On click → call saveFocusSession
  - Show loading state
  - On success → close modal, show toast, redirect to dashboard
  - On error → show error message
  - ✅ **Acceptance Criteria**:
    - Button click saves session
    - Loading spinner shows
    - Success toast appears
    - Dashboard updates with new data

- [ ] **2.2.6**: Add session stats preview
  - Show in modal:
    - "This session: +X hours"
    - "Total for [skill]: X hours"
    - "Progress: X% to goal"
    - "Streak: X days 🔥"
  - Fetch data from database
  - ✅ **Acceptance Criteria**:
    - Stats display correctly
    - Numbers update in real-time
    - Motivational copy

**Blockers**:
**Notes**:

---

## 🎉 TASK 2.3: Milestone Celebrations

**Owner**: Dev
**Estimated Time**: 2 hours
**Dependencies**: Task 2.2 (Session Saving)

### Subtasks

- [ ] **2.3.1**: Create checkMilestones function
  - Check after session save:
    - First session ever (🎉 "First session!")
    - Hour milestones (20h, 50h, 100h, 500h, 1000h)
    - Streak milestones (7, 30, 100 days)
  - Return list of unlocked milestones
  - ✅ **Acceptance Criteria**:
    - Detects milestones correctly
    - Returns array of achievements
    - No false positives

- [ ] **2.3.2**: Create milestone celebration modal
  - Show after session save (if milestone reached)
  - Confetti animation (use canvas-confetti library)
  - Milestone name and description
  - "Continue" button
  - ✅ **Acceptance Criteria**:
    - Modal shows on milestone
    - Confetti animation plays
    - User can dismiss
    - Looks celebratory

- [ ] **2.3.3**: Add sound effects (optional)
  - Play sound on milestone unlock
  - Use Web Audio API
  - Respect user's audio preferences
  - ✅ **Acceptance Criteria**:
    - Sound plays (if enabled)
    - No errors if sound fails
    - User can mute

**Blockers**:
**Notes**:

---

## ✅ PHASE 2 DELIVERABLES

- [ ] Focus timer works (stopwatch + pomodoro modes)
- [ ] Timer persists across page reloads
- [ ] Sessions save to database correctly
- [ ] Skill and user totals update
- [ ] Streaks calculate correctly
- [ ] Milestone celebrations show

**Phase 2 Complete**: ☐
**Completion Date**: ___________

---

# PHASE 3: DASHBOARD (Week 3)

**Goal**: Build the main dashboard with all widgets

**Duration**: 5-7 days
**Priority**: CRITICAL (user's home base)

---

## 🏠 TASK 3.1: Dashboard Layout

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Phase 2 complete

### Subtasks

- [ ] **3.1.1**: Create dashboard page (`app/(dashboard)/dashboard/page.tsx`)
  - Reference: MASTER_PLAN.md → Screen 3: Dashboard
  - Reference: DESIGN_SYSTEM.md → Layout & Components
  - Use CSS Grid for layout (4-quadrant on desktop)
  - Design specifications:
    - Background: surface-container-lowest (#0e0e0e)
    - Cards: surface-container (#201f1f) with sharp corners
    - Headlines: font-newsreader (serif)
    - Body text: font-sans (Inter)
    - Numbers/stats: font-mono (Space Mono)
    - Accent borders: 1px solid brand-copper
  - Add subtle yantra/mandala decorative element (optional, see DESIGN_SYSTEM.md)
  - ✅ **Acceptance Criteria**:
    - Page renders with dark background
    - Grid layout works
    - Typography hierarchy clear (Newsreader headlines, Inter body, Space Mono numbers)
    - All cards have sharp corners (border-radius: 0)
    - Copper/gold accents visible
    - Responsive on mobile (stack vertically)
    - Matches Digital Temple visual style

- [ ] **3.1.2**: Implement getDashboardData server action
  - Reference MASTER_PLAN.md → Get Dashboard Data
  - Fetch in parallel:
    - User profile
    - Active skills
    - Today's sessions
    - Last 7 days data
  - ✅ **Acceptance Criteria**:
    - All data fetched
    - Parallel queries (fast)
    - No N+1 queries
    - Data types correct

- [ ] **3.1.3**: Set up loading state
  - Use Next.js Suspense
  - Skeleton UI for each widget
  - Shimmer animation
  - ✅ **Acceptance Criteria**:
    - Loading state shows
    - No blank screen
    - Smooth transition to loaded state

**Blockers**:
**Notes**:

---

## 🎯 TASK 3.2: Today's Tapa (Hero Section)

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: Task 3.1 (Dashboard Layout)

### Subtasks

- [ ] **3.2.1**: Create progress ring component
  - File: `components/ProgressRing.tsx`
  - SVG circle that fills based on percentage
  - Props: `value`, `max`, `size`, `color`
  - Design specifications:
    - Ring stroke color: brand-copper (#E05C00)
    - Background ring: surface-container-highest (#353434)
    - Center text: font-mono (Space Mono) for numbers
    - Center label: font-sans (Inter)
    - Consider using yantra-inspired geometric pattern (optional)
  - Center text shows hours/goal
  - ✅ **Acceptance Criteria**:
    - Ring renders correctly with copper stroke
    - Fills based on progress
    - Animates smoothly
    - Center text in Space Mono font
    - Center text readable
    - Matches Digital Temple color palette

- [ ] **3.2.2**: Build TodaysTapa component
  - Show today's hours / daily goal
  - Progress ring visualization
  - Current streak badge (top right)
  - Big "Start Focus Session" button
  - Motivational message (dynamic based on progress)
  - ✅ **Acceptance Criteria**:
    - Displays correct data
    - Updates in real-time
    - Button opens focus timer modal
    - Messages change based on progress

- [ ] **3.2.3**: Implement dynamic messaging
  - Reference MASTER_PLAN.md → Dynamic Messages
  - Messages based on progress:
    - 0%: "Ready to start day X?"
    - <50%: "Great start!"
    - <100%: "Almost there!"
    - 100%+: "Goal smashed! 🔥"
  - ✅ **Acceptance Criteria**:
    - Messages change correctly
    - Motivational tone
    - No hardcoded strings

- [ ] **3.2.4**: Add streak badge
  - Fire emoji + number
  - Orange background if active
  - Click → show streak details
  - ✅ **Acceptance Criteria**:
    - Badge displays
    - Shows correct streak
    - Visual prominence

**Blockers**:
**Notes**:

---

## 📚 TASK 3.3: Skills Section

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: Task 3.1 (Dashboard Layout)

### Subtasks

- [ ] **3.3.1**: Create SkillCard component
  - File: `components/skill-card/SkillCard.tsx`
  - Reference: MASTER_PLAN.md → Skills Section
  - Reference: DESIGN_SYSTEM.md → Card Components
  - Display:
    - Icon + Name (name in font-sans)
    - Progress bar (visual) - filled portion in brand-copper
    - Hours / Target hours (font-mono for numbers)
    - Current streak (🔥 emoji + font-mono number)
    - Two action buttons (▶ Play, 📊 Analytics)
  - Design specifications:
    - Card background: surface-container (#201f1f)
    - Border: 1px solid surface-container-highest (#353434) or subtle copper accent
    - Border radius: 0 (sharp corners)
    - Hover state: subtle copper border glow
    - Progress bar: bg copper, empty portion dark gray
    - Action buttons: icon-only, sharp corners
  - ✅ **Acceptance Criteria**:
    - Card renders all data
    - Typography: Sans for labels, Mono for numbers
    - Sharp corners (no border radius)
    - Copper progress bar
    - Buttons work
    - Mobile responsive
    - Matches Digital Temple aesthetic

- [ ] **3.3.2**: Build progress bar component
  - File: `components/ui/ProgressBar.tsx`
  - Horizontal bar with fill
  - Color: saffron gradient
  - Percentage text (optional)
  - ✅ **Acceptance Criteria**:
    - Bar fills correctly
    - Smooth animation
    - Color customizable

- [ ] **3.3.3**: Implement skill quick actions
  - Play button (▶) → opens focus timer modal with skill pre-selected
  - Analytics button (📊) → navigate to skill detail page
  - ✅ **Acceptance Criteria**:
    - Both buttons work
    - Timer modal opens with correct skill
    - Navigation works

- [ ] **3.3.4**: Add skill list container
  - Show up to 5 skills
  - Scroll/paginate if more than 5
  - "Add Skill" button at bottom
  - ✅ **Acceptance Criteria**:
    - Lists skills correctly
    - Scrolling works
    - Add button navigates to onboarding

**Blockers**:
**Notes**:

---

## 📊 TASK 3.4: Week at a Glance (Analytics Widget)

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Task 3.1 (Dashboard Layout)

### Subtasks

- [ ] **3.4.1**: Install and configure Recharts
  ```bash
  pnpm add recharts
  ```
  - Import BarChart, Bar, XAxis, YAxis
  - Test basic chart renders
  - ✅ **Acceptance Criteria**:
    - Recharts installed
    - Can render test chart
    - No console errors

- [ ] **3.4.2**: Create WeekChart component
  - File: `components/charts/WeekChart.tsx`
  - Bar chart showing last 7 days
  - X-axis: Day names (Mon, Tue, etc.)
  - Y-axis: Hours (0-8)
  - Bars: Saffron color (#F97316)
  - ✅ **Acceptance Criteria**:
    - Chart renders
    - Data displays correctly
    - Responsive

- [ ] **3.4.3**: Add chart summary
  - Below chart: "Total: X hrs this week"
  - Link: "View Analytics →"
  - ✅ **Acceptance Criteria**:
    - Summary calculates correctly
    - Link navigates to /analytics

**Blockers**:
**Notes**:

---

## 🔥 TASK 3.5: Streak & Heatmap Section

**Owner**: Dev
**Estimated Time**: 5 hours
**Dependencies**: Task 3.1 (Dashboard Layout)

### Subtasks

- [ ] **3.5.1**: Create heatmap component
  - File: `components/Heatmap.tsx`
  - Reference: GitHub contribution graph style
  - Show last 90 days
  - Color levels:
    - ░ (gray-100): 0 hours
    - ▓ (saffron-200): <2 hours
    - █ (saffron-500): 2+ hours
  - ✅ **Acceptance Criteria**:
    - Grid renders correctly
    - Colors based on hours
    - Tooltip shows date + hours
    - Responsive

- [ ] **3.5.2**: Fetch heatmap data
  - Query last 90 days of sessions per skill
  - Group by date
  - Calculate hours per day
  - Format for heatmap component
  - ✅ **Acceptance Criteria**:
    - Data fetched efficiently
    - Grouped correctly by date
    - No missing days (fill gaps with 0)

- [ ] **3.5.3**: Build per-skill heatmap display
  - Show heatmap for each skill
  - Skill icon + name above heatmap
  - Show longest and current streak
  - ✅ **Acceptance Criteria**:
    - One heatmap per skill
    - Streaks display correctly
    - Visually scannable

- [ ] **3.5.4**: Add heatmap legend
  - Bottom of section
  - "Legend: ░ 0h  ▓ <2h  █ 2h+"
  - ✅ **Acceptance Criteria**:
    - Legend clear
    - Colors match

**Blockers**:
**Notes**:

---

## 📝 TASK 3.6: Recent Sessions & Quick Stats

**Owner**: Dev
**Estimated Time**: 2 hours
**Dependencies**: Task 3.1 (Dashboard Layout)

### Subtasks

- [ ] **3.6.1**: Create RecentSessions component
  - Show last 3 sessions
  - Each session:
    - Skill icon + name
    - Duration
    - Time ago (e.g., "2 hours ago")
    - Focus rating (stars)
  - ✅ **Acceptance Criteria**:
    - Lists sessions correctly
    - Time ago updates
    - Stars display

- [ ] **3.6.2**: Create QuickStats component
  - Show:
    - Total hours (all time)
    - Active skills count
    - Total sessions
    - Longest streak
    - Current level
  - ✅ **Acceptance Criteria**:
    - All stats correct
    - Level calculation works
    - Looks clean

**Blockers**:
**Notes**:

---

## 🎨 TASK 3.7: Dashboard Polish

**Owner**: Dev
**Estimated Time**: 2 hours
**Dependencies**: All dashboard tasks complete

### Subtasks

- [ ] **3.7.1**: Add animations
  - Use Framer Motion
  - Fade in on load
  - Stagger children (cards appear one by one)
  - ✅ **Acceptance Criteria**:
    - Animations smooth
    - Not too slow
    - Works on mobile

- [ ] **3.7.2**: Optimize performance
  - Check page load time (< 1 second goal)
  - Lazy load heavy components
  - Optimize images
  - ✅ **Acceptance Criteria**:
    - Dashboard loads fast
    - No janky animations
    - Lighthouse score > 90

- [ ] **3.7.3**: Mobile responsiveness
  - Test on mobile sizes
  - Stack widgets vertically
  - Touch-friendly buttons (min 44px)
  - ✅ **Acceptance Criteria**:
    - Works on iPhone/Android
    - No horizontal scroll
    - Readable text

**Blockers**:
**Notes**:

---

## ✅ PHASE 3 DELIVERABLES

- [ ] Dashboard page complete with all sections
- [ ] Today's progress ring works
- [ ] Skills list displays correctly
- [ ] Week chart shows data
- [ ] Per-skill heatmaps render
- [ ] Recent sessions and stats visible
- [ ] Page loads in < 1 second

**Phase 3 Complete**: ☐
**Completion Date**: ___________

---

# PHASE 4: ANALYTICS & PROFILE (Week 4)

**Goal**: Build analytics page and profile/settings

**Duration**: 5-7 days
**Priority**: HIGH (completes MVP)

---

## 📈 TASK 4.1: Analytics Page

**Owner**: Dev
**Estimated Time**: 5 hours
**Dependencies**: Phase 3 complete

### Subtasks

- [ ] **4.1.1**: Create analytics page (`app/(dashboard)/analytics/page.tsx`)
  - Reference MASTER_PLAN.md → Screen 8: Analytics
  - Layout:
    - Time period filters (Today, Week, Month, All Time)
    - Summary stats
    - Daily breakdown (bar chart)
    - Skill distribution (pie chart)
    - Time of day analysis
    - Simple insights
  - ✅ **Acceptance Criteria**:
    - Page renders
    - Layout clean
    - All sections present

- [ ] **4.1.2**: Implement time period filters
  - Tabs: Today | Week | Month | All Time
  - On click → fetch data for that period
  - Update all charts
  - ✅ **Acceptance Criteria**:
    - Filters work
    - Data updates
    - Active tab highlighted

- [ ] **4.1.3**: Build summary stats section
  - Show for selected period:
    - Total hours
    - Avg per day
    - Best day
    - Number of sessions
  - ✅ **Acceptance Criteria**:
    - Stats calculate correctly
    - Updates with filter

- [ ] **4.1.4**: Create skill distribution pie chart
  - Use Recharts PieChart
  - Each slice = skill
  - Color coded
  - Show percentage + hours
  - ✅ **Acceptance Criteria**:
    - Chart renders
    - Data accurate
    - Legend shows

- [ ] **4.1.5**: Implement simple insights
  - No AI needed for MVP
  - Pattern detection:
    - "You're most productive on [day]"
    - "Your best sessions are [X] minutes long"
    - "You practice most between [time] and [time]"
  - Calculate from session data
  - ✅ **Acceptance Criteria**:
    - Insights show
    - Calculations correct
    - Helpful messages

**Blockers**:
**Notes**:

---

## 👤 TASK 4.2: Profile Page

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Phase 3 complete

### Subtasks

- [ ] **4.2.1**: Create profile page (`app/(dashboard)/profile/page.tsx`)
  - Reference MASTER_PLAN.md → Screen 9: Profile & Settings
  - Sections:
    - Profile header (avatar, name, username)
    - Overall stats
    - Active skills list
  - ✅ **Acceptance Criteria**:
    - Page renders
    - Data displays
    - Looks good

- [ ] **4.2.2**: Build profile edit modal
  - Fields:
    - Full name
    - Username
    - Avatar upload
  - Update Supabase profile
  - ✅ **Acceptance Criteria**:
    - Modal opens
    - Fields populate
    - Updates save

- [ ] **4.2.3**: Implement avatar upload
  - Use Supabase Storage
  - Upload to `avatars/[user-id]/avatar.jpg`
  - Update profile.avatar_url
  - ✅ **Acceptance Criteria**:
    - Image uploads
    - Preview shows
    - Profile updates

**Blockers**:
**Notes**:

---

## ⚙️ TASK 4.3: Settings Page

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Task 4.2 (Profile Page)

### Subtasks

- [ ] **4.3.1**: Create settings page (`app/(dashboard)/settings/page.tsx`)
  - Sections:
    - Account (email, password)
    - Preferences (daily goal, timezone)
    - Notifications (toggles)
    - Focus timer defaults
  - ✅ **Acceptance Criteria**:
    - Page renders
    - All settings visible

- [ ] **4.3.2**: Build settings form
  - Each section as separate form
  - Auto-save on change (or save button)
  - Show success toast
  - ✅ **Acceptance Criteria**:
    - Forms work
    - Updates save to database
    - UI feedback

- [ ] **4.3.3**: Add notification preferences
  - Toggles for:
    - Daily practice reminder
    - Streak risk alerts
    - Weekly summary
  - ✅ **Acceptance Criteria**:
    - Toggles work
    - Settings persist
    - (Actual notifications in Phase 2+)

**Blockers**:
**Notes**:

---

## 🎨 TASK 4.4: Skill Detail Page

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: Phase 3 complete

### Subtasks

- [ ] **4.4.1**: Create skill detail page (`app/(dashboard)/skills/[id]/page.tsx`)
  - Reference MASTER_PLAN.md → Screen 7: Skill Detail
  - Sections:
    - Progress ring (hero)
    - Key metrics
    - Stats grid
    - Progress chart (cumulative hours over time)
    - Heatmap
    - Session history
  - ✅ **Acceptance Criteria**:
    - Page renders for skill ID
    - All sections present
    - Data loads correctly

- [ ] **4.4.2**: Build cumulative progress chart
  - Line chart showing hours growth over time
  - X-axis: Months
  - Y-axis: Total hours
  - Use Recharts LineChart
  - ✅ **Acceptance Criteria**:
    - Chart shows growth
    - Data accurate
    - Looks motivating

- [ ] **4.4.3**: Create session history list
  - Paginated list of all sessions
  - Each row:
    - Date
    - Duration
    - Focus rating
    - Notes preview
  - Click → expand to see full notes
  - ✅ **Acceptance Criteria**:
    - Lists sessions correctly
    - Pagination works
    - Expandable rows

- [ ] **4.4.4**: Add edit/delete skill buttons
  - Edit → modal to update skill details
  - Delete → confirmation modal → soft delete (set is_active = false)
  - ✅ **Acceptance Criteria**:
    - Edit works
    - Delete archives skill
    - No data loss

**Blockers**:
**Notes**:

---

## 🚀 TASK 4.5: Final Polish & Testing

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: All Phase 4 tasks complete

### Subtasks

- [ ] **4.5.1**: End-to-end testing
  - Test full user journey:
    1. Sign up
    2. Create skill
    3. Start focus session
    4. Complete session
    5. View dashboard (updated data)
    6. Check analytics
    7. Edit profile
  - ✅ **Acceptance Criteria**:
    - No errors in any step
    - Data persists correctly
    - UI feels smooth

- [ ] **4.5.2**: Error handling
  - Add error boundaries
  - Graceful degradation (no data states)
  - Error messages user-friendly
  - ✅ **Acceptance Criteria**:
    - Errors caught
    - User sees helpful message
    - App doesn't crash

- [ ] **4.5.3**: Loading states
  - Every data fetch has loading UI
  - Skeleton screens
  - No blank pages
  - ✅ **Acceptance Criteria**:
    - Loading states everywhere
    - Fast perceived performance

- [ ] **4.5.4**: Mobile testing
  - Test on real devices (iPhone, Android)
  - Fix any layout issues
  - Touch targets big enough
  - ✅ **Acceptance Criteria**:
    - Works on mobile
    - No scrolling issues
    - Buttons tappable

- [ ] **4.5.5**: Performance audit
  - Run Lighthouse
  - Check bundle size
  - Optimize images
  - Goal: Score > 90
  - ✅ **Acceptance Criteria**:
    - Lighthouse score > 90
    - FCP < 1.5s
    - TTI < 3s

**Blockers**:
**Notes**:

---

## ✅ PHASE 4 DELIVERABLES

- [ ] Analytics page complete with charts and insights
- [ ] Profile page with edit functionality
- [ ] Settings page with all preferences
- [ ] Skill detail page with full history
- [ ] Error handling and loading states
- [ ] Mobile responsive throughout
- [ ] Performance optimized

**Phase 4 Complete**: ☐
**Completion Date**: ___________

---

# 🎉 MVP COMPLETE!

Once Phase 4 is done, you have a fully functional MVP.

## Pre-Launch Checklist

- [ ] All core features work
- [ ] No critical bugs
- [ ] Mobile responsive
- [ ] Fast (< 1s dashboard load)
- [ ] Error handling in place
- [ ] User can complete full journey (signup → skill → focus → dashboard)

## Launch Preparation

- [ ] **4.6.1**: Deploy to Vercel
  - Connect GitHub repo
  - Set environment variables
  - Deploy to production
  - ✅ **Acceptance Criteria**:
    - App live on Vercel
    - Custom domain (optional)
    - HTTPS enabled

- [ ] **4.6.2**: Set up error monitoring
  - Install Sentry (optional but recommended)
  - Configure error tracking
  - ✅ **Acceptance Criteria**:
    - Errors logged to Sentry
    - Alerts configured

- [ ] **4.6.3**: Get first 10 users
  - Share with friends/family
  - Post on Twitter/LinkedIn
  - Ask for feedback
  - ✅ **Acceptance Criteria**:
    - 10 users sign up
    - At least 5 use daily for 7 days
    - Feedback collected

---

# PHASE 5: GAMIFICATION (Weeks 5-6)

**Goal**: Add retention mechanics (badges, achievements, levels)

**Priority**: MEDIUM (enhance engagement)
**Note**: Only start if MVP is validated by users

---

## 🏆 TASK 5.1: Achievement System

**Owner**: Dev
**Estimated Time**: 6 hours
**Dependencies**: MVP complete and validated

### Subtasks

- [ ] **5.1.1**: Create badges table in Supabase
  ```sql
  create table public.badges (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    icon text,
    category text, -- "streak" | "hours" | "session" | "social"
    criteria jsonb not null, -- { type: "hours", amount: 100 }
    rarity text default 'common',
    created_at timestamptz default now()
  );

  create table public.user_badges (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade,
    badge_id uuid references public.badges(id) on delete cascade,
    unlocked_at timestamptz default now(),
    unique(user_id, badge_id)
  );
  ```
  - ✅ **Acceptance Criteria**:
    - Tables created
    - RLS policies set
    - Sample badges inserted

- [ ] **5.1.2**: Define 20-30 badges
  - Streak badges (7, 30, 100, 365 days)
  - Hour badges (20, 50, 100, 500, 1k, 5k, 10k)
  - Session badges (first session, 50 sessions with 5-star focus)
  - Social badges (for Phase 6)
  - Insert into badges table
  - ✅ **Acceptance Criteria**:
    - All badges defined
    - Inserted to database
    - Icons assigned

- [ ] **5.1.3**: Create checkBadgeUnlocks function
  - Reference MASTER_PLAN.md → Badge Checking
  - Run after session save
  - Check all badge criteria
  - Unlock if met
  - ✅ **Acceptance Criteria**:
    - Detects unlocks correctly
    - Inserts to user_badges
    - No duplicate unlocks

- [ ] **5.1.4**: Build badge unlock modal
  - Celebration animation
  - Badge icon and name
  - Description
  - "Continue" button
  - ✅ **Acceptance Criteria**:
    - Shows on unlock
    - Looks celebratory
    - User can dismiss

- [ ] **5.1.5**: Add badges to profile
  - Grid of unlocked badges
  - Show locked badges (grayed out)
  - Progress toward next badge
  - ✅ **Acceptance Criteria**:
    - Profile shows all badges
    - Locked vs unlocked clear
    - Looks good

**Blockers**:
**Notes**:

---

## 📊 TASK 5.2: Level System

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Task 5.1 (Achievements)

### Subtasks

- [ ] **5.2.1**: Implement level calculation
  - Reference MASTER_PLAN.md → Mastery Timeline
  - Levels:
    1. Beginner (0-100h)
    2. Novice (100-500h)
    3. Competent (500-1000h)
    4. Proficient (1000-2000h)
    5. Advanced (2000-5000h)
    6. Expert (5000-10000h)
    7. Master (10000h+)
  - ✅ **Acceptance Criteria**:
    - Function calculates level from hours
    - Correct thresholds

- [ ] **5.2.2**: Display level on profile and dashboard
  - Badge/chip showing current level
  - Progress to next level
  - ✅ **Acceptance Criteria**:
    - Level displays
    - Progress bar to next level
    - Updates on session save

- [ ] **5.2.3**: Add level-up celebration
  - Modal when leveling up
  - "You've reached [Level X]!"
  - ✅ **Acceptance Criteria**:
    - Shows on level change
    - Celebratory

**Blockers**:
**Notes**:

---

## ✅ PHASE 5 DELIVERABLES

- [ ] Badge system implemented
- [ ] 20-30 badges defined and working
- [ ] Badges display on profile
- [ ] Level system working
- [ ] Level-up celebrations

**Phase 5 Complete**: ☐
**Completion Date**: ___________

---

# PHASE 6: SOCIAL FEATURES (Weeks 7-8)

**Goal**: Add squads and leaderboards for accountability

**Priority**: MEDIUM (social validation needed)
**Note**: Only if users are engaged and requesting social features

---

## 👥 TASK 6.1: Squads (Accountability Groups)

**Owner**: Dev
**Estimated Time**: 8 hours
**Dependencies**: Phase 5 complete (optional)

### Subtasks

- [ ] **6.1.1**: Create squad tables
  ```sql
  create table public.squads (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    invite_code text unique not null,
    focus_skill_name text,
    max_members integer default 5,
    is_public boolean default false,
    created_at timestamptz default now()
  );

  create table public.squad_members (
    id uuid default uuid_generate_v4() primary key,
    squad_id uuid references public.squads(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete cascade,
    role text default 'member',
    joined_at timestamptz default now(),
    unique(squad_id, user_id)
  );
  ```
  - ✅ **Acceptance Criteria**:
    - Tables created
    - RLS policies set

- [ ] **6.1.2**: Build create squad flow
  - Form to create squad
  - Generate invite code
  - Set max members
  - ✅ **Acceptance Criteria**:
    - User can create squad
    - Invite code generated
    - Squad saved to DB

- [ ] **6.1.3**: Build join squad flow
  - Enter invite code
  - Preview squad
  - Join button
  - ✅ **Acceptance Criteria**:
    - User can join via code
    - Added to squad_members
    - See squad on profile

- [ ] **6.1.4**: Build squad page
  - Show members
  - Show squad activity feed
  - Show leaderboard
  - ✅ **Acceptance Criteria**:
    - Squad page renders
    - All data shows
    - Real-time updates (optional)

**Blockers**:
**Notes**:

---

## 🏅 TASK 6.2: Leaderboards

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: Task 6.1 (Squads)

### Subtasks

- [ ] **6.2.1**: Build skill-specific leaderboard
  - Query users in same squad
  - Rank by hours this week/month
  - ✅ **Acceptance Criteria**:
    - Leaderboard shows correct ranking
    - Updates daily

- [ ] **6.2.2**: Build global leaderboard (optional)
  - All users
  - Privacy settings (opt in/out)
  - ✅ **Acceptance Criteria**:
    - Global ranking works
    - User can opt out

**Blockers**:
**Notes**:

---

## ✅ PHASE 6 DELIVERABLES

- [ ] Users can create/join squads
- [ ] Squad page with activity feed
- [ ] Skill-specific leaderboards
- [ ] Optional: Global leaderboard

**Phase 6 Complete**: ☐
**Completion Date**: ___________

---

# PHASE 7: AI INSIGHTS (Weeks 9-10)

**Goal**: Add AI-powered weekly insights using FastAPI + OpenAI

**Priority**: LOW (nice to have)
**Note**: Only if core product is working and users want it

---

## 🤖 TASK 7.1: FastAPI Backend Setup

**Owner**: Dev
**Estimated Time**: 4 hours
**Dependencies**: OpenAI API key

### Subtasks

- [ ] **7.1.1**: Create FastAPI project
  ```bash
  mkdir tapasya-ai
  cd tapasya-ai
  python -m venv venv
  source venv/bin/activate
  pip install fastapi uvicorn openai supabase
  ```
  - ✅ **Acceptance Criteria**:
    - FastAPI installed
    - Server runs

- [ ] **7.1.2**: Create insights endpoint
  - POST /insights/weekly
  - Accepts user_id
  - Fetches user data from Supabase
  - Calls OpenAI API
  - Returns insights JSON
  - ✅ **Acceptance Criteria**:
    - Endpoint works
    - Returns insights

- [ ] **7.1.3**: Deploy FastAPI to Vercel
  - Configure for Python runtime
  - Set environment variables
  - ✅ **Acceptance Criteria**:
    - API live
    - Callable from Next.js

**Blockers**:
**Notes**:

---

## 💡 TASK 7.2: Weekly Insights Integration

**Owner**: Dev
**Estimated Time**: 3 hours
**Dependencies**: Task 7.1 (FastAPI)

### Subtasks

- [ ] **7.2.1**: Create insights page
  - Show weekly report
  - Summary, insights, recommendations
  - ✅ **Acceptance Criteria**:
    - Page displays insights
    - Looks good

- [ ] **7.2.2**: Set up cron job
  - Supabase Edge Function or Vercel Cron
  - Trigger every Monday 6 AM
  - Call FastAPI for all active users
  - ✅ **Acceptance Criteria**:
    - Runs weekly
    - Generates insights

**Blockers**:
**Notes**:

---

## ✅ PHASE 7 DELIVERABLES

- [ ] FastAPI backend deployed
- [ ] Weekly insights generate via AI
- [ ] Insights page shows recommendations
- [ ] Cron job runs weekly

**Phase 7 Complete**: ☐
**Completion Date**: ___________

---

# 🎊 PROJECT COMPLETE!

Once all phases are done, you have:
- ✅ Full MVP (auth, skills, timer, dashboard, analytics)
- ✅ Gamification (badges, levels)
- ✅ Social features (squads, leaderboards)
- ✅ AI insights

---

## 📝 NOTES & LEARNINGS

Use this space to track what you learn:

**What worked well**:
-
-
-

**What was challenging**:
-
-
-

**What would you do differently**:
-
-
-

**User feedback**:
-
-
-

---

## 🚀 NEXT STEPS AFTER COMPLETION

1. **Gather feedback** from first 100 users
2. **Iterate** on top pain points
3. **Add requested features**
4. **Scale infrastructure** if needed
5. **Marketing & growth**

---

**END OF PROJECT ROADMAP**

Good luck building Tapasya! 🔥
