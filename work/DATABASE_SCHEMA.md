# Database Schema Reference

Project: Tapasya — Skill Mastery System
Supabase Project ID: `utpbnnfnetxicduftjlw`

---

## Entity Relationship Diagram

```
auth.users (Supabase managed)
    │
    │ on insert → trigger: on_auth_user_created
    │
    ▼
profiles (1)
    │   id → references auth.users(id)
    │
    ├──────────────────────┐
    │                      │
    ▼                      ▼
skills (many)         focus_sessions (many)
    │                      │
    │  id ◄────────────────┘ skill_id
    │
    └── focus_sessions (many)
            skill_id → references skills(id)
```

**Relationships:**
- `auth.users` → `profiles` (1:1, FK + trigger auto-creates profile on signup)
- `profiles` → `skills` (1:many, a user owns many skills)
- `profiles` → `focus_sessions` (1:many, a user has many sessions)
- `skills` → `focus_sessions` (1:many, a session belongs to one skill)

---

## Tables

### `profiles`
Extends `auth.users`. Auto-created via trigger on signup.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | NO | — | PK, FK → auth.users(id) |
| `username` | text | YES | null | unique |
| `full_name` | text | YES | null | from OAuth metadata |
| `avatar_url` | text | YES | null | from OAuth metadata |
| `timezone` | text | NO | `'UTC'` | |
| `daily_goal_minutes` | integer | NO | `120` | 2 hours default |
| `default_timer_mode` | text | NO | `'stopwatch'` | check: stopwatch \| pomodoro |
| `default_pomodoro_minutes` | integer | NO | `50` | |
| `default_break_minutes` | integer | NO | `10` | |
| `notifications_enabled` | boolean | NO | `true` | |
| `daily_reminder_time` | text | YES | null | format: "09:00" |
| `streak_risk_alerts` | boolean | NO | `true` | |
| `total_hours` | numeric | NO | `0` | denormalized stat |
| `total_sessions` | integer | NO | `0` | denormalized stat |
| `longest_streak` | integer | NO | `0` | denormalized stat |
| `current_global_streak` | integer | NO | `0` | denormalized stat |
| `created_at` | timestamptz | NO | `now()` | |
| `updated_at` | timestamptz | NO | `now()` | auto-updated via trigger |
| `last_active_at` | timestamptz | NO | `now()` | |

**RLS:** enabled
- select: `auth.uid() = id`
- update: `auth.uid() = id`

**Triggers:**
- `on_auth_user_created` — inserts row on `auth.users` insert
- `handle_profiles_updated_at` — sets `updated_at = now()` on update

**Indexes:** `profiles_username_idx`

---

### `skills`
One row per skill a user is tracking (e.g. "Piano", "DSA", "Spanish").

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | NO | `uuid_generate_v4()` | PK |
| `user_id` | uuid | NO | — | FK → profiles(id) cascade |
| `name` | text | NO | — | |
| `icon` | text | NO | `'💡'` | emoji |
| `color` | text | NO | `'#F97316'` | hex color |
| `description` | text | YES | null | |
| `target_hours` | integer | NO | `10000` | mastery target |
| `daily_goal_minutes` | integer | YES | null | per-skill override |
| `total_hours` | numeric | NO | `0` | denormalized stat |
| `total_minutes` | integer | NO | `0` | denormalized stat |
| `total_sessions` | integer | NO | `0` | denormalized stat |
| `current_streak` | integer | NO | `0` | denormalized stat |
| `longest_streak` | integer | NO | `0` | denormalized stat |
| `last_practice_date` | timestamptz | YES | null | |
| `order` | integer | NO | `0` | display sort order |
| `is_active` | boolean | NO | `true` | false = archived |
| `created_at` | timestamptz | NO | `now()` | |
| `updated_at` | timestamptz | NO | `now()` | auto-updated via trigger |

**RLS:** enabled
- select/update/delete: `auth.uid() = user_id`
- insert: `auth.uid() = user_id`

**Triggers:**
- `handle_skills_updated_at` — sets `updated_at = now()` on update

**Indexes:**
- `skills_user_id_is_active_idx` on `(user_id, is_active)`
- `skills_user_id_order_idx` on `(user_id, "order")`

---

### `focus_sessions`
Each logged practice/focus session.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | NO | `uuid_generate_v4()` | PK |
| `user_id` | uuid | NO | — | FK → profiles(id) cascade |
| `skill_id` | uuid | NO | — | FK → skills(id) cascade |
| `type` | text | NO | — | check: stopwatch \| pomodoro |
| `duration` | integer | NO | — | minutes (rounded) |
| `start_time` | timestamptz | NO | — | |
| `end_time` | timestamptz | NO | — | |
| `focus_rating` | integer | YES | `3` | 1–5, check constraint |
| `notes` | text | YES | null | |
| `created_at` | timestamptz | NO | `now()` | |

**RLS:** enabled
- select/insert/update/delete: `auth.uid() = user_id`

**Indexes:**
- `focus_sessions_user_id_skill_id_idx` on `(user_id, skill_id)`
- `focus_sessions_user_id_start_time_idx` on `(user_id, start_time)`
- `focus_sessions_skill_id_start_time_idx` on `(skill_id, start_time)`
- `focus_sessions_start_time_idx` on `(start_time)`

---

## Triggers & Functions

| Trigger | Table | Event | Function |
|---|---|---|---|
| `on_auth_user_created` | `auth.users` | AFTER INSERT | `handle_new_user()` |
| `handle_profiles_updated_at` | `profiles` | BEFORE UPDATE | `handle_updated_at()` |
| `handle_skills_updated_at` | `skills` | BEFORE UPDATE | `handle_updated_at()` |

**`handle_new_user()`** — inserts into `profiles(id, full_name, avatar_url)` using `new.raw_user_meta_data` from OAuth.

**`handle_updated_at()`** — sets `new.updated_at = now()`.

---

## Phase 2/3 Tables (not yet created)
These will be added in later phases. They will reference `profiles` and `skills`.

- `streaks` — per-skill streak tracking
- `milestones` — badge events at hours thresholds
- `subcategories` — sub-skills under a skill
- `squads` — group accountability rooms
- `squad_members` — squad membership

---

## Generate TypeScript Types

Run after any schema change:

```bash
cd tapasya-web && npx supabase gen types typescript --project-id utpbnnfnetxicduftjlw > src/lib/types/database.ts
```
