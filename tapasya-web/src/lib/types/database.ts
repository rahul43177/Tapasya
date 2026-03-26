// ============================================================
// DATABASE TYPES — matches schema in MASTER_PLAN.md
// This file is a hand-written placeholder.
// Replace with auto-generated types by running:
//   npx supabase gen types typescript --project-id <ref> > src/lib/types/database.ts
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          timezone: string
          daily_goal_minutes: number
          default_timer_mode: 'stopwatch' | 'pomodoro'
          default_pomodoro_minutes: number
          default_break_minutes: number
          notifications_enabled: boolean
          daily_reminder_time: string | null
          streak_risk_alerts: boolean
          total_hours: number
          total_sessions: number
          longest_streak: number
          current_global_streak: number
          created_at: string
          updated_at: string
          last_active_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          daily_goal_minutes?: number
          default_timer_mode?: 'stopwatch' | 'pomodoro'
          default_pomodoro_minutes?: number
          default_break_minutes?: number
          notifications_enabled?: boolean
          daily_reminder_time?: string | null
          streak_risk_alerts?: boolean
          total_hours?: number
          total_sessions?: number
          longest_streak?: number
          current_global_streak?: number
          created_at?: string
          updated_at?: string
          last_active_at?: string
        }
        Update: {
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          daily_goal_minutes?: number
          default_timer_mode?: 'stopwatch' | 'pomodoro'
          default_pomodoro_minutes?: number
          default_break_minutes?: number
          notifications_enabled?: boolean
          daily_reminder_time?: string | null
          streak_risk_alerts?: boolean
          total_hours?: number
          total_sessions?: number
          longest_streak?: number
          current_global_streak?: number
          updated_at?: string
          last_active_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          color: string
          description: string | null
          target_hours: number
          daily_goal_minutes: number | null
          total_hours: number
          total_minutes: number
          total_sessions: number
          current_streak: number
          longest_streak: number
          last_practice_date: string | null
          order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string
          color?: string
          description?: string | null
          target_hours?: number
          daily_goal_minutes?: number | null
          total_hours?: number
          total_minutes?: number
          total_sessions?: number
          current_streak?: number
          longest_streak?: number
          last_practice_date?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          icon?: string
          color?: string
          description?: string | null
          target_hours?: number
          daily_goal_minutes?: number | null
          total_hours?: number
          total_minutes?: number
          total_sessions?: number
          current_streak?: number
          longest_streak?: number
          last_practice_date?: string | null
          order?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          type: 'stopwatch' | 'pomodoro'
          duration: number
          start_time: string
          end_time: string
          focus_rating: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          type: 'stopwatch' | 'pomodoro'
          duration: number
          start_time: string
          end_time: string
          focus_rating?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          focus_rating?: number | null
          notes?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
