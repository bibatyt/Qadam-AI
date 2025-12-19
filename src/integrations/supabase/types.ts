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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_quests: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          quest_date: string
          quest_title: string
          user_id: string
          xp_reward: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          quest_date?: string
          quest_title: string
          user_id: string
          xp_reward?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          quest_date?: string
          quest_title?: string
          user_id?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      email_verification_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      parent_link_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          student_id: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          student_id: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          student_id?: string
          used?: boolean
        }
        Relationships: []
      }
      path_milestones: {
        Row: {
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          efc_specific: boolean
          id: string
          metadata: Json | null
          order_index: number
          priority: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          efc_specific?: boolean
          id?: string
          metadata?: Json | null
          order_index?: number
          priority?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          efc_specific?: boolean
          id?: string
          metadata?: Json | null
          order_index?: number
          priority?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          ielts_score: number | null
          language: string | null
          last_active_date: string | null
          level: number | null
          name: string | null
          sat_score: number | null
          streak: number | null
          target_university: string | null
          updated_at: string
          user_id: string
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          ielts_score?: number | null
          language?: string | null
          last_active_date?: string | null
          level?: number | null
          name?: string | null
          sat_score?: number | null
          streak?: number | null
          target_university?: string | null
          updated_at?: string
          user_id: string
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          ielts_score?: number | null
          language?: string | null
          last_active_date?: string | null
          level?: number | null
          name?: string | null
          sat_score?: number | null
          streak?: number | null
          target_university?: string | null
          updated_at?: string
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          month: string
          month_index: number
          roadmap_id: string
          task_description: string | null
          task_title: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          month: string
          month_index: number
          roadmap_id: string
          task_description?: string | null
          task_title: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          month?: string
          month_index?: number
          roadmap_id?: string
          task_description?: string | null
          task_title?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tasks_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string
          current_grade: string
          desired_major: string
          generated_plan: Json | null
          gpa: number | null
          id: string
          ielts_score: number | null
          main_goal: string
          sat_score: number | null
          target_country: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_grade: string
          desired_major: string
          generated_plan?: Json | null
          gpa?: number | null
          id?: string
          ielts_score?: number | null
          main_goal: string
          sat_score?: number | null
          target_country: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_grade?: string
          desired_major?: string
          generated_plan?: Json | null
          gpa?: number | null
          id?: string
          ielts_score?: number | null
          main_goal?: string
          sat_score?: number | null
          target_country?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_paths: {
        Row: {
          ai_recommendations: Json | null
          ai_warnings: Json | null
          created_at: string
          current_stage: string | null
          exams: string[]
          expected_progress_percent: number | null
          goal: string
          grade: string
          id: string
          milestones: Json
          progress_percent: number
          specific_goal: string | null
          target_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_recommendations?: Json | null
          ai_warnings?: Json | null
          created_at?: string
          current_stage?: string | null
          exams?: string[]
          expected_progress_percent?: number | null
          goal: string
          grade: string
          id?: string
          milestones?: Json
          progress_percent?: number
          specific_goal?: string | null
          target_year: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_recommendations?: Json | null
          ai_warnings?: Json | null
          created_at?: string
          current_stage?: string | null
          exams?: string[]
          expected_progress_percent?: number | null
          goal?: string
          grade?: string
          id?: string
          milestones?: Json
          progress_percent?: number
          specific_goal?: string | null
          target_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          country: string
          created_at: string
          efc_segment: string
          gpa_range: string | null
          id: string
          image_url: string | null
          name: string
          residence_country: string | null
          scholarship_amount: string | null
          story: string
          university: string
        }
        Insert: {
          country: string
          created_at?: string
          efc_segment: string
          gpa_range?: string | null
          id?: string
          image_url?: string | null
          name: string
          residence_country?: string | null
          scholarship_amount?: string | null
          story: string
          university: string
        }
        Update: {
          country?: string
          created_at?: string
          efc_segment?: string
          gpa_range?: string | null
          id?: string
          image_url?: string | null
          name?: string
          residence_country?: string | null
          scholarship_amount?: string | null
          story?: string
          university?: string
        }
        Relationships: []
      }
      university_recommendations: {
        Row: {
          country: string
          created_at: string
          financial_aid_available: boolean
          id: string
          match_score: number
          reason: string | null
          scholarship_type: string | null
          university_id: string | null
          university_name: string
          user_id: string
        }
        Insert: {
          country: string
          created_at?: string
          financial_aid_available?: boolean
          id?: string
          match_score?: number
          reason?: string | null
          scholarship_type?: string | null
          university_id?: string | null
          university_name: string
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string
          financial_aid_available?: boolean
          id?: string
          match_score?: number
          reason?: string | null
          scholarship_type?: string | null
          university_id?: string | null
          university_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_efc_data: {
        Row: {
          budget_range: string
          created_at: string
          efc_segment: string
          id: string
          income_range: string
          residence_country: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range: string
          created_at?: string
          efc_segment: string
          id?: string
          income_range: string
          residence_country: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string
          created_at?: string
          efc_segment?: string
          id?: string
          income_range?: string
          residence_country?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          linked_student_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          linked_student_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          linked_student_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      verify_and_use_parent_link_code: {
        Args: { _code: string; _parent_user_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "student" | "parent"
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
    Enums: {
      app_role: ["student", "parent"],
    },
  },
} as const
