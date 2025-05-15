-- Create user_tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for user_tasks
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

-- User tasks policies
CREATE POLICY "Users can view their own task assignments" 
  ON public.user_tasks FOR SELECT 
  USING (
    user_id = auth.uid() OR
    task_id IN (
      SELECT id FROM public.tasks
      WHERE project_id IN (
        SELECT project_id FROM public.project_members 
        WHERE user_id = auth.uid()
      ) OR 
      project_id IN (
        SELECT id FROM public.projects 
        WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert task assignments for their projects" 
  ON public.user_tasks FOR INSERT 
  WITH CHECK (
    task_id IN (
      SELECT id FROM public.tasks
      WHERE project_id IN (
        SELECT project_id FROM public.project_members 
        WHERE user_id = auth.uid()
      ) OR 
      project_id IN (
        SELECT id FROM public.projects 
        WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete task assignments for their projects" 
  ON public.user_tasks FOR DELETE 
  USING (
    task_id IN (
      SELECT id FROM public.tasks
      WHERE project_id IN (
        SELECT project_id FROM public.project_members 
        WHERE user_id = auth.uid()
      ) OR 
      project_id IN (
        SELECT id FROM public.projects 
        WHERE created_by = auth.uid()
      )
    )
  );
