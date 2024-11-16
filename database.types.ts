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
      department: {
        Row: {
          created_at: string
          id: string
          manager: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          manager?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          manager?: string | null
          name?: string
        }
        Relationships: []
      }
      project: {
        Row: {
          created_at: string
          deadline: string | null
          department: string
          description: string | null
          end_date: string | null
          id: string
          leader: string | null
          priority: Database["public"]["Enums"]["project_priority"]
          progress: number
          started_at: string | null
          tasks: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          department: string
          description?: string | null
          end_date?: string | null
          id?: string
          leader?: string | null
          priority?: Database["public"]["Enums"]["project_priority"]
          progress?: number
          started_at?: string | null
          tasks?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          department?: string
          description?: string | null
          end_date?: string | null
          id?: string
          leader?: string | null
          priority?: Database["public"]["Enums"]["project_priority"]
          progress?: number
          started_at?: string | null
          tasks?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_department_fkey"
            columns: ["department"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          id: string | null
          project_id: string
          role_in_project: string | null
          user_id: string | null
        }
        Insert: {
          id?: string | null
          project_id: string
          role_in_project?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string | null
          project_id?: string
          role_in_project?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string[] | null
          created_at: string
          description: string
          id: string
          project: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
        }
        Insert: {
          assigned_to?: string[] | null
          created_at?: string
          description: string
          id?: string
          project?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
        }
        Update: {
          assigned_to?: string[] | null
          created_at?: string
          description?: string
          id?: string
          project?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          department_id: string[] | null
          email: string | null
          employeeType: Database["public"]["Enums"]["employeeType"] | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          profile_base64_img: string | null
          profile_picture_path: string | null
          role: Database["public"]["Enums"]["role"] | null
        }
        Insert: {
          department_id?: string[] | null
          email?: string | null
          employeeType?: Database["public"]["Enums"]["employeeType"] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          profile_base64_img?: string | null
          profile_picture_path?: string | null
          role?: Database["public"]["Enums"]["role"] | null
        }
        Update: {
          department_id?: string[] | null
          email?: string | null
          employeeType?: Database["public"]["Enums"]["employeeType"] | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_base64_img?: string | null
          profile_picture_path?: string | null
          role?: Database["public"]["Enums"]["role"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employeeType:
        | "frontend-developer"
        | "backend-developer"
        | "leader"
        | "unset"
      project_priority: "low" | "medium" | "high"
      role: "user" | "admin"
      task_status: "not-started" | "under-development" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
