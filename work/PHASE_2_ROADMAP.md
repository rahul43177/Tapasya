# Phase 2 Roadmap (Retention & Engagement)

Purpose: add the retention mechanics that make users come back daily. Phase 2 builds on the working Phase 1 core loop and layers in streaks, milestones, heatmap, pomodoro timer, and session history.

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

## Phase 2 Goals
- Streak system live (daily streak tracked per-skill and globally)
- Milestone badges awarded at key hour thresholds
- GitHub-style heatmap visible on dashboard
- Pomodoro timer mode (25/50/90 min presets)
- Skill editing page (edit name, icon, color, target hours, daily goal)
- Session history page (view all past sessions)

---

## Task 2.1: Pomodoro Timer Mode
Owner: Claude (agent implemented)
Dependencies: Focus timer (Phase 1 done)

2.1.1 Add mode toggle (Stopwatch | Pomodoro)
- [x] UI toggle rendered above timer display ✅
- [x] Mode state: 'stopwatch' | 'pomodoro' ✅

2.1.2 Pomodoro preset selector
- [x] Three presets: 25 min, 50 min, 90 min ✅
- [x] Preset selector only visible in pomodoro mode ✅
- [x] Default preset: 25 min ✅

2.1.3 Countdown timer logic
- [x] Timer counts down from selected duration ✅
- [x] remainingSeconds state initialized from preset on start ✅
- [x] Ticks down every second via setInterval ✅

2.1.4 Session complete state
- [x] When countdown hits 0: auto-pause ✅
- [x] Show "Session complete!" banner ✅
- [x] Proceed to save/rating flow ✅

2.1.5 Save pomodoro session
- [x] type: 'pomodoro' recorded in focus_sessions ✅
- [x] duration = preset minutes ✅

Acceptance checks
- [x] Mode toggle switches between stopwatch and pomodoro ✅
- [x] Countdown works and stops at 0:00 ✅
- [x] Session saves correctly with type='pomodoro' ✅
- [x] Stopwatch mode unaffected ✅

## ✅ TASK 2.1 COMPLETE

---

## Task 2.2: Skill Edit Page
Owner: Claude (agent implemented)
Dependencies: Skills list page (Phase 1 done)

2.2.1 Create server route /skills/[id]/page.tsx
- [x] Fetch skill by ID with user_id ownership check ✅
- [x] Redirect to /skills if not found ✅
- [x] Render EditSkillForm client component ✅

2.2.2 Build EditSkillForm client component
- [x] react-hook-form + zod validation ✅
- [x] Edit: name, icon, color, target_hours, daily_goal_minutes ✅
- [x] Same emoji grid + color picker as create form ✅
- [x] Save → update in supabase, redirect to /skills ✅
- [x] Archive button → set is_active=false, redirect to /skills ✅

Acceptance checks
- [x] Edit link in skills-list navigates to /skills/[id] ✅
- [x] Form pre-populates with current skill values ✅
- [x] Save updates skill and redirects ✅
- [x] Archive removes skill from list ✅
- [x] TypeScript clean ✅

## ✅ TASK 2.2 COMPLETE

---

## Task 2.3: Activity Heatmap (Dashboard)
Owner: Claude (agent implemented)
Dependencies: Dashboard (Phase 1 done), focus_sessions table

2.3.1 Create Heatmap component
- [x] GitHub-style grid: 52 weeks × 7 days ✅
- [x] Each cell = 1 day ✅
- [x] Colors: 4 intensity levels ✅
  - 0 sessions: #353434 (surface-container-highest)
  - 1–29 min: #7a3200 (dim copper)
  - 30–119 min: #b54d00 (mid copper)
  - 120+ min: #E05C00 (brand copper, full intensity)
- [x] Tooltip on hover: date + minutes ✅
- [x] Accepts pre-aggregated data as props ✅

2.3.2 Server-side data fetch
- [x] Query focus_sessions for last 365 days grouped by date ✅
- [x] Pass aggregated data to Heatmap component ✅

2.3.3 Integrate into dashboard
- [x] Add Heatmap section after stats section ✅
- [x] Month labels above columns ✅

Acceptance checks
- [ ] Heatmap renders on dashboard — test in browser
- [ ] Days with sessions show copper shading — test in browser
- [ ] Tooltip shows correct date + minutes on hover — test in browser
- [ ] No TypeScript errors ✅

## ✅ TASK 2.3 COMPLETE

---

## Task 2.4: Streak System
Owner: You
Dependencies: focus_sessions table, profiles table (current_global_streak, longest_streak already in schema)

2.4.1 Streak calculation logic
- [ ] Calculate current streak: count consecutive days with ≥30 min practice going back from today
- [ ] Calculate longest streak: all-time high
- [ ] Minimum 30 min/day to count as a practice day

2.4.2 Per-skill streak (skills table already has current_streak, longest_streak)
- [ ] Update current_streak on session save
- [ ] Update longest_streak if current_streak > longest_streak
- [ ] Reset current_streak to 0 if no session yesterday

2.4.3 Global streak (profiles.current_global_streak)
- [ ] Calculate from any-skill practice across all skills
- [ ] Update after each session save
- [ ] Update profiles.longest_streak if exceeded

2.4.4 Streak display
- [ ] Dashboard hero section shows streak badge (already shows profile streak)
- [ ] Per-skill streak shown on skills cards (already shown)
- [ ] Streak at risk warning (if no practice today and streak > 0)

Acceptance checks
- [ ] Streak increments after a session is saved
- [ ] Streak resets on missed day
- [ ] Longest streak preserved correctly
- [ ] At-risk warning shows when streak is in danger

---

## Task 2.5: Milestones (Hour Badges)
Owner: You
Dependencies: Streak system, skills table

2.5.1 Define milestone thresholds
- [ ] Milestones: 20h, 50h, 100h, 200h, 500h, 1000h, 5000h, 10000h
- [ ] Each milestone has: name, description, icon, hours_required

2.5.2 Milestone check on session save
- [ ] After saving session, check if any milestone crossed
- [ ] Compare old total_hours vs new total_hours
- [ ] If a threshold is crossed, trigger milestone event

2.5.3 Milestone display (in-app notification)
- [ ] Show milestone modal/toast when unlocked
- [ ] "You've reached 100 hours in Piano!" with level name
- [ ] Dismissable banner, doesn't block UI

2.5.4 Milestone history (optional on skill detail)
- [ ] List of milestones achieved per skill
- [ ] Date achieved

Acceptance checks
- [ ] Milestone fires correctly when hours threshold crossed
- [ ] Modal/toast appears after session save
- [ ] No duplicate milestone awards
- [ ] All 8 thresholds work

---

## Task 2.6: Session History Page
Owner: You
Dependencies: focus_sessions table

2.6.1 Create /sessions route
- [ ] Route: app/(dashboard)/sessions/page.tsx
- [ ] Server component: fetch all sessions for user, ordered by start_time desc
- [ ] Join with skills table for name + icon

2.6.2 Session list UI
- [ ] Each row: skill icon+name, date, duration, focus_rating, notes
- [ ] Pagination or infinite scroll (limit 20 per page)
- [ ] Filter by skill (dropdown)
- [ ] Digital Temple design: same dark surfaces, zero radius

2.6.3 Add link to sessions from dashboard + nav
- [ ] "View all sessions" link on recent sessions widget
- [ ] Optional: add Sessions to sidebar nav

Acceptance checks
- [ ] All sessions load correctly
- [ ] Filter by skill works
- [ ] Pagination/scroll works
- [ ] Session notes visible

---

## Phase 2 Deliverables Summary

Must-haves before calling Phase 2 complete:
- [ ] Pomodoro timer mode works end to end
- [ ] Skill editing page works
- [ ] Heatmap visible on dashboard
- [ ] Streak system updating on session save
- [ ] Milestone alerts triggering correctly
- [ ] Session history page accessible

**Phase 2 Complete**: ☐
**Completion Date**: ___________

## Progress Notes
- Date:
- Notes:
- Blockers:
