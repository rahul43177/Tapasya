export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      focus_sessions: {
        Row: {
          created_at: string
          duration: number
          end_time: string
          focus_rating: number | null
          id: string
          notes: string | null
          skill_id: string
          start_time: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration: number
          end_time: string
          focus_rating?: number | null
          id?: string
          notes?: string | null
          skill_id: string
          start_time: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number
          end_time?: string
          focus_rating?: number | null
          id?: string
          notes?: string | null
          skill_id?: string
          start_time?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "focus_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_global_streak: number
          daily_goal_minutes: number
          daily_reminder_time: string | null
          default_break_minutes: number
          default_pomodoro_minutes: number
          default_timer_mode: string
          full_name: string | null
          id: string
          last_active_at: string
          longest_streak: number
          notifications_enabled: boolean
          streak_risk_alerts: boolean
          timezone: string
          total_hours: number
          total_sessions: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_global_streak?: number
          daily_goal_minutes?: number
          daily_reminder_time?: string | null
          default_break_minutes?: number
          default_pomodoro_minutes?: number
          default_timer_mode?: string
          full_name?: string | null
          id: string
          last_active_at?: string
          longest_streak?: number
          notifications_enabled?: boolean
          streak_risk_alerts?: boolean
          timezone?: string
          total_hours?: number
          total_sessions?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_global_streak?: number
          daily_goal_minutes?: number
          daily_reminder_time?: string | null
          default_break_minutes?: number
          default_pomodoro_minutes?: number
          default_timer_mode?: string
          full_name?: string | null
          id?: string
          last_active_at?: string
          longest_streak?: number
          notifications_enabled?: boolean
          streak_risk_alerts?: boolean
          timezone?: string
          total_hours?: number
          total_sessions?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          color: string
          created_at: string
          current_streak: number
          daily_goal_minutes: number | null
          description: string | null
          icon: string
          id: string
          is_active: boolean
          last_practice_date: string | null
          longest_streak: number
          name: string
          order: number
          target_hours: number
          total_hours: number
          total_minutes: number
          total_sessions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          current_streak?: number
          daily_goal_minutes?: number | null
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          last_practice_date?: string | null
          longest_streak?: number
          name: string
          order?: number
          target_hours?: number
          total_hours?: number
          total_minutes?: number
          total_sessions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          current_streak?: number
          daily_goal_minutes?: number | null
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          last_practice_date?: string | null
          longest_streak?: number
          name?: string
          order?: number
          target_hours?: number
          total_hours?: number
          total_minutes?: number
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
