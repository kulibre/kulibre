-- Create a new team_members table without the foreign key constraint
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  job_title TEXT,
  department TEXT,
  email TEXT,
  role TEXT DEFAULT 'member',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for team_members
CREATE POLICY "Users can view all team members" 
  ON public.team_members FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create team members" 
  ON public.team_members FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update team members" 
  ON public.team_members FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete team members" 
  ON public.team_members FOR DELETE 
  TO authenticated
  USING (true);

-- Enable Row Level Security on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Copy existing profiles to team_members
INSERT INTO public.team_members (
  id, full_name, first_name, last_name, avatar_url, 
  job_title, department, email, role, active, 
  created_at, updated_at
)
SELECT 
  id, full_name, first_name, last_name, avatar_url, 
  job_title, department, email, role, active, 
  created_at, updated_at
FROM 
  public.profiles
ON CONFLICT (id) DO NOTHING;
