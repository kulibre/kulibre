-- Check if the project_members table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'project_members'
);

-- If the project_members table doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'project_members'
  ) THEN
    CREATE TABLE public.project_members (
      project_id UUID NOT NULL,
      user_id UUID NOT NULL,
      role TEXT NOT NULL,
      assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      PRIMARY KEY (project_id, user_id),
      CONSTRAINT project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
      CONSTRAINT project_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
    );
    
    -- Enable RLS
    ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    CREATE POLICY "Allow all authenticated users to view project members" 
      ON public.project_members FOR SELECT 
      TO authenticated
      USING (true);
      
    CREATE POLICY "Project members can insert project members" 
      ON public.project_members FOR INSERT 
      TO authenticated
      WITH CHECK (
        project_id IN (
          SELECT project_id FROM public.project_members 
          WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
      );
      
    CREATE POLICY "Project members can update project members" 
      ON public.project_members FOR UPDATE 
      TO authenticated
      USING (
        project_id IN (
          SELECT project_id FROM public.project_members 
          WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
      );
      
    CREATE POLICY "Project members can delete project members" 
      ON public.project_members FOR DELETE 
      TO authenticated
      USING (
        project_id IN (
          SELECT project_id FROM public.project_members 
          WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
      );
  END IF;
END
$$;

-- Check if the foreign key relationship exists
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE 
  tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'project_members'
  AND kcu.column_name = 'user_id'
  AND ccu.table_name = 'profiles';

-- If the foreign key relationship doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 
      tc.constraint_name
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE 
      tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name = 'project_members'
      AND kcu.column_name = 'user_id'
      AND ccu.table_name = 'profiles'
  ) THEN
    -- Drop the existing foreign key if it exists
    BEGIN
      ALTER TABLE public.project_members DROP CONSTRAINT IF EXISTS project_members_user_id_fkey;
    EXCEPTION
      WHEN others THEN
        NULL;
    END;
    
    -- Add the new foreign key
    ALTER TABLE public.project_members 
      ADD CONSTRAINT project_members_user_id_fkey 
      FOREIGN KEY (user_id) 
      REFERENCES public.profiles(id) 
      ON DELETE CASCADE;
  END IF;
END
$$;

-- Insert some demo data into project_members if it's empty
INSERT INTO public.project_members (project_id, user_id, role)
SELECT 
  p.id, 
  pr.id, 
  'member'
FROM 
  public.projects p
  CROSS JOIN public.profiles pr
WHERE 
  NOT EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = p.id AND user_id = pr.id
  )
LIMIT 5;

-- Check the data in the project_members table
SELECT * FROM public.project_members LIMIT 10;