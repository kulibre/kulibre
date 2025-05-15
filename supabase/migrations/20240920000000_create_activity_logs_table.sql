-- Create activity_logs table for tracking user activities
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'task_created', 'task_completed', 'project_updated', etc.
  entity_type TEXT NOT NULL, -- 'task', 'project', 'team_member', etc.
  entity_id UUID, -- ID of the related entity
  description TEXT NOT NULL, -- Human-readable description of the activity
  metadata JSONB, -- Additional data related to the activity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view all activity logs
CREATE POLICY "Users can view all activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to insert activity logs
CREATE POLICY "Authenticated users can create activity logs" 
  ON public.activity_logs FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Insert some sample activity logs
INSERT INTO public.activity_logs (user_id, action_type, entity_type, entity_id, description, metadata)
VALUES 
  ((SELECT id FROM auth.users LIMIT 1), 'task_created', 'task', (SELECT id FROM public.tasks LIMIT 1), 'Created task "Website Redesign"', '{"priority": "high", "project_name": "Marketing Campaign"}'),
  ((SELECT id FROM auth.users LIMIT 1), 'project_updated', 'project', (SELECT id FROM public.projects LIMIT 1), 'Updated project "Marketing Campaign"', '{"status": "in_progress", "previous_status": "planning"}'),
  ((SELECT id FROM auth.users LIMIT 1), 'task_completed', 'task', (SELECT id FROM public.tasks LIMIT 1), 'Completed task "Create wireframes"', '{"project_name": "Website Redesign"}'),
  ((SELECT id FROM auth.users LIMIT 1), 'team_member_added', 'team_member', (SELECT id FROM public.team_members LIMIT 1), 'Added Sarah Johnson to the team', '{"role": "designer"}'),
  ((SELECT id FROM auth.users LIMIT 1), 'comment_added', 'task', (SELECT id FROM public.tasks LIMIT 1), 'Commented on task "Create social media assets"', '{"comment": "Looking good! Just a few minor tweaks needed."}');
