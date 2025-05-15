-- SQL script to update the tasks table with missing columns

-- First, check if the tasks table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'tasks'
    ) THEN
        -- Create the tasks table if it doesn't exist
        CREATE TABLE public.tasks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
            due_date DATE,
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            status TEXT NOT NULL DEFAULT 'todo',
            priority TEXT NOT NULL DEFAULT 'medium',
            description TEXT
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
    ELSE
        -- Add status column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tasks'
            AND column_name = 'status'
        ) THEN
            ALTER TABLE public.tasks ADD COLUMN status TEXT NOT NULL DEFAULT 'todo';
        END IF;

        -- Add priority column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tasks'
            AND column_name = 'priority'
        ) THEN
            ALTER TABLE public.tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium';
        END IF;

        -- Add description column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tasks'
            AND column_name = 'description'
        ) THEN
            ALTER TABLE public.tasks ADD COLUMN description TEXT;
        END IF;
    END IF;
END $$;
