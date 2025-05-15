export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: string
          start_date: string
          end_date: string | null
          all_day: boolean
          project_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type?: string
          start_date: string
          end_date?: string | null
          all_day?: boolean
          project_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: string
          start_date?: string
          end_date?: string | null
          all_day?: boolean
          project_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      event_attendees: {
        Row: {
          event_id: string
          user_id: string
          role: string
          response: string
        }
        Insert: {
          event_id: string
          user_id: string
          role?: string
          response?: string
        }
        Update: {
          event_id?: string
          user_id?: string
          role?: string
          response?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          company: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          company: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          id: string
          name: string
          content_type: string
          size: number
          path: string
          user_id: string
          parent_folder_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content_type: string
          size: number
          path: string
          user_id: string
          parent_folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content_type?: string
          size?: number
          path?: string
          user_id?: string
          parent_folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      folders: {
        Row: {
          id: string
          name: string
          user_id: string
          parent_folder_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          parent_folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          parent_folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          website: string | null
          email: string | null
          updated_at: string | null
          role: string | null
          company: string | null
          created_at: string | null
          job_title: string | null
          department: string | null
          active: boolean | null
          bio: string | null
          notification_settings: Json | null
          appearance_settings: Json | null
          security_settings: Json | null
        }
        Insert: {
          id: string
          full_name?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          updated_at?: string | null
          role?: string | null
          company?: string | null
          created_at?: string | null
          job_title?: string | null
          department?: string | null
          active?: boolean | null
          bio?: string | null
          notification_settings?: Json | null
          appearance_settings?: Json | null
          security_settings?: Json | null
        }
        Update: {
          id?: string
          full_name?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          updated_at?: string | null
          role?: string | null
          company?: string | null
          created_at?: string | null
          job_title?: string | null
          department?: string | null
          active?: boolean | null
          bio?: string | null
          notification_settings?: Json | null
          appearance_settings?: Json | null
          security_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_members: {
        Row: {
          id: string
          full_name: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          email: string | null
          role: string | null
          job_title: string | null
          department: string | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          full_name?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email?: string | null
          role?: string | null
          job_title?: string | null
          department?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email?: string | null
          role?: string | null
          job_title?: string | null
          department?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          uploaded_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      project_members: {
        Row: {
          project_id: string
          user_id: string
          role: string
          assigned_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          role?: string
          assigned_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          role?: string
          assigned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          client_id: string | null
          type: string
          status: string
          start_date: string | null
          due_date: string | null
          budget: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          client_id?: string | null
          type?: string
          status?: string
          start_date?: string | null
          due_date?: string | null
          budget?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          client_id?: string | null
          type?: string
          status?: string
          start_date?: string | null
          due_date?: string | null
          budget?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          price_id: string
          quantity: number
          cancel_at_period_end: boolean
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
        }
        Insert: {
          id: string
          user_id: string
          status: string
          price_id: string
          quantity: number
          cancel_at_period_end: boolean
          created: string
          current_period_start: string
          current_period_end: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          price_id?: string
          quantity?: number
          cancel_at_period_end?: boolean
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          project_id: string
          status: string
          priority: string
          assigned_to: string | null
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          project_id: string
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          project_id?: string
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      user_tasks: {
        Row: {
          id: string
          user_id: string
          task_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_invitations: {
        Row: {
          id: string
          email: string
          role: string
          user_id: string | null
          token: string
          created_at: string
          expires_at: string | null
          accepted_at: string | null
        }
        Insert: {
          id?: string
          email: string
          role?: string
          user_id?: string | null
          token: string
          created_at?: string
          expires_at?: string | null
          accepted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          user_id?: string | null
          token?: string
          created_at?: string
          expires_at?: string | null
          accepted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      time_entries: {
        Row: {
          id: string
          user_id: string
          project_id: string
          task_id: string | null
          description: string | null
          start_time: string
          end_time: string | null
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          task_id?: string | null
          description?: string | null
          start_time: string
          end_time?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          task_id?: string | null
          description?: string | null
          start_time?: string
          end_time?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]