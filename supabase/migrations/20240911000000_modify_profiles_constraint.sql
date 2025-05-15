-- Create a temporary table to store existing profiles
CREATE TEMP TABLE temp_profiles AS
SELECT * FROM public.profiles;

-- Drop the existing profiles table
DROP TABLE IF EXISTS public.profiles;

-- Recreate the profiles table without the foreign key constraint
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  job_title TEXT,
  department TEXT,
  email TEXT,
  role TEXT DEFAULT 'member',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restore the data from the temporary table
INSERT INTO public.profiles
SELECT * FROM temp_profiles;

-- Drop the temporary table
DROP TABLE temp_profiles;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can create profiles" 
  ON public.profiles FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
