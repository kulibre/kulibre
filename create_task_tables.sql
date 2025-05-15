-- SQL script to create both tasks and user_tasks tables with minimal columns

-- Drop the tables if they exist
DROP TABLE IF EXISTS public.user_tasks CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;

-- Create the tasks table with only essential columns
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
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

-- Create user_tasks table
CREATE TABLE public.user_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for user_tasks
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for user_tasks
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
