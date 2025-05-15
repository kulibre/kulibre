-- Check if the teams table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'teams'
);

-- Check if the team_members table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'team_members'
);

-- Check the structure of the teams table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' 
  AND table_name = 'teams'
ORDER BY ordinal_position;

-- Check the structure of the team_members table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' 
  AND table_name = 'team_members'
ORDER BY ordinal_position;

-- Check if RLS is enabled on the teams table
SELECT 
  tablename, 
  rowsecurity 
FROM 
  pg_tables 
WHERE 
  schemaname = 'public' 
  AND tablename = 'teams';

-- Check if RLS is enabled on the team_members table
SELECT 
  tablename, 
  rowsecurity 
FROM 
  pg_tables 
WHERE 
  schemaname = 'public' 
  AND tablename = 'team_members';

-- List all RLS policies for the teams table
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM 
  pg_policies 
WHERE 
  schemaname = 'public' 
  AND tablename = 'teams';

-- List all RLS policies for the team_members table
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM 
  pg_policies 
WHERE 
  schemaname = 'public' 
  AND tablename = 'team_members';

-- Count the number of teams
SELECT COUNT(*) FROM public.teams;

-- Count the number of team members
SELECT COUNT(*) FROM public.team_members;