# TAPASYA - MASTER PLAN (FINAL SOURCE OF TRUTH)

**Last Updated**: March 26, 2026
**Status**: Active Development - This is your ONLY reference document
**Version**: 2.0 (Combined GPT + Brainstorm + Wireframe + Technical Specs)

---

## 📖 TABLE OF CONTENTS

1. [Core Product Truth](#core-product-truth)
2. [The Mastery Timeline](#the-mastery-timeline)
3. [MVP Scope (Phase 1)](#mvp-scope-phase-1)
4. [Screen-by-Screen Breakdown](#screen-by-screen-breakdown)
5. [Database Schema](#database-schema)
6. [Technical Stack](#technical-stack)
7. [Development Roadmap](#development-roadmap)
8. [Phase 2+ Features](#phase-2-features)

---

# CORE PRODUCT TRUTH

## What Tapasya IS NOT ❌

- A simple timer app
- A productivity tracker
- A to-do list manager
- A habit tracker clone

## What Tapasya IS ✅

**Tapasya** (Sanskrit: तपस्या) — A **Skill Mastery System** that transforms inconsistent learners into disciplined masters.

**Core Purpose**: Make invisible progress VISIBLE so people don't quit.

**The Problem**:
- People want to master skills (piano, DSA, languages, fitness)
- Almost none do
- Why? **They can't see their compounding progress**
- They quit when they don't feel results

**The Solution**:
- Track time toward mastery (10,000 hours)
- Visualize progress constantly
- Reward daily consistency
- Create identity through skill building

---

## THE CORE LOOP (CRITICAL - DO NOT BREAK THIS)

```
Open App → See Progress → Start Focus → Complete Session → Log Time →
See Updated Progress → Feel Good → Close App → Come Back Tomorrow
```

**If this loop breaks at any point, the product fails.**

Every screen, every feature, every button must support this loop.

---

## USER TRANSFORMATION JOURNEY

```
Beginner → Inconsistent → Tracking → Consistent → Disciplined → Skilled → Master
```

**Your job**: Move users from left to right through:
1. **Visual feedback** (progress bars, streaks, charts)
2. **Daily action** (easy to start focus sessions)
3. **Emotional rewards** (celebrations, achievements)

---

## THE MASTERY TIMELINE

**"Every 100 hours changes who you are."**

This is your messaging framework. Display this prominently in the app.

| Hours | Outcome | Level |
|-------|---------|-------|
| **20 hours** | Fear gone, basics understood, you can start doing things | Beginner |
| **50 hours** | Familiarity built, you can follow along without confusion | Beginner |
| **100 hours** | You can do tasks independently with some mistakes | Beginner |
| **200 hours** | Strong foundation, you start recognizing patterns | Novice |
| **500 hours** | You're better than most beginners, real confidence kicks in | Competent |
| **1,000 hours** | You're genuinely skilled, can solve real-world problems | Proficient |
| **2,000 hours** | Deep understanding, you rarely feel lost | Advanced |
| **3,000 hours** | Top-tier practitioner, high confidence + speed | Advanced |
| **5,000 hours** | Elite level, you stand out in your field | Expert |
| **10,000 hours** | Mastery, you create, innovate, and lead | Master |

**Use this to**:
- Show users where they are on the journey
- Predict time to next milestone
- Motivate through micro-achievements (20h, 50h, 100h badges)

---

# MVP SCOPE (PHASE 1)

## ⚠️ CRITICAL RULE: DO NOT OVERBUILD

**Phase 1 Goal**: Prove the core loop works. Get users to come back daily.

### ✅ BUILD THESE (ONLY)

1. **Authentication**
   - Email/password
   - Google OAuth
   - GitHub OAuth (optional)

2. **Skill Management**
   - Create skills (flat structure, no hierarchy yet)
   - Edit/delete skills
   - Set target hours (1000 / 5000 / 10,000)
   - Set daily goal

3. **Focus Timer**
   - Stopwatch mode (count up until stopped)
   - Pomodoro mode (25/50/90 min presets)
   - Skill selector
   - Start/pause/stop

4. **Session Logging**
   - Auto-save when timer stops
   - Add optional notes
   - Track focus quality (1-5 stars)

5. **Dashboard** (see wireframe design)
   - Today's progress ring
   - Skills list with quick actions
   - Streak counter
   - GitHub-style heatmap
   - Recent sessions

6. **Basic Analytics**
   - Weekly bar chart
   - Skill distribution pie chart
   - Total hours counter

7. **Streaks**
   - Daily streak counter
   - Longest streak
   - Streak logic (min 30 min/day)

### ❌ DO NOT BUILD (PHASE 2+)

- ❌ Hierarchical skills (parent/sub-skills/tasks)
- ❌ Calendar view
- ❌ Squad/accountability groups
- ❌ Leaderboards
- ❌ AI insights/coach
- ❌ Achievements system (full)
- ❌ Social sharing
- ❌ Advanced roadmaps
- ❌ Mobile app

**Why defer these?**
You need to validate the core loop first. If users don't start daily focus sessions, fancy features won't save you.

---

# SCREEN-BY-SCREEN BREAKDOWN

---

## 🎨 DESIGN REFERENCE

**⚠️ CRITICAL**: All screens MUST follow the "Digital Temple" design system.

**Complete Design Guidelines**: See `DESIGN_SYSTEM.md` for:
- Full color palette with hex codes
- Typography examples (Newsreader, Inter, Space Mono)
- Component patterns and examples
- Animation guidelines
- Decorative elements (yantras, mandalas)

**Key Design Principles**:
1. **Sharp Minimalism**: Zero border radius on ALL elements (buttons, cards, inputs)
2. **Editorial Typography**: Newsreader serif for headlines (often italic), Inter for body, Space Mono for numbers
3. **Dark Surfaces**: Deep blacks (#0e0e0e to #353434) with copper/gold accents
4. **Copper/Gold Palette**: Primary actions in copper (#E05C00), secondary in gold (#e9c349)
5. **Sacred Geometry**: Optional yantra/mandala decorative elements

---

## Design System (Apply Everywhere)

**Reference**: See DESIGN_SYSTEM.md for complete visual guidelines

**Design Philosophy**: "Digital Temple" — Minimalist editorial meets sacred geometry
- Sharp minimalism (zero border radius)
- Editorial typography (Newsreader serif for headlines)
- Dark surfaces with copper/gold accents
- Monospace for numbers and timers

### Colors (Digital Temple Palette)
```css
/* Primary - Copper/Orange */
--brand-copper: #E05C00;
--primary: #ffb694;
--primary-container: #ef6712;

/* Secondary - Gold */
--secondary: #e9c349;
--secondary-container: #af8d11;

/* Surfaces (Dark) */
--surface-container-lowest: #0e0e0e;  /* Deepest black */
--background: #141313;
--surface-container: #201f1f;
--surface-container-highest: #353434;

/* Text */
--on-surface: #e5e2e1;
--on-surface-variant: #e1c0b2;

/* Accent borders */
--outline: rgba(224, 92, 0, 0.3);
```

### Typography
```css
/* Font Families */
--font-newsreader: 'Newsreader', serif;      /* Headlines, emphasis */
--font-sans: 'Inter', sans-serif;            /* Body text, UI */
--font-mono: 'Space Mono', monospace;        /* Numbers, timers, stats */

/* Typography Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-4xl: 2.25rem;   /* 36px */
--text-6xl: 3.75rem;   /* 60px */
--text-9xl: 8rem;      /* 128px - for large timer */

/* Typography Usage */
.headline-hero {
  font-family: var(--font-newsreader);
  font-size: 6rem;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.02em;
  font-style: italic;  /* Italics for editorial feel */
}

.mono-timer {
  font-family: var(--font-mono);
  font-size: 12rem;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.stat-number {
  font-family: var(--font-mono);
  font-weight: 700;
}
```

### Spacing & Layout
```css
/* Use 4px base unit */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */

/* Border Radius - ALWAYS ZERO (sharp minimalism) */
--radius: 0px;
border-radius: 0px;
```

### Component Patterns
```css
/* Card */
.card {
  background: var(--surface-container);
  border: 1px solid var(--surface-container-highest);
  border-radius: 0; /* Sharp corners */
  padding: var(--space-6);
}

/* Button (Primary) */
.btn-primary {
  background: var(--brand-copper);
  color: white;
  border-radius: 0;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-weight: 600;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-container);
  box-shadow: 0 0 0 2px var(--brand-copper);
}

/* Progress Bar */
.progress-bar {
  height: 8px;
  background: var(--surface-container-highest);
  border-radius: 0;
}

.progress-fill {
  background: var(--brand-copper);
  height: 100%;
  border-radius: 0;
}
```

---

## SCREEN 1: LANDING PAGE

### Purpose
Convert visitors → signed-up users in < 30 seconds

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│              TAPASYA                        │
│      The ancient practice of               │
│      becoming great and master              │
│                                             │
│  "Track your journey to 10,000 hours"       │
│                                             │
│  Every 100 hours changes who you are.       │
│                                             │
│                                             │
│      [Continue with Google]                 │
│      [Continue with GitHub]                 │
│      [Continue with Email]                  │
│                                             │
│                                             │
│  ✓ Track time toward mastery                │
│  ✓ See your progress visually               │
│  ✓ Build daily discipline                   │
│                                             │
└─────────────────────────────────────────────┘
```

### Components

1. **Header**
   - App name: "Tapasya" (font-newsreader, text-6xl, italic, font-bold, text-brand-copper)
   - Tagline: "The ancient practice of becoming great" (font-newsreader, text-lg, italic, text-on-surface-variant)

2. **Value Prop**
   - "Track your journey to 10,000 hours" (font-sans, text-xl, text-on-surface)
   - "Every 100 hours changes who you are." (font-newsreader, text-base, italic, text-on-surface-variant)

3. **CTA Buttons** (large, prominent, SHARP CORNERS)
   - Google OAuth button (bg-white, border, Google logo, border-radius: 0)
   - GitHub OAuth button (bg-surface-container-highest, text-on-surface, border-radius: 0)
   - Email signup button (bg-brand-copper, text-white, border-radius: 0, hover: box-shadow copper glow)

4. **Trust Indicators** (3 checkmarks)
   - Simple benefits list (font-sans, text-on-surface)

**Background**: surface-container-lowest (#0e0e0e) - deepest black

### Technical Specs

**Route**: `/` (root)

**Authentication Flow** (using Supabase Auth — NOT NextAuth):
```typescript
const supabase = createClient()

// Google OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback?next=/onboarding` }
})

// GitHub OAuth
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: { redirectTo: `${origin}/auth/callback?next=/onboarding` }
})

// Email/password
await supabase.auth.signInWithPassword({ email, password })
```

**Success Metric**: User clicks auth button within 10 seconds

---

## SCREEN 2: ONBOARDING (FIRST SKILL)

### Purpose
**Identity creation moment** — User defines their first skill to master

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│  Welcome to Tapasya! 🔥                     │
│                                             │
│  What skill do you want to master?          │
│                                             │
│  Skill Name*                                │
│  [_____________________________]            │
│  e.g., Piano, Data Structures, Spanish      │
│                                             │
│  Choose an Icon                             │
│  [💻] [🎹] [🎨] [🏋️] [⚔️] [📚] [+ More]    │
│                                             │
│  Your Goal                                  │
│  ○ 1,000 hours (Proficient)                │
│  ● 10,000 hours (Mastery)                   │
│  ○ Custom: [____] hours                     │
│                                             │
│  Daily Target (Optional)                    │
│  ┌─────────────────────────────┐           │
│  │         2 hours/day          │           │
│  └─────────────────────────────┘           │
│  [slider: 0.5h ───●─── 8h]                 │
│                                             │
│                                             │
│       [Skip for now]  [Create Skill]        │
└─────────────────────────────────────────────┘
```

### Components

1. **Welcome Message**
   - Greeting with fire emoji
   - Question: "What skill do you want to master?"

2. **Skill Name Input** (required)
   - Text input
   - Placeholder examples
   - Max length: 50 characters

3. **Icon Picker**
   - Preset emoji grid (most common skills)
   - "More" button → full emoji picker
   - Default: 💡

4. **Goal Selector**
   - Radio buttons for 1k / 10k / custom
   - Default: 10,000 hours

5. **Daily Target Slider**
   - Range: 0.5h to 8h
   - Default: 2h
   - Shows "~ X days to goal" calculation

6. **CTAs**
   - "Skip for now" (text button, gray)
   - "Create Skill" (primary button, saffron-500)

### Technical Specs

**Route**: `/onboarding`

**Form Validation**:
```typescript
const schema = z.object({
  name: z.string().min(1, "Skill name is required").max(50),
  icon: z.string().default("💡"),
  targetHours: z.number().min(1).max(100000).default(10000),
  dailyGoalMinutes: z.number().min(30).max(480).default(120) // 0.5h to 8h
});
```

**Database Action** (using Supabase client — NOT Prisma):
```typescript
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

const { data: skill, error } = await supabase
  .from('skills')
  .insert({
    name: formData.name,
    icon: formData.icon,
    target_hours: formData.targetHours,
    daily_goal_minutes: formData.dailyGoalMinutes,
    user_id: user.id,
    color: '#E05C00', // brand copper
    is_active: true
  })
  .select()
  .single();

// Redirect to dashboard
redirect('/dashboard');
```

**Success Metric**: User creates first skill and sees dashboard

---

## SCREEN 3: DASHBOARD (HERO SCREEN - MOST CRITICAL)

### ⚠️ DASHBOARD RULES

1. **Action-first**: Primary CTA must be "Start Focus" — visible without scrolling
2. **Progress-visible**: User must see progress instantly (hours, streak, chart)
3. **No overwhelm**: Don't show too much data. Clean, scannable layout.
4. **Fast load**: < 1 second to render (critical for daily habit)

### Layout (Based on Your Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                        [+ New Skill]  [Profile]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗ │
│  ║  TODAY'S TAPA                                    🔥 15 ║ │
│  ║                                                         ║ │
│  ║         ┌────────────┐                                 ║ │
│  ║         │            │                                 ║ │
│  ║         │   3.5 hrs  │  Progress Ring                  ║ │
│  ║         │   / 5 hrs  │  (70% complete)                 ║ │
│  ║         │            │                                 ║ │
│  ║         └────────────┘                                 ║ │
│  ║                                                         ║ │
│  ║            [▶ Start Focus Session]                     ║ │
│  ║                                                         ║ │
│  ║  Keep going! You're on a 15-day streak 🚀              ║ │
│  ╚═══════════════════════════════════════════════════════╝ │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │ SKILLS                  │  │ WEEK AT A GLANCE        │  │
│  ├─────────────────────────┤  ├─────────────────────────┤  │
│  │                         │  │  [Bar Chart]            │  │
│  │ 1. 💻 DSA    [▶][📊]   │  │   6 ┤         ██        │  │
│  │    450/1000h (45%)      │  │   5 ┤   ██    ██        │  │
│  │    ████████░░░░░░░░     │  │   4 ┤   ██    ██    ██  │  │
│  │    🔥 29 days           │  │   3 ┤   ██    ██    ██  │  │
│  │                         │  │   2 ┤   ██    ██    ██  │  │
│  │ 2. 🎹 Guitar [▶][📊]   │  │   1 ┤ ████    ██    ██  │  │
│  │    120/10000h (1.2%)    │  │     └─M──T───W────T──F  │  │
│  │    █░░░░░░░░░░░░░░░     │  │                         │  │
│  │    🔥 7 days            │  │  Total: 18.5 hrs        │  │
│  │                         │  │                         │  │
│  │ [+ Add Skill]           │  │  [View Analytics →]     │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ STREAK & HEATMAP                                     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  💻 DSA                                              │  │
│  │  Oct    Nov    Dec    Jan                           │  │
│  │  ░░▓█ ██░▓ ░░█▓ ████                                │  │
│  │  Longest: 29  Current: 29                           │  │
│  │                                                       │  │
│  │  🎹 Guitar                                           │  │
│  │  Oct    Nov    Dec    Jan                           │  │
│  │  ░░░░ ░▓██ ░░░░ ███▓                                │  │
│  │  Longest: 42  Current: 7                            │  │
│  │                                                       │  │
│  │  Legend: ░ 0h  ▓ <2h  █ 2h+                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │ RECENT SESSIONS         │  │ QUICK STATS             │  │
│  ├─────────────────────────┤  ├─────────────────────────┤  │
│  │ 💻 DSA - 2 hours        │  │ Total Hours: 570        │  │
│  │    2 hours ago          │  │ Active Skills: 2        │  │
│  │    ⭐⭐⭐⭐⭐ (5/5)      │  │ Sessions: 287           │  │
│  │                         │  │ Longest Streak: 42      │  │
│  │ 🎹 Guitar - 1.5 hours   │  │                         │  │
│  │    5 hours ago          │  │ 🏆 Level: Competent     │  │
│  │    ⭐⭐⭐⭐ (4/5)        │  │    (500-1000 hrs)       │  │
│  │                         │  └─────────────────────────┘  │
│  │ [View All Sessions →]   │                              │
│  └─────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

### Section Breakdown

#### 1. TODAY'S TAPA (HERO SECTION)

**Components**:
- **Progress Ring** (circular progress)
  - Shows hours today / daily goal
  - Large numbers (font-mono, text-4xl, font-bold)
  - Ring stroke: brand-copper (#E05C00)
  - Background ring: surface-container-highest (#353434)
  - Center text: font-mono for numbers, font-sans for labels
- **Current Streak Badge** (top right)
  - Fire emoji + number (font-mono)
  - Background: brand-copper when active, surface-container when inactive
  - Sharp corners (border-radius: 0)
- **Primary CTA**: "Start Focus Session" button
  - Largest button on screen
  - bg-brand-copper, hover: box-shadow copper glow
  - Sharp corners (border-radius: 0)
  - font-sans, font-semibold
  - Full width on mobile
- **Motivational Text**
  - font-newsreader, italic for personality
  - text-on-surface-variant
  - "Keep going! You're on a 15-day streak 🚀"
  - Changes based on progress (0%, 50%, 100%, 100%+)

**Overall Design**:
- Background: surface-container-lowest (#0e0e0e)
- Hero section card: surface-container (#201f1f)
- Subtle copper accent borders
- All corners sharp (border-radius: 0)

**Dynamic Messages**:
```typescript
function getTodayMessage(hoursToday: number, dailyGoal: number, streak: number) {
  const progress = (hoursToday / dailyGoal) * 100;

  if (progress === 0) {
    return `Ready to start day ${streak + 1}? Let's begin! 💪`;
  } else if (progress < 50) {
    return `Great start! Keep the momentum going 🔥`;
  } else if (progress < 100) {
    return `You're crushing it! Only ${dailyGoal - hoursToday}h to go 🚀`;
  } else {
    return `Goal smashed! You're on fire 🔥 (${streak}-day streak)`;
  }
}
```

**Data Query**:
```typescript
// Get today's total hours across all skills
const today = startOfDay(new Date());
const todaySessions = await prisma.focusSession.aggregate({
  where: {
    userId: session.user.id,
    startTime: { gte: today }
  },
  _sum: { duration: true }
});

const hoursToday = (todaySessions._sum.duration || 0) / 60;

// Get user's daily goal (max across all skills or user setting)
const userGoal = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { dailyGoalMinutes: true }
});

const dailyGoal = (userGoal?.dailyGoalMinutes || 120) / 60; // default 2h
```

---

#### 2. SKILLS SECTION

**Components**: List of skill cards (max 5 visible, scroll/paginate rest)

**Each Skill Card Shows**:
- Icon + Name (font-sans, font-semibold, text-on-surface)
- Progress bar (visual, sharp corners)
  - Filled: bg-brand-copper
  - Empty: bg-surface-container-highest
  - Height: 8px, border-radius: 0
- Hours / Target hours (font-mono for numbers, e.g., "450/1000h (45%)")
- Current streak (🔥 + font-mono number, text-secondary for emphasis)
- Two quick action buttons (sharp corners, icon-only):
  - **▶** (Play): Start focus session for this skill
  - **📊** (Analytics): Go to skill detail page

**Card Design**:
```
┌─────────────────────────────────┐  ← surface-container (#201f1f)
│ 💻 DSA              [▶] [📊]   │  ← font-sans
│ 450/1000h (45%)                 │  ← font-mono
│ ████████░░░░░░░░ (progress bar) │  ← copper fill, dark empty
│ 🔥 29 days                      │  ← font-mono
└─────────────────────────────────┘  ← border-radius: 0 (sharp)

Border: 1px solid surface-container-highest or subtle copper
Hover: subtle copper glow
```

**Interactions**:
- Click card body → Navigate to skill detail
- Click ▶ → Open focus timer modal with skill pre-selected
- Click 📊 → Navigate to skill analytics

**Data Query**:
```typescript
const skills = await prisma.skill.findMany({
  where: {
    userId: session.user.id,
    isActive: true
  },
  orderBy: [
    { order: 'asc' },
    { createdAt: 'desc' }
  ],
  take: 5
});

// For each skill, calculate current streak
const skillsWithStreaks = await Promise.all(
  skills.map(async (skill) => {
    const streak = await calculateCurrentStreak(skill.id);
    return { ...skill, currentStreak: streak };
  })
);
```

---

#### 3. WEEK AT A GLANCE (ANALYTICS WIDGET)

**Components**:
- Bar chart showing last 7 days
- X-axis: Mon, Tue, Wed, Thu, Fri, Sat, Sun
- Y-axis: Hours (0-8)
- Each bar = total hours that day
- Color: saffron-500
- Below chart: "Total: 18.5 hrs this week"
- Link: "View Analytics →" to full analytics page

**Chart Library**: Recharts
```typescript
<BarChart data={weekData}>
  <XAxis dataKey="day" />
  <YAxis />
  <Bar dataKey="hours" fill="#F97316" radius={[4, 4, 0, 0]} />
</BarChart>
```

**Data Query**:
```typescript
const last7Days = Array.from({ length: 7 }, (_, i) => {
  return subDays(startOfDay(new Date()), 6 - i);
});

const weekData = await Promise.all(
  last7Days.map(async (day) => {
    const sessions = await prisma.focusSession.aggregate({
      where: {
        userId: session.user.id,
        startTime: {
          gte: day,
          lt: addDays(day, 1)
        }
      },
      _sum: { duration: true }
    });

    return {
      day: format(day, 'EEE'), // "Mon", "Tue", etc.
      hours: (sessions._sum.duration || 0) / 60
    };
  })
);
```

---

#### 4. STREAK & HEATMAP (PER-SKILL)

**Purpose**: Show consistency over time for each skill

**Components**:
- **Per-skill heatmap** (GitHub-style)
  - Show last 90-120 days
  - 4 levels: ░ (0h), ▓ (<2h), █ (2h+)
  - Color gradient: gray-100 → saffron-200 → saffron-500
- **Streak indicators**:
  - Longest streak (all-time)
  - Current streak
- **Legend**: Explain shading

**Layout**:
```
💻 DSA
Oct    Nov    Dec    Jan
░░▓█ ██░▓ ░░█▓ ████
Longest: 29  Current: 29

🎹 Guitar
Oct    Nov    Dec    Jan
░░░░ ░▓██ ░░░░ ███▓
Longest: 42  Current: 7
```

**Heatmap Logic**:
```typescript
// Get last 90 days of practice for a skill
const days = 90;
const heatmapData = Array.from({ length: days }, (_, i) => {
  const day = subDays(new Date(), days - i - 1);
  return {
    date: day,
    hours: 0 // will be populated
  };
});

// Query sessions for this skill
const sessions = await prisma.focusSession.groupBy({
  by: ['startTime'],
  where: {
    skillId: skill.id,
    startTime: { gte: subDays(new Date(), days) }
  },
  _sum: { duration: true }
});

// Map to heatmap
sessions.forEach((session) => {
  const dayIndex = differenceInDays(new Date(), session.startTime);
  if (heatmapData[days - dayIndex - 1]) {
    heatmapData[days - dayIndex - 1].hours = session._sum.duration / 60;
  }
});

// Convert to shading levels
const levels = heatmapData.map(d => {
  if (d.hours === 0) return 0;
  if (d.hours < 2) return 1;
  return 2;
});
```

**Streak Calculation**:
```typescript
async function calculateCurrentStreak(skillId: string): Promise<number> {
  const today = startOfDay(new Date());
  let currentStreak = 0;
  let checkDate = today;

  while (true) {
    const session = await prisma.focusSession.findFirst({
      where: {
        skillId,
        startTime: {
          gte: checkDate,
          lt: addDays(checkDate, 1)
        },
        duration: { gte: 30 } // min 30 min
      }
    });

    if (!session) break;

    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  return currentStreak;
}
```

---

#### 5. RECENT SESSIONS

**Purpose**: Show last 3 focus sessions

**Each Session Shows**:
- Skill icon + name
- Duration
- Time ago (e.g., "2 hours ago")
- Focus rating (⭐⭐⭐⭐⭐)

**Design**:
```
💻 DSA - 2 hours
   2 hours ago
   ⭐⭐⭐⭐⭐ (5/5)
```

**Data Query**:
```typescript
const recentSessions = await prisma.focusSession.findMany({
  where: { userId: session.user.id },
  orderBy: { endTime: 'desc' },
  take: 3,
  include: {
    skill: {
      select: { name: true, icon: true }
    }
  }
});
```

---

#### 6. QUICK STATS

**Purpose**: Lifetime stats at-a-glance

**Shows**:
- Total hours (all time, all skills)
- Active skills count
- Total sessions completed
- Longest streak ever
- Current level (based on mastery timeline)

**Level Calculation**:
```typescript
function getUserLevel(totalHours: number): string {
  if (totalHours < 50) return "Beginner";
  if (totalHours < 500) return "Competent";
  if (totalHours < 1000) return "Proficient";
  if (totalHours < 5000) return "Advanced";
  if (totalHours < 10000) return "Expert";
  return "Master";
}
```

---

### Dashboard Loading States

**Skeleton UI while loading**:
- Show gray placeholder boxes
- Animate with shimmer effect
- Never show blank screen

**Empty State** (no skills yet):
```
┌─────────────────────────────────────┐
│  You haven't created any skills yet │
│                                     │
│       [+ Create Your First Skill]   │
│                                     │
│  Start your journey to mastery 🚀   │
└─────────────────────────────────────┘
```

---

## SCREEN 4: FOCUS TIMER (CORE ENGINE)

### ⚠️ CRITICAL: This is the most important screen

**Purpose**: Track focus time with zero friction

### Modes

1. **Stopwatch** (default) - Count up until user stops
2. **Pomodoro** - Fixed duration with countdown

### Layout (Timer Active)

```
┌─────────────────────────────────────────────┐
│                                             │
│              FOCUS SESSION                  │
│                                             │
│  💻 Data Structures & Algorithms            │
│                                             │
│         ┌──────────────────┐                │
│         │                  │                │
│         │     01:23:45     │                │
│         │                  │                │
│         └──────────────────┘                │
│              ⏱️ Stopwatch                   │
│                                             │
│                                             │
│      [⏸️ Pause]    [⏹️ Stop & Save]         │
│                                             │
│                                             │
│  💡 Tip: Close this tab to focus. Timer     │
│     continues in the background.            │
│                                             │
│                                             │
│  🔕 Do Not Disturb Mode: ON                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Pre-Session Setup

**Modal appears when clicking "Start Focus"**:

```
┌─────────────────────────────────────────────┐
│  Start Focus Session                  [×]   │
├─────────────────────────────────────────────┤
│                                             │
│  Which skill are you practicing?            │
│  [💻 Data Structures & Algorithms ▼]       │
│                                             │
│  Focus Mode                                 │
│  ┌──────────────┐  ┌──────────────┐        │
│  │  Stopwatch   │  │  Pomodoro    │        │
│  │  🌊 Flow     │  │  ⏲️ Timed    │        │
│  └──────────────┘  └──────────────┘        │
│     (Selected)                              │
│                                             │
│  ─── Pomodoro Duration (if selected) ───    │
│  [25 min] [50 min] [90 min] [Custom]       │
│                                             │
│  Break Duration                             │
│  [5 min] [10 min] [15 min]                 │
│                                             │
│             [Start Session]                 │
└─────────────────────────────────────────────┘
```

### Stopwatch Mode

**Features**:
- Counts up from 00:00:00
- No time pressure
- User stops when naturally done
- Perfect for "flow state"

**Design Specifications**:
- Timer display: font-mono (Space Mono), text-9xl or larger
- Color: text-on-surface or text-primary (copper accent)
- Weight: font-bold (700)
- Letter spacing: -0.05em (tight for impact)
- Background: surface-container-lowest (#0e0e0e)
- Buttons: sharp corners (border-radius: 0), bg-brand-copper

**State**:
```typescript
const [isRunning, setIsRunning] = useState(true);
const [elapsedSeconds, setElapsedSeconds] = useState(0);

// Auto-save every 60 seconds
useEffect(() => {
  if (isRunning) {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      autoSaveSession(); // Save to DB periodically
    }, 1000);
    return () => clearInterval(interval);
  }
}, [isRunning]);
```

### Pomodoro Mode

**Features**:
- Countdown from selected duration
- Shows progress ring
- Auto-pause for break when timer ends
- Notification sound + browser notification

**State**:
```typescript
const [remainingSeconds, setRemainingSeconds] = useState(duration);
const [isBreak, setIsBreak] = useState(false);

useEffect(() => {
  if (isRunning && remainingSeconds > 0) {
    const interval = setInterval(() => {
      setRemainingSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  } else if (remainingSeconds === 0) {
    // Timer complete
    playNotificationSound();
    if (!isBreak) {
      setIsBreak(true);
      setRemainingSeconds(breakDuration);
    } else {
      // Session fully complete
      openSessionCompleteModal();
    }
  }
}, [isRunning, remainingSeconds]);
```

### Background Timer

**Critical**: Timer must continue if user closes tab/minimizes

**Implementation**:
```typescript
// Use Web Workers or Service Workers
// Store timer state in localStorage
// On page reload, resume from saved state

const saveTimerState = () => {
  localStorage.setItem('activeSession', JSON.stringify({
    skillId,
    mode: 'stopwatch',
    startTime: sessionStart.toISOString(),
    elapsedSeconds
  }));
};

// On mount, check for active session
useEffect(() => {
  const savedSession = localStorage.getItem('activeSession');
  if (savedSession) {
    const session = JSON.parse(savedSession);
    const elapsed = differenceInSeconds(new Date(), new Date(session.startTime));
    setElapsedSeconds(elapsed);
    // Ask user if they want to resume
  }
}, []);
```

### Timer Controls

**Buttons**:
1. **Pause** (⏸️)
   - Pause timer
   - Change to "Resume" (▶️)

2. **Stop & Save** (⏹️)
   - Stop timer
   - Open Session Complete modal
   - Red color to indicate finality

**Keyboard Shortcuts**:
- `Space`: Pause/Resume
- `Esc`: Stop & Save

### Do Not Disturb Mode

**Optional Feature**:
- Request browser permission
- Mute notifications
- Hide social media distractions
- Show full-screen timer (optional)

---

## SCREEN 5: SESSION COMPLETE

### Purpose
Capture session data + create positive emotion

### Layout

```
┌─────────────────────────────────────────────┐
│  Session Complete! 🎉                       │
├─────────────────────────────────────────────┤
│                                             │
│  💻 Data Structures & Algorithms            │
│  ⏱️ 1 hour 23 minutes                       │
│                                             │
│  How was your focus?                        │
│  ★ ★ ★ ★ ★                                 │
│  (Tap to rate)                              │
│                                             │
│  What did you work on? (Optional)           │
│  ┌─────────────────────────────────────┐   │
│  │ Practiced binary tree traversal     │   │
│  │ algorithms and solved 3 problems... │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ─── Session Stats ───                      │
│  • This session: +1h 23m                    │
│  • Total for DSA: 451.4 hrs                 │
│  • Progress: 45.1% to 1000h goal            │
│  • Streak: 29 days 🔥                       │
│                                             │
│                                             │
│      [Save Session]  [Start Another]        │
└─────────────────────────────────────────────┘
```

### Components

1. **Celebration Header**
   - "Session Complete! 🎉" (font-newsreader, text-2xl, italic)
   - Background: surface-container with copper accent or confetti animation
   - Text color: text-on-surface

2. **Session Summary**
   - Skill name + icon (font-sans, font-semibold)
   - Duration (font-mono, formatted nicely: "1 hour 23 minutes")

3. **Focus Rating** (1-5 stars)
   - Interactive star selector
   - Filled stars: brand-copper color
   - Empty stars: surface-container-highest
   - Default: 3 stars
   - Optional but encouraged

4. **Notes Field** (optional)
   - Multiline text area
   - Background: surface-container-highest
   - Border: 1px solid outline, border-radius: 0 (sharp corners)
   - Text: font-sans, text-on-surface
   - Placeholder: "What did you work on? (optional)"
   - Max 500 characters

5. **Session Stats** (motivation)
   - Numbers in font-mono (Space Mono)
   - Labels in font-sans
   - Show progress added
   - Updated total for skill
   - Percentage progress
   - Streak status (🔥 + font-mono)

6. **CTAs**
   - "Save Session" (primary, bg-brand-copper, border-radius: 0)
   - "Start Another" (secondary, border with copper, border-radius: 0)

**Modal Design**:
- Background: surface-container (#201f1f)
- Border: 1px solid brand-copper or none
- All corners sharp (border-radius: 0)
- Overlay: rgba(0, 0, 0, 0.8)

### Success Animations

**If user hits a milestone**:
- 🎉 New badge unlocked (20h, 50h, 100h, etc.)
- 🔥 Streak milestone (7, 30, 100 days)
- 📈 Level up (Beginner → Competent)

Show modal:
```
┌─────────────────────────────────────┐
│  🎉 Milestone Unlocked!             │
├─────────────────────────────────────┤
│                                     │
│        🏆 100 HOURS                 │
│                                     │
│  You've practiced DSA for 100 hours │
│  You're now COMPETENT!              │
│                                     │
│  [Share Achievement]  [Continue]    │
└─────────────────────────────────────┘
```

### Backend Actions on Save

```typescript
async function saveSession(data: SessionData) {
  const session = await prisma.$transaction(async (tx) => {
    // 1. Create session record
    const newSession = await tx.focusSession.create({
      data: {
        userId: data.userId,
        skillId: data.skillId,
        type: data.mode, // "stopwatch" | "pomodoro"
        duration: data.durationMinutes,
        startTime: data.startTime,
        endTime: new Date(),
        focusRating: data.rating || 3,
        notes: data.notes || null
      }
    });

    // 2. Update skill totals
    await tx.skill.update({
      where: { id: data.skillId },
      data: {
        totalMinutes: { increment: data.durationMinutes },
        totalHours: { increment: data.durationMinutes / 60 },
        lastPracticeDate: new Date()
      }
    });

    // 3. Update user total hours
    await tx.user.update({
      where: { id: data.userId },
      data: {
        totalHours: { increment: data.durationMinutes / 60 },
        lastActiveAt: new Date()
      }
    });

    return newSession;
  });

  // 4. Check and update streak (async, non-blocking)
  await updateStreak(data.userId, data.skillId);

  // 5. Check for badge unlocks
  await checkBadgeUnlocks(data.userId, data.skillId);

  // 6. Update leaderboard (if Phase 2)
  // await updateLeaderboard(data.userId);

  return session;
}
```

---

## SCREEN 6: SKILLS LIST

### Purpose
Manage all skills (if user has multiple)

### Layout

```
┌─────────────────────────────────────────────┐
│  ← Back to Dashboard                        │
├─────────────────────────────────────────────┤
│  My Skills                    [+ Add Skill]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 💻 Data Structures & Algorithms     │   │
│  │ ███████████████░░░░░ 451/1000 hrs  │   │
│  │ 🔥 29-day streak │ Level: Competent │   │
│  │                                     │   │
│  │ This week: 12 hrs                   │   │
│  │                                     │   │
│  │ [▶ Start Focus]  [View Details]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🎹 Guitar                           │   │
│  │ ██░░░░░░░░░░░░░░░░ 120/10000 hrs   │   │
│  │ 🔥 7-day streak  │ Level: Beginner  │   │
│  │                                     │   │
│  │ This week: 4 hrs                    │   │
│  │                                     │   │
│  │ [▶ Start Focus]  [View Details]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🏋️ Fitness (Inactive)               │   │
│  │ ░░░░░░░░░░░░░░░░░░ 15/1000 hrs     │   │
│  │ 💔 Streak: 0 days                   │   │
│  │                                     │   │
│  │ [▶ Start Focus]  [View Details]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Features

1. **Sort Options**
   - Recent (last practiced)
   - Progress (% to goal)
   - Hours (most → least)
   - Name (A-Z)

2. **Filter**
   - Active skills only
   - Archived skills

3. **Bulk Actions**
   - Archive skill (don't delete, preserve data)
   - Reorder skills (drag-and-drop)

---

## SCREEN 7: SKILL DETAIL

### Purpose
Deep dive into one skill's progress

### Layout

```
┌─────────────────────────────────────────────┐
│  ← Back                                     │
├─────────────────────────────────────────────┤
│  💻 Data Structures & Algorithms  [Edit] [⋮]│
├─────────────────────────────────────────────┤
│                                             │
│         ┌──────────────┐                    │
│         │              │                    │
│         │   451 hrs    │  45.1%             │
│         │  / 1000 hrs  │  to goal           │
│         │              │                    │
│         └──────────────┘                    │
│            (Progress Ring)                  │
│                                             │
│  🔥 Current Streak: 29 days                 │
│  🏆 Level: Competent (500-1000 hrs)         │
│                                             │
│          [▶ Start Focus Session]            │
│                                             │
├─────────────────────────────────────────────┤
│  STATS                                      │
├─────────────────────────────────────────────┤
│  Total Sessions: 187                        │
│  Avg Session Length: 2.4 hrs                │
│  Longest Session: 4.5 hrs                   │
│  This Week: 12 hrs                          │
│  This Month: 48 hrs                         │
│  Best Day: Thursday (avg 3.2 hrs)           │
│                                             │
├─────────────────────────────────────────────┤
│  PROGRESS OVER TIME                         │
├─────────────────────────────────────────────┤
│  [Line Chart: Cumulative hours over time]   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  500                           •••   │   │
│  │  400                      ••••       │   │
│  │  300                 •••••           │   │
│  │  200            •••••                │   │
│  │  100       ••••                      │   │
│  │    0  •••                            │   │
│  │      Jan  Feb  Mar  Apr  May  Jun   │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│  PRACTICE CALENDAR (HEATMAP)                │
├─────────────────────────────────────────────┤
│  Oct    Nov    Dec    Jan    Feb    Mar    │
│  ░░▓█ ██░▓ ░░█▓ ████ ▓▓▓█ ░░██             │
│                                             │
│  Legend: ░ 0h  ▓ <2h  █ 2h+                │
│                                             │
├─────────────────────────────────────────────┤
│  RECENT SESSIONS                            │
├─────────────────────────────────────────────┤
│  Jan 25, 2026 • 2.5 hrs • ⭐⭐⭐⭐⭐        │
│  "Solved 5 DP problems"                     │
│                                             │
│  Jan 24, 2026 • 1.5 hrs • ⭐⭐⭐⭐          │
│  "Binary tree traversals"                   │
│                                             │
│  Jan 23, 2026 • 3 hrs • ⭐⭐⭐⭐⭐          │
│  "Graph algorithms - DFS/BFS"               │
│                                             │
│  [View All Sessions →]                      │
└─────────────────────────────────────────────┘
```

### Components

1. **Progress Ring** (hero)
   - Large circular progress
   - Shows hours / target
   - Percentage

2. **Key Metrics**
   - Current streak
   - Level (based on mastery timeline)
   - Primary CTA to start session

3. **Stats Grid**
   - All-time stats
   - This week/month
   - Best practices (day, time)

4. **Progress Chart**
   - Cumulative hours over time (line chart)
   - Shows growth trajectory

5. **Heatmap** (same as dashboard but bigger)

6. **Session History**
   - Chronological list
   - Shows date, duration, rating, notes
   - Searchable/filterable

---

## SCREEN 8: ANALYTICS

### Purpose
Visual progress across all skills

### Layout

```
┌─────────────────────────────────────────────┐
│  Analytics                    [Filter: All] │
├─────────────────────────────────────────────┤
│  [Today] [Week] [Month] [All Time]          │
├─────────────────────────────────────────────┤
│                                             │
│  THIS WEEK                                  │
│  Total: 18.5 hours                          │
│  Avg per day: 2.6 hours                     │
│  Best day: Thursday (6 hrs)                 │
│                                             │
├─────────────────────────────────────────────┤
│  DAILY BREAKDOWN                            │
├─────────────────────────────────────────────┤
│  [Bar Chart]                                │
│   6 ┤                   ██                  │
│   5 ┤       ██          ██                  │
│   4 ┤       ██    ██    ██                  │
│   3 ┤  ██   ██    ██    ██    ██            │
│   2 ┤  ██   ██    ██    ██    ██            │
│   1 ┤  ██   ██    ██    ██    ██   ██       │
│     └──M────T─────W─────T─────F────S────S   │
│                                             │
├─────────────────────────────────────────────┤
│  SKILL DISTRIBUTION                         │
├─────────────────────────────────────────────┤
│  [Pie Chart]                                │
│                                             │
│  💻 DSA: 65% (12 hrs)                       │
│  🎹 Guitar: 30% (5.5 hrs)                   │
│  🏋️ Fitness: 5% (1 hr)                      │
│                                             │
├─────────────────────────────────────────────┤
│  TIME OF DAY ANALYSIS                       │
├─────────────────────────────────────────────┤
│  Most productive hours:                     │
│  7-9 AM   (avg 4.2/5 focus rating)          │
│                                             │
│  Least productive hours:                    │
│  3-5 PM   (avg 2.8/5 focus rating)          │
│                                             │
├─────────────────────────────────────────────┤
│  INSIGHTS                                   │
├─────────────────────────────────────────────┤
│  💡 You're most consistent on Thursdays     │
│  💡 Your best sessions are 45-60 minutes    │
│  💡 Morning sessions get 5/5 focus 80% time │
└─────────────────────────────────────────────┘
```

### Time Period Filters

- Today
- This Week (last 7 days)
- This Month (last 30 days)
- All Time

### Charts

1. **Daily/Weekly Bar Chart**
2. **Skill Distribution Pie Chart**
3. **Time of Day Heatmap** (which hours you practice most)

### Insights (Simple Pattern Detection)

No AI needed for MVP. Simple logic:

```typescript
// Best day of week
const bestDay = getDayWithMostHours(sessions);

// Best session length
const sessionLengths = sessions.map(s => s.duration);
const avgRatingByLength = groupBy(sessionLengths, (len) => {
  if (len < 30) return "short";
  if (len < 60) return "medium";
  return "long";
});
const bestLength = findHighestAvgRating(avgRatingByLength);

// Best time of day
const morningRating = getAvgRating(sessions.filter(s => getHour(s.startTime) < 12));
const afternoonRating = getAvgRating(sessions.filter(s => getHour(s.startTime) >= 12 && getHour(s.startTime) < 18));
const eveningRating = getAvgRating(sessions.filter(s => getHour(s.startTime) >= 18));
```

---

## SCREEN 9: PROFILE & SETTINGS

### Profile Tab

```
┌─────────────────────────────────────────────┐
│  Profile                        [Edit]      │
├─────────────────────────────────────────────┤
│                                             │
│      [Avatar Upload]                        │
│      Rahul Mishra                           │
│      @rahul_codes                           │
│                                             │
│  🔥 15-day streak  │  ⚡ Level: Competent   │
│                                             │
├─────────────────────────────────────────────┤
│  STATS                                      │
├─────────────────────────────────────────────┤
│  Total Hours: 570                           │
│  Active Skills: 2                           │
│  Sessions: 287                              │
│  Longest Streak: 42 days                    │
│  Member Since: Jan 15, 2026                 │
│                                             │
├─────────────────────────────────────────────┤
│  ACHIEVEMENTS (Phase 2)                     │
├─────────────────────────────────────────────┤
│  🔥 Week Warrior    ✓ 100-Hour Hero         │
│  ⚡ Early Bird      🔒 Marathon Master      │
│                                             │
└─────────────────────────────────────────────┘
```

### Settings Tab

```
┌─────────────────────────────────────────────┐
│  Settings                                   │
├─────────────────────────────────────────────┤
│                                             │
│  ACCOUNT                                    │
│  Email: rahul@example.com     [Change]      │
│  Password: ••••••••••         [Change]      │
│  Connected: Google, GitHub    [Manage]      │
│                                             │
│  PREFERENCES                                │
│  Daily Goal: [2] hours                      │
│  Timezone: [Asia/Kolkata ▼]                │
│                                             │
│  NOTIFICATIONS                              │
│  ☑ Daily practice reminder (9:00 AM)        │
│  ☑ Streak risk alerts                       │
│  ☐ Weekly summary                           │
│                                             │
│  FOCUS TIMER                                │
│  Default mode: ○ Stopwatch ● Pomodoro       │
│  Default duration: [50] minutes             │
│  Break duration: [10] minutes               │
│                                             │
│  DATA                                       │
│  [Export All Data (JSON)]                   │
│  [Download Practice Journal (PDF)]          │
│                                             │
│  DANGER ZONE                                │
│  [Delete Account]                           │
│                                             │
└─────────────────────────────────────────────┘
```

---

# DATABASE SCHEMA

## Core Principles

1. **Normalize for data integrity**
2. **Denormalize for performance where needed** (e.g., streak counts)
3. **Use indexes aggressively** for fast queries
4. **UTC timestamps everywhere**

## Schema (Supabase / PostgreSQL)

**Note**: Supabase uses PostgreSQL. Below is the SQL migration to create all tables.

User auth is handled by Supabase Auth (`auth.users` table) - we extend it with a `profiles` table.

```sql
-- ============================================
-- ENABLE UUID EXTENSION
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,

  -- Settings
  timezone text default 'UTC' not null,
  daily_goal_minutes integer default 120 not null, -- 2 hours

  -- Preferences
  default_timer_mode text default 'stopwatch' not null check (default_timer_mode in ('stopwatch', 'pomodoro')),
  default_pomodoro_minutes integer default 50 not null,
  default_break_minutes integer default 10 not null,

  -- Notifications
  notifications_enabled boolean default true not null,
  daily_reminder_time text, -- "09:00"
  streak_risk_alerts boolean default true not null,

  -- Stats (denormalized for fast access)
  total_hours numeric default 0 not null,
  total_sessions integer default 0 not null,
  longest_streak integer default 0 not null,
  current_global_streak integer default 0 not null,

  -- Metadata
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  last_active_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policy: Users can view own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Policy: Users can update own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index profiles_username_idx on public.profiles(username);

-- ============================================
-- SKILLS TABLE
-- ============================================

create table public.skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  icon text default '💡' not null,
  color text default '#F97316' not null,
  description text,

  -- Goals
  target_hours integer default 10000 not null,
  daily_goal_minutes integer, -- optional per-skill goal

  -- Progress (denormalized)
  total_hours numeric default 0 not null,
  total_minutes integer default 0 not null,
  total_sessions integer default 0 not null,

  -- Streaks
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  last_practice_date timestamptz,

  -- Display
  "order" integer default 0 not null,
  is_active boolean default true not null,

  -- Metadata
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.skills enable row level security;

-- Policy: Users can view own skills
create policy "Users can view own skills"
  on public.skills for select
  using (auth.uid() = user_id);

-- Policy: Users can insert own skills
create policy "Users can insert own skills"
  on public.skills for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update own skills
create policy "Users can update own skills"
  on public.skills for update
  using (auth.uid() = user_id);

-- Policy: Users can delete own skills
create policy "Users can delete own skills"
  on public.skills for delete
  using (auth.uid() = user_id);

-- Indexes
create index skills_user_id_is_active_idx on public.skills(user_id, is_active);
create index skills_user_id_order_idx on public.skills(user_id, "order");

-- ============================================
-- FOCUS SESSIONS TABLE
-- ============================================

create table public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,

  -- Session type
  type text not null check (type in ('stopwatch', 'pomodoro')),

  -- Time
  duration integer not null, -- minutes (rounded)
  start_time timestamptz not null,
  end_time timestamptz not null,

  -- Quality
  focus_rating integer default 3 check (focus_rating >= 1 and focus_rating <= 5),
  notes text,

  -- Metadata
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.focus_sessions enable row level security;

-- Policy: Users can view own sessions
create policy "Users can view own sessions"
  on public.focus_sessions for select
  using (auth.uid() = user_id);

-- Policy: Users can insert own sessions
create policy "Users can insert own sessions"
  on public.focus_sessions for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update own sessions
create policy "Users can update own sessions"
  on public.focus_sessions for update
  using (auth.uid() = user_id);

-- Policy: Users can delete own sessions
create policy "Users can delete own sessions"
  on public.focus_sessions for delete
  using (auth.uid() = user_id);

-- Indexes for fast queries
create index focus_sessions_user_id_skill_id_idx on public.focus_sessions(user_id, skill_id);
create index focus_sessions_user_id_start_time_idx on public.focus_sessions(user_id, start_time);
create index focus_sessions_skill_id_start_time_idx on public.focus_sessions(skill_id, start_time);
create index focus_sessions_start_time_idx on public.focus_sessions(start_time); -- for date range queries

-- ============================================
-- UPDATED_AT TRIGGER (for all tables)
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_skills_updated_at
  before update on public.skills
  for each row execute procedure public.handle_updated_at();
```

### Generate TypeScript Types

After creating tables, generate types:

```bash
# In your project directory
npx supabase gen types typescript --project-id your-project-ref > lib/database.types.ts
```

This creates type-safe definitions for all tables.

---

## Key Database Operations

### 1. Create User (via Supabase Auth)

```typescript
// Handled automatically by Supabase Auth
// When user signs up:
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      full_name: 'Rahul Mishra',
      avatar_url: 'https://...'
    }
  }
});

// Profile is auto-created via database trigger (handle_new_user)
```

### 2. Create Skill

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const { data: skill, error } = await supabase
  .from('skills')
  .insert({
    name: "Data Structures",
    icon: "💻",
    target_hours: 1000,
    daily_goal_minutes: 120,
    user_id: session.user.id,
    order: existingSkillCount + 1
  })
  .select()
  .single();

if (error) throw error;
return skill;
```

### 3. Save Focus Session (with updates to skill/user)

```typescript
import { createClient } from '@/lib/supabase/client';
import { startOfDay, subDays, isSameDay } from 'date-fns';

async function saveFocusSession(data: SessionInput) {
  const supabase = createClient();

  // 1. Insert focus session
  const { data: session, error: sessionError } = await supabase
    .from('focus_sessions')
    .insert({
      user_id: data.userId,
      skill_id: data.skillId,
      type: data.mode, // "stopwatch" | "pomodoro"
      duration: Math.round(data.durationMinutes),
      start_time: data.startTime.toISOString(),
      end_time: new Date().toISOString(),
      focus_rating: data.rating || 3,
      notes: data.notes || null
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  // 2. Update skill totals (using RPC for atomic increment)
  const { data: updatedSkill, error: skillError } = await supabase.rpc(
    'update_skill_after_session',
    {
      p_skill_id: data.skillId,
      p_duration_minutes: session.duration
    }
  );

  if (skillError) throw skillError;

  // 3. Update user totals
  await supabase.rpc('update_user_after_session', {
    p_user_id: data.userId,
    p_duration_minutes: session.duration
  });

  // 4. Update streak (async)
  await updateStreak(data.userId, data.skillId);

  return { session, skill: updatedSkill };
}
```

### 3b. Database Functions for Updates

Create these PostgreSQL functions in Supabase:

```sql
-- Update skill totals atomically
create or replace function update_skill_after_session(
  p_skill_id uuid,
  p_duration_minutes integer
)
returns void as $$
begin
  update public.skills
  set
    total_minutes = total_minutes + p_duration_minutes,
    total_hours = total_hours + (p_duration_minutes::numeric / 60),
    total_sessions = total_sessions + 1,
    last_practice_date = now()
  where id = p_skill_id;
end;
$$ language plpgsql security definer;

-- Update user totals atomically
create or replace function update_user_after_session(
  p_user_id uuid,
  p_duration_minutes integer
)
returns void as $$
begin
  update public.profiles
  set
    total_hours = total_hours + (p_duration_minutes::numeric / 60),
    total_sessions = total_sessions + 1,
    last_active_at = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;
```

### 4. Calculate Streak

```typescript
async function updateStreak(userId: string, skillId: string) {
  const supabase = createClient();

  // Get skill
  const { data: skill } = await supabase
    .from('skills')
    .select('current_streak, longest_streak, last_practice_date')
    .eq('id', skillId)
    .single();

  if (!skill) return;

  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  // Check if user practiced today (min 30 min)
  const { data: todaySession } = await supabase
    .from('focus_sessions')
    .select('id')
    .eq('skill_id', skillId)
    .gte('start_time', today.toISOString())
    .gte('duration', 30)
    .limit(1)
    .single();

  if (!todaySession) {
    // No session today, don't update
    return;
  }

  const lastPractice = skill.last_practice_date
    ? new Date(skill.last_practice_date)
    : null;

  // Determine if streak continues
  const isConsecutive = lastPractice && (
    isSameDay(lastPractice, yesterday) ||
    isSameDay(lastPractice, today)
  );

  const newStreak = isConsecutive ? skill.current_streak + 1 : 1;

  // Update streak
  await supabase
    .from('skills')
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(skill.longest_streak, newStreak)
    })
    .eq('id', skillId);
}
```

### 5. Get Dashboard Data

```typescript
async function getDashboardData(userId: string) {
  const supabase = createClient();
  const today = startOfDay(new Date());

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, total_hours, longest_streak, daily_goal_minutes')
    .eq('id', userId)
    .single();

  // Get active skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('order', { ascending: true });

  // Get today's sessions
  const { data: todaySessions } = await supabase
    .from('focus_sessions')
    .select(`
      *,
      skill:skills(name, icon)
    `)
    .eq('user_id', userId)
    .gte('start_time', today.toISOString())
    .order('end_time', { ascending: false })
    .limit(3);

  // Get last 7 days for chart
  const weekData = await Promise.all(
    Array.from({ length: 7 }, async (_, i) => {
      const day = subDays(today, 6 - i);
      const nextDay = addDays(day, 1);

      const { data } = await supabase
        .from('focus_sessions')
        .select('duration')
        .eq('user_id', userId)
        .gte('start_time', day.toISOString())
        .lt('start_time', nextDay.toISOString());

      const totalMinutes = data?.reduce((sum, s) => sum + s.duration, 0) || 0;

      return {
        day: format(day, 'EEE'),
        hours: totalMinutes / 60
      };
    })
  );

  // Calculate today's total
  const todayMinutes = todaySessions?.reduce((sum, s) => sum + s.duration, 0) || 0;

  return {
    profile,
    skills,
    todayHours: todayMinutes / 60,
    dailyGoal: (profile?.daily_goal_minutes || 120) / 60,
    recentSessions: todaySessions,
    weekChart: weekData
  };
}
```

### 5. Get Dashboard Data

```typescript
async function getDashboardData(userId: string) {
  const today = startOfDay(new Date());

  // Parallel queries for performance
  const [user, skills, todaySessions, weekSessions] = await Promise.all([
    // User info
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        avatar: true,
        totalHours: true,
        longestStreak: true,
        dailyGoalMinutes: true
      }
    }),

    // Active skills with sessions count
    prisma.skill.findMany({
      where: { userId, isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { sessions: true }
        }
      }
    }),

    // Today's sessions
    prisma.focusSession.findMany({
      where: {
        userId,
        startTime: { gte: today }
      },
      include: {
        skill: {
          select: { name: true, icon: true }
        }
      },
      orderBy: { endTime: 'desc' },
      take: 3
    }),

    // Last 7 days for chart
    Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const day = subDays(today, 6 - i);
        return prisma.focusSession.aggregate({
          where: {
            userId,
            startTime: {
              gte: day,
              lt: addDays(day, 1)
            }
          },
          _sum: { duration: true }
        }).then(result => ({
          day: format(day, 'EEE'),
          hours: (result._sum.duration || 0) / 60
        }));
      })
    )
  ]);

  // Calculate today's total
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  return {
    user,
    skills,
    todayHours: todayMinutes / 60,
    dailyGoal: (user?.dailyGoalMinutes || 120) / 60,
    recentSessions: todaySessions,
    weekChart: weekSessions
  };
}
```

---

# TECHNICAL STACK

## Frontend

**Framework**: Next.js 16+ (App Router)
- Server Components by default
- Client Components for interactivity
- Streaming with Suspense
- Server Actions for mutations

**Language**: TypeScript (strict mode)

**Styling**: Tailwind CSS v4 (CSS-first config via `@theme`)
- "Digital Temple" design system — see DESIGN_SYSTEM.md
- All tokens defined in `globals.css` via `@theme` (no `tailwind.config.ts` in v4)
- Framer Motion for animations
- **NO shadcn/ui** — design is too opinionated; component library defaults would conflict

**Component Architecture**: Radix UI Primitives (unstyled, accessible)
- Used ONLY for complex interactive components that need accessibility:
  `@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-slider`,
  `@radix-ui/react-tabs`, `@radix-ui/react-progress`, `@radix-ui/react-label`,
  `@radix-ui/react-tooltip`
- All other components (buttons, cards, nav, timer, heatmap) are built custom with Tailwind

**State Management**:
- Server State: Supabase client (direct queries from Server Components)
- Client State: React state / useReducer (minimal — avoid Zustand for Phase 1)
- Form State: React Hook Form + Zod

**Charts**: Recharts
- Bar charts
- Pie charts
- Line charts

**Date/Time**: date-fns
- Lightweight
- Tree-shakeable
- Better than moment.js

---

## Backend (PRIMARY: Supabase)

**Platform**: Supabase (All-in-one backend)

**Why Supabase?**
- Authentication built-in (email, OAuth)
- PostgreSQL database included
- Realtime subscriptions (for squad feeds, leaderboards)
- File storage (for avatars)
- Row Level Security (RLS) for data protection
- Auto-generated REST API
- Auto-generated TypeScript types
- No separate backend server needed

**Database**: PostgreSQL (via Supabase)
- Automatic backups
- Connection pooling
- Row Level Security policies
- Triggers and functions support

**Auth**: Supabase Auth
- Email/password with magic links
- Google OAuth
- GitHub OAuth
- JWT-based sessions
- Automatic user management

**Storage**: Supabase Storage
- User avatars
- Badge images
- Public and private buckets

**Realtime**: Supabase Realtime (Phase 2+)
- Live squad activity feeds
- Real-time leaderboard updates
- Uses Postgres CDC (Change Data Capture)

**API Access**:
- Supabase Client (JavaScript SDK)
- Auto-generated REST API
- PostgREST for custom queries
- RPC functions for complex logic

---

## Backend (SECONDARY: FastAPI for AI)

**Platform**: FastAPI (Python)

**Purpose**: AI/ML workloads only
- Weekly AI insights generation
- Pattern detection
- Recommendation engine
- Heavy data processing

**Why FastAPI?**
- Python ecosystem (OpenAI, NumPy, Pandas)
- Fast async performance
- Easy to deploy separately
- Type hints with Pydantic

**Deployment**: Vercel (Python runtime) or Railway

**Communication**:
- Next.js → FastAPI via HTTP
- Supabase → FastAPI via webhooks (for cron jobs)

---

## Infrastructure

**Hosting**: Vercel
- Auto-deploy from GitHub
- Edge network (CDN)
- Serverless functions
- Zero config
- Python runtime support (for FastAPI)

**Database**: Supabase Postgres
- Managed PostgreSQL
- Automatic backups
- Branch databases for dev/staging

**Caching**: Vercel Edge Cache
- Automatic for static assets
- Supabase caches queries internally

**Cron Jobs**: Supabase Edge Functions + pg_cron
- Weekly AI insights (trigger FastAPI)
- Daily streak checks
- Leaderboard aggregation

---

## Developer Tools

**Package Manager**: pnpm
- Faster than npm/yarn
- Better disk usage

**Code Quality**:
- ESLint (Next.js config)
- Prettier
- Husky (pre-commit hooks)
- lint-staged

**Type Safety**:
- TypeScript strict mode
- Zod for runtime validation
- Supabase auto-generated types (`npx supabase gen types typescript`)

**Local Development**:
- Supabase CLI for local database
- `supabase start` (runs Postgres locally via Docker)
- `supabase db push` (apply migrations)

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" # Server-side only

# FastAPI (AI Backend)
FASTAPI_URL="https://your-fastapi.vercel.app"
FASTAPI_SECRET="shared-secret-for-auth"

# OpenAI (for AI insights - used by FastAPI)
OPENAI_API_KEY="sk-..."

# OAuth (configured in Supabase dashboard)
# Google: Set up in Supabase Auth settings
# GitHub: Set up in Supabase Auth settings
```

---

## Supabase vs Previous Stack (Why This is Better)

| Feature | Previous (Prisma + NextAuth) | New (Supabase) |
|---------|------------------------------|----------------|
| **Setup** | Multiple services | Single platform |
| **Auth** | NextAuth.js config | Built-in, zero config |
| **Database** | Prisma + Neon | PostgreSQL included |
| **Realtime** | Manual setup | Built-in subscriptions |
| **Storage** | Separate service | Included |
| **API** | Build yourself | Auto-generated |
| **Types** | Prisma generate | `supabase gen types` |
| **RLS** | Manual middleware | Database-level security |
| **Cost** | Multiple bills | Free tier, then one bill |

**Key Advantage**: Supabase handles 80% of backend work. You only need FastAPI for AI-specific tasks.

---

# DEVELOPMENT ROADMAP

## Phase 1: MVP (Weeks 1-4) ✅ BUILD THIS FIRST

**Goal**: Ship core loop — users can track skills and focus

### Week 1: Setup & Auth
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Create Supabase project
  - [ ] Run SQL migrations (profiles, skills, focus_sessions tables)
  - [ ] Set up Row Level Security policies
  - [ ] Configure OAuth providers (Google, GitHub) in Supabase dashboard
- [ ] Install and configure Supabase client
  - [ ] `npm install @supabase/supabase-js`
  - [ ] Create Supabase client wrapper
  - [ ] Generate TypeScript types from database
- [ ] Implement Supabase Auth
  - [ ] Email/password signup/login
  - [ ] Google OAuth
  - [ ] GitHub OAuth
  - [ ] Auth middleware for protected routes
- [ ] Build landing page
- [ ] Build onboarding flow (create first skill)

### Week 2: Focus Timer & Session Logging
- [ ] Build focus timer component
  - [ ] Stopwatch mode
  - [ ] Pomodoro mode
  - [ ] Background timer persistence
- [ ] Build session complete modal
- [ ] Implement save session logic
- [ ] Update skill/user totals on save

### Week 3: Dashboard & Skills
- [ ] Build dashboard layout (based on wireframe)
  - [ ] Today's progress ring
  - [ ] Skills list with quick actions
  - [ ] Week bar chart
  - [ ] Recent sessions
- [ ] Build skills list page
- [ ] Build skill detail page
- [ ] Implement streak calculation logic

### Week 4: Analytics & Polish
- [ ] Build analytics page
  - [ ] Time period filters
  - [ ] Bar/pie charts
  - [ ] Simple insights
- [ ] Build profile & settings
- [ ] Add loading states
- [ ] Add error handling
- [ ] Mobile responsive design
- [ ] Performance optimization

**Deliverable**: Fully functional MVP that users can start using daily

---

## Phase 2: Gamification (Weeks 5-6)

**Goal**: Add retention mechanics

### Features
- [ ] Achievement system
  - [ ] Define 20-30 badges
  - [ ] Badge unlock logic
  - [ ] Badge display on profile
- [ ] Milestone celebrations
  - [ ] Confetti animations
  - [ ] Modal on unlock
- [ ] Level system
  - [ ] Calculate level from hours
  - [ ] Show level badges

---

## Phase 3: Social (Weeks 7-8)

**Goal**: Add accountability layer

### Features
- [ ] Squads (accountability groups)
  - [ ] Create/join squads
  - [ ] Invite system (code/link)
  - [ ] Squad feed
  - [ ] Simple chat
- [ ] Leaderboards
  - [ ] Per-skill rankings
  - [ ] Global rankings
  - [ ] Time period filters (day/week/month)

---

## Phase 4: Advanced Features (Weeks 9-12)

**Goal**: Enhance UX with power features

### Features
- [ ] Hierarchical skills (parent → sub-skills → tasks)
- [ ] Calendar view (Notion-style)
- [ ] Drag-to-create tasks from calendar
- [ ] AI insights (OpenAI integration)
  - [ ] Weekly reports
  - [ ] Pattern detection
  - [ ] Personalized recommendations
- [ ] Social sharing (LinkedIn, X, Instagram)
- [ ] Export data (JSON, PDF)

---

## Phase 5: Mobile & Scale (Weeks 13-16)

**Goal**: Reach mobile users and optimize for scale

### Features
- [ ] Progressive Web App (PWA)
  - [ ] Offline support
  - [ ] Push notifications
  - [ ] Install prompt
- [ ] Native mobile app (React Native - optional)
- [ ] Performance optimizations
  - [ ] Database query optimization
  - [ ] Caching strategy
  - [ ] Image optimization
- [ ] Analytics & monitoring
  - [ ] Sentry for errors
  - [ ] PostHog for product analytics
  - [ ] Performance monitoring

---

# PHASE 2+ FEATURES

## Features Deferred (Build After MVP Validation)

### 1. Hierarchical Skills
- Parent skills → Sub-skills → Tasks
- Time rollup logic (task → sub → parent)
- Drag-and-drop reordering

### 2. Calendar View
- Notion-style calendar
- Drag-to-create sessions
- Visual time blocks
- Integration with existing sessions

### 3. AI Coach
- OpenAI GPT-4 integration
- Weekly insights generation
- Pattern detection:
  - Best practice times
  - Optimal session lengths
  - Skill balance recommendations
- Personalized goals

### 4. Squads (Detailed)
- Create skill-based groups
- Invite system (link/code)
- Squad leaderboard (daily/weekly/monthly)
- Activity feed (real-time updates)
- Simple chat
- Squad challenges
- Squad streak (all members practice)

### 5. Global Leaderboard
- Skill-specific rankings
- Global rankings (all skills)
- Time period filters
- Percentile rankings ("Top 5%")
- Opt-in/opt-out privacy

### 6. Achievement System (Full)
- 50+ badges across categories:
  - Streak badges (7, 30, 100, 365 days)
  - Hour milestones (20, 50, 100, 500, 1k, 5k, 10k)
  - Session quality (50x 5-star sessions)
  - Social (squad leader, motivator)
  - Special (top 1%, skill champion)
- Badge rarity system
- Share to social media
- Badge showcase on profile

### 7. Skill Roadmaps
- Pre-built learning paths
- Community-contributed roadmaps
- Level-based milestones
- Resource recommendations

### 8. Social Sharing
- Auto-generate share images
- LinkedIn, X (Twitter), Instagram integration
- Custom share text templates
- Share badges, milestones, streaks

### 9. Advanced Analytics
- Custom date ranges
- Comparison view (this week vs last week)
- Export to CSV
- Detailed session analysis
- Time-of-day heatmap

### 10. Mobile App
- React Native (iOS + Android)
- Or Progressive Web App (PWA)
- Push notifications
- Offline support
- Widget for home screen

---

# CRITICAL SUCCESS FACTORS

## 1. CORE LOOP MUST WORK

```
Open App → Start Focus → Complete Session → See Progress → Feel Good → Come Back
```

If this breaks, nothing else matters.

## 2. SPEED IS CRITICAL

- Dashboard load: < 1 second
- Timer start: instant
- Session save: < 500ms
- No laggy animations

**Why?** Daily habit apps must feel effortless.

## 3. PROGRESS MUST BE VISIBLE

Every action should show progress:
- Start timer → See timer running
- Stop timer → See hours increase
- Complete session → See streak update
- Open dashboard → See daily goal progress

## 4. DO NOT OVERWHELM

Less is more. Show only essential info:
- Dashboard: Action-first, data second
- Timer: Just the timer, nothing else
- Analytics: Simple charts, not dashboards

## 5. MOBILE-FIRST DESIGN

Most users will access on mobile.
- Touch-friendly buttons (min 44px)
- Readable text (min 16px)
- Thumb-reachable CTAs
- Fast loading on 4G

## 6. DAILY HABIT FORMATION

Use psychology:
- Streaks create commitment
- Daily goals create structure
- Celebrations create dopamine
- Progress creates identity

---

# FINAL RULES (READ BEFORE BUILDING)

## RULE 1: Action Over Data

Every screen must push user to **START FOCUS**. Don't make them navigate 3 levels deep.

## RULE 2: Speed Over Perfection

Ship MVP in 4 weeks. Iterate based on user feedback. Don't build features users don't ask for.

## RULE 3: Progress Over Features

Visible progress > fancy features. A simple progress bar that updates is more valuable than AI insights.

## RULE 4: Consistency Over Complexity

Daily 30-minute practice > occasional 5-hour sessions. Reward consistency, not volume.

## RULE 5: Simplicity Over Flexibility

Don't add 10 configuration options. Choose sensible defaults. Let users customize later if they beg for it.

---

# GETTING STARTED

## Step 1: Set Up Environment

```bash
# Clone/create repo
git clone <repo-url>
cd tapasya

# Install dependencies
pnpm install

# Set up Supabase
# 1. Create Supabase project: https://supabase.com/dashboard
# 2. Copy the project URL and anon key to .env
# 3. Go to SQL Editor in Supabase dashboard
# 4. Copy and run the SQL migration from MASTER_PLAN.md (Database Schema section)
# 5. Set up OAuth providers in Authentication > Providers (Google, GitHub)

# Generate TypeScript types from Supabase
npx supabase gen types typescript --project-id your-project-ref > lib/database.types.ts

# Alternative: Use Supabase CLI for local development (optional but recommended)
npx supabase init
npx supabase start  # Starts local Postgres via Docker
npx supabase db push  # Apply migrations to local DB

# Start dev server
pnpm dev
```

### Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# FastAPI (Phase 2+, when adding AI)
# FASTAPI_URL=https://your-fastapi.vercel.app
# OPENAI_API_KEY=sk-...
```

## Step 2: Build in This Order

1. **Auth** (landing + login + signup)
2. **Onboarding** (create first skill)
3. **Timer** (stopwatch + pomodoro)
4. **Session Save** (session complete modal)
5. **Dashboard** (hero section + skills list)
6. **Streak Logic** (calculate and display)
7. **Analytics** (basic charts)
8. **Profile** (stats + settings)

## Step 3: Test Daily

Use your own app every day while building. If you don't want to use it, users won't either.

## Step 4: Ship MVP

Deploy to Vercel. Get 10 users. Watch how they use it. Iterate.

---

# CLOSING THOUGHTS

**You are not building a feature-rich app.**

**You are building a system that makes people consistent.**

Every line of code should serve that goal.

Focus on:
1. Making it easy to start a focus session
2. Making progress visible
3. Making users feel good about their practice

Everything else is secondary.

---

**Now stop reading and start building. 🔥**

Your Tapasya starts now.

---

**END OF MASTER PLAN**

This is your single source of truth. Reference this document for every decision. Update it as you learn. Keep it living.

Good luck building Tapasya! 🚀
