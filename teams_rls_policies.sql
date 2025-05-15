-- Enable Row Level Security on teams tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teams

-- Allow all authenticated users to view teams
CREATE POLICY "Allow all authenticated users to view teams" 
  ON public.teams FOR SELECT 
  TO authenticated
  USING (true);

-- Allow authenticated users to create teams
CREATE POLICY "Authenticated users can create teams" 
  ON public.teams FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow team owners and admins to update their teams
CREATE POLICY "Team owners and admins can update teams" 
  ON public.teams FOR UPDATE 
  TO authenticated
  USING (
    id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Allow team owners to delete their teams
CREATE POLICY "Team owners can delete teams" 
  ON public.teams FOR DELETE 
  TO authenticated
  USING (
    id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Create RLS policies for team_members

-- Allow all authenticated users to view team members
CREATE POLICY "Allow all authenticated users to view team members" 
  ON public.team_members FOR SELECT 
  TO authenticated
  USING (true);

-- Allow team owners and admins to add members
CREATE POLICY "Team owners and admins can add members" 
  ON public.team_members FOR INSERT 
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Allow team owners and admins to update member roles
CREATE POLICY "Team owners and admins can update member roles" 
  ON public.team_members FOR UPDATE 
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Allow team owners and admins to remove members
CREATE POLICY "Team owners and admins can remove members" 
  ON public.team_members FOR DELETE 
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );