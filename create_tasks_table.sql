-- SQL script to create the tasks table with all necessary columns

-- Drop the table if it exists
DROP TABLE IF EXISTS public.tasks CASCADE;

-- Create the tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'todo',
    priority TEXT NOT NULL DEFAULT 'medium'
);

-- Add RLS policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
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
