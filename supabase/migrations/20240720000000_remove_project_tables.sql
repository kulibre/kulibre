-- Drop project-related tables and references
-- First drop tables with foreign key references to projects

-- Drop project_files table
DROP TABLE IF EXISTS public.project_files;

-- Drop project_members table
DROP TABLE IF EXISTS public.project_members;

-- Drop project_milestones table
DROP TABLE IF EXISTS public.project_milestones;

-- Remove project_id foreign key from tasks table
ALTER TABLE IF EXISTS public.tasks
  DROP CONSTRAINT IF EXISTS tasks_project_id_fkey,
  DROP COLUMN IF EXISTS project_id;

-- Finally drop the projects table
DROP TABLE IF EXISTS public.projects;

-- Drop project-related enums
DROP TYPE IF EXISTS public.project_status;
DROP TYPE IF EXISTS public.project_type;