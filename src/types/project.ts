export interface ProjectType {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  team_members: Array<{
    id: string;
    full_name: string;
    avatar_url?: string | null;
    role: string;
  }>;
  client?: {
    id: string;
    name: string;
  } | null;
  client_id?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  budget?: number | string | null;
  created_at?: string;
  updated_at?: string;
} 