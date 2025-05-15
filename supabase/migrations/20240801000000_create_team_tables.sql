-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  job_title TEXT,
  department TEXT,
  email TEXT,
  role TEXT DEFAULT 'member',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_invitations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Add email column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
END
$$;

-- Add role column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'member';
  END IF;
END
$$;

-- Add active column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'active'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN active BOOLEAN DEFAULT TRUE;
  END IF;
END
$$;

-- Add job_title column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'job_title'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN job_title TEXT;
  END IF;
END
$$;

-- Add department column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'department'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN department TEXT;
  END IF;
END
$$;

-- Enable Row Level Security on team_invitations
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for team_invitations
CREATE POLICY "Allow authenticated users to view team invitations" 
  ON public.team_invitations FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create team invitations" 
  ON public.team_invitations FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their own invitations" 
  ON public.team_invitations FOR UPDATE 
  TO authenticated
  USING (email = auth.email());

-- Insert a sample profile for the current user if it doesn't exist
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
  auth.uid(), 
  COALESCE((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = auth.uid()), 'Admin User'),
  (SELECT email FROM auth.users WHERE id = auth.uid()),
  'admin'
WHERE 
  NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid());
