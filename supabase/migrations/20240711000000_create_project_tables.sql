-- Create project_status enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE public.project_status AS ENUM (
            'draft',
            'in_progress',
            'review',
            'approved',
            'completed',
            'archived'
        );
    END IF;
END
$$;

-- Create project_type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_type') THEN
        CREATE TYPE public.project_type AS ENUM (
            'website',
            'mobile_app',
            'branding',
            'marketing',
            'design',
            'development',
            'other'
        );
    END IF;
END
$$;

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    type project_type NOT NULL DEFAULT 'other',
    status project_status NOT NULL DEFAULT 'draft',
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

-- Add RLS policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Projects policies
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

-- Project members policies
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

-- Tasks policies
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

-- Project files policies
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
