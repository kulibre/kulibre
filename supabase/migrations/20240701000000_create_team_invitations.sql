-- Create team_invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Create RLS policies for team_invitations
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view invitations
CREATE POLICY "Authenticated users can view invitations" 
  ON public.team_invitations 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow authenticated users to create invitations
CREATE POLICY "Authenticated users can create invitations" 
  ON public.team_invitations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow authenticated users to update their own invitations
CREATE POLICY "Authenticated users can update their own invitations" 
  ON public.team_invitations 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own invitations
CREATE POLICY "Authenticated users can delete their own invitations" 
  ON public.team_invitations 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);