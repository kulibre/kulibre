-- Project Spark Agency Database Setup
-- Run this script in the Supabase SQL Editor to set up all project-related tables

-- Create profiles table if it doesn't exist (for user profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  job_title TEXT,
  department TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  company TEXT,
  address TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'draft',
  start_date DATE,
  due_date DATE,
  budget DECIMAL(12,2),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table
CREATE TABLE IF NOT EXISTS public.project_members (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_files table
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for clients
CREATE POLICY "Users can view clients they created" 
  ON public.clients FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert clients" 
  ON public.clients FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update clients they created" 
  ON public.clients FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete clients they created" 
  ON public.clients FOR DELETE 
  USING (created_by = auth.uid());

-- Create RLS policies for projects
CREATE POLICY "Users can view projects they are members of" 
  ON public.projects FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.project_members WHERE project_id = id
    ) OR 
    auth.uid() = created_by
  );

CREATE POLICY "Users can insert projects" 
  ON public.projects FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update projects they created" 
  ON public.projects FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete projects they created" 
  ON public.projects FOR DELETE 
  USING (auth.uid() = created_by);

-- Create RLS policies for project_members
CREATE POLICY "Users can view project members for their projects" 
  ON public.project_members FOR SELECT 
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    ) OR 
    user_id = auth.uid()
  );

CREATE POLICY "Project creators can insert project members" 
  ON public.project_members FOR INSERT 
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Project creators can update project members" 
  ON public.project_members FOR UPDATE 
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Project creators can delete project members" 
  ON public.project_members FOR DELETE 
  USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

-- Create RLS policies for project_milestones
CREATE POLICY "Users can view milestones for their projects" 
  ON public.project_milestones FOR SELECT 
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert milestones for their projects" 
  ON public.project_milestones FOR INSERT 
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update milestones for their projects" 
  ON public.project_milestones FOR UPDATE 
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete milestones for their projects" 
  ON public.project_milestones FOR DELETE 
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks for their projects" 
  ON public.tasks FOR SELECT 
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert tasks for their projects" 
  ON public.tasks FOR INSERT 
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks for their projects" 
  ON public.tasks FOR UPDATE 
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks for their projects" 
  ON public.tasks FOR DELETE 
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

-- Create RLS policies for project_files
CREATE POLICY "Users can view files for their projects" 
  ON public.project_files FOR SELECT 
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert files for their projects" 
  ON public.project_files FOR INSERT 
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.project_members 
      WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update files they uploaded" 
  ON public.project_files FOR UPDATE 
  USING (
    uploaded_by = auth.uid() OR
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete files they uploaded" 
  ON public.project_files FOR DELETE 
  USING (
    uploaded_by = auth.uid() OR
    project_id IN (
      SELECT id FROM public.projects 
      WHERE created_by = auth.uid()
    )
  );

-- Insert sample data for testing
-- First, create a profile for the current user if it doesn't exist
INSERT INTO public.profiles (id, full_name, email)
SELECT 
  auth.uid(), 
  COALESCE((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = auth.uid()), 'Demo User'),
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE 
  NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid());

-- Insert a sample client
INSERT INTO public.clients (name, contact_name, contact_email, company, created_by)
VALUES (
  'Acme Corporation', 
  'John Doe', 
  'john@acmecorp.com', 
  'Acme Corp', 
  auth.uid()
)
ON CONFLICT DO NOTHING;

-- Get the client ID
DO $$
DECLARE
  client_id UUID;
BEGIN
  SELECT id INTO client_id FROM public.clients WHERE name = 'Acme Corporation' LIMIT 1;
  
  -- Insert sample projects
  INSERT INTO public.projects (name, description, client_id, type, status, start_date, due_date, created_by)
  VALUES 
    ('Website Redesign', 'Complete redesign of the corporate website with modern UI/UX', client_id, 'website', 'in_progress', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', auth.uid()),
    ('Mobile App Development', 'Create a new customer loyalty mobile application', client_id, 'mobile_app', 'draft', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '60 days', auth.uid()),
    ('Brand Identity Update', 'Refresh the company brand identity and design guidelines', client_id, 'branding', 'review', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '10 days', auth.uid())
  ON CONFLICT DO NOTHING;
  
  -- Add the current user as a member of each project
  INSERT INTO public.project_members (project_id, user_id, role)
  SELECT id, auth.uid(), 'owner'
  FROM public.projects
  WHERE created_by = auth.uid()
  ON CONFLICT DO NOTHING;
  
  -- Add milestones to the first project
  INSERT INTO public.project_milestones (project_id, title, description, due_date, completed, created_by)
  SELECT 
    id,
    'Project Kickoff',
    'Initial planning and requirements gathering',
    start_date + INTERVAL '3 days',
    TRUE,
    created_by
  FROM public.projects
  WHERE name = 'Website Redesign' AND created_by = auth.uid()
  LIMIT 1
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.project_milestones (project_id, title, description, due_date, completed, created_by)
  SELECT 
    id,
    'Design Approval',
    'Client approval of website designs',
    start_date + INTERVAL '10 days',
    FALSE,
    created_by
  FROM public.projects
  WHERE name = 'Website Redesign' AND created_by = auth.uid()
  LIMIT 1
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.project_milestones (project_id, title, description, due_date, completed, created_by)
  SELECT 
    id,
    'Development Complete',
    'All development work completed and ready for testing',
    due_date - INTERVAL '7 days',
    FALSE,
    created_by
  FROM public.projects
  WHERE name = 'Website Redesign' AND created_by = auth.uid()
  LIMIT 1
  ON CONFLICT DO NOTHING;
  
  -- Add tasks to the first project
  INSERT INTO public.tasks (title, description, project_id, status, priority, assigned_to, due_date)
  SELECT 
    'Create wireframes',
    'Design initial wireframes for homepage and key sections',
    id,
    'completed',
    'high',
    auth.uid(),
    start_date + INTERVAL '5 days'
  FROM public.projects
  WHERE name = 'Website Redesign' AND created_by = auth.uid()
  LIMIT 1
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.tasks (title, description, project_id, status, priority, assigned_to, due_date)
  SELECT 
    'Develop homepage',
    'Code the homepage based on approved designs',
    id,
    'in_progress',
    'high',
    auth.uid(),
    start_date + INTERVAL '15 days'
  FROM public.projects
  WHERE name = 'Website Redesign' AND created_by = auth.uid()
  LIMIT 1
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.tasks (title, description, project_id, status, priority, assigned_to, due_date)
  SELECT 
    'Content migration',
    'Move content from old site to new site structure',
    id,
    'todo',
    'medium',
    auth.uid(),
    due_date - INTERVAL '10 days'
  FROM public.projects
  WHERE name = 'Website Redesign' AND created_by = auth.uid()
  LIMIT 1
  ON CONFLICT DO NOTHING;
END $$;