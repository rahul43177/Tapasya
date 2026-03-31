# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tapasya is a skill mastery tracker web application. Users track skills, log practice sessions via a focus timer, view analytics, earn achievements, and join accountability squads.

## Commands

```bash
cd tapasya-web
npm run dev      # Development server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

**Single Next.js 16 app** in `tapasya-web/` using App Router with React 19 and TypeScript.

### Directory Structure

```
tapasya-web/src/
├── app/
│   ├── (auth)/           # Login, signup (unauthenticated)
│   ├── (dashboard)/      # Protected routes (dashboard, skills, sessions, analytics, achievements, squads, profile, settings)
│   └── auth/             # OAuth callback handlers
├── components/           # Feature-organized: ui/, skills/, focus-timer/, analytics/, squads/, etc.
└── lib/
    ├── supabase/         # Client (client.ts), server (server.ts), auth helpers
    ├── types/            # database.ts (Supabase generated), index.ts
    ├── schemas/          # Zod validation schemas
    └── utils/            # analytics.ts, achievements.ts, streaks.ts, mastery.ts, squads.ts
```

### Key Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **UI Components**: Radix UI primitives (no shadcn)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Animations**: Framer Motion

## Design System

**"Digital Temple" aesthetic** - minimalist editorial meets sacred geometry.

### Non-Negotiable Rules

1. **Border radius**: Always 0px (sharp corners everywhere)
2. **Headlines**: Newsreader serif (often italic)
3. **Numbers/timers**: Space Mono monospace
4. **Primary action color**: Copper `#E05C00`
5. **Backgrounds**: Deep blacks (`#0e0e0e` to `#353434`)

### Colors

- **Primary/Brand**: Copper `#E05C00`, light peachy `#ffb694`
- **Accent**: Gold `#e9c349`
- **Surfaces**: `#0e0e0e` (darkest) → `#353434` (lightest)
- **Text**: `#e5e2e1` (primary), `#e1c0b2` (secondary)

Theme defined in `src/app/globals.css` using Tailwind v4 `@theme` directive.

## Database

Supabase PostgreSQL with Row Level Security enabled. Migrations in `supabase/migrations/`.

**Core tables**: profiles, skills, sessions, achievements, user_achievements, squads, squad_members

## Authentication

Supabase Auth (email/password + OAuth). Session managed via `@supabase/ssr` in middleware. Protected routes in `(dashboard)` route group.

## Documentation

Detailed docs in `docs/`:
- `MASTER_PLAN.md` - Complete technical specification
- `PROJECT_ROADMAP.md` - Phase-by-phase breakdown
- `DESIGN_SYSTEM.md` - Visual design language
