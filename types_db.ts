export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          created_at: string | null
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
      }
    }
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          company_name: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          has_completed_profile: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          company_name?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          has_completed_profile?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company_name?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          has_completed_profile?: boolean | null
          updated_at?: string | null
        }
      }
      company_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          industry: string | null
          size: string | null
          instagram_username: string | null
          target_audience: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          industry?: string | null
          size?: string | null
          instagram_username?: string | null
          target_audience?: string | null
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          industry?: string | null
          size?: string | null
          instagram_username?: string | null
          target_audience?: string | null
          description?: string | null
          updated_at?: string | null
        }
      }
      app_calendar: {
        Row: {
          id: number
          title: string
          description: string | null
          post_type: string | null
          date: string | null
          engagement_estimate: string | null
          hashtags: string[] | null
          created_at: string | null
          user_id: string | null
          theme: string | null
          engagement_level: string | null
          instructions: string | null
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          post_type?: string | null
          date?: string | null
          engagement_estimate?: string | null
          hashtags?: string[] | null
          created_at?: string | null
          user_id?: string | null
          theme?: string | null
          engagement_level?: string | null
          instructions?: string | null
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          post_type?: string | null
          date?: string | null
          engagement_estimate?: string | null
          hashtags?: string[] | null
          created_at?: string | null
          user_id?: string | null
          theme?: string | null
          engagement_level?: string | null
          instructions?: string | null
        }
      }
    }
  }
} 