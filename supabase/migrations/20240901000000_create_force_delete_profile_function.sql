-- Create a function to force delete a profile
CREATE OR REPLACE FUNCTION public.force_delete_profile(profile_id UUID)
RETURNS VOID AS $$
BEGIN
  -- First, remove any references to this profile in project_members
  DELETE FROM public.project_members WHERE user_id = profile_id;
  
  -- Remove any references in tasks
  UPDATE public.tasks SET assigned_to = NULL WHERE assigned_to = profile_id;
  
  -- Remove any references in project_files
  UPDATE public.project_files SET uploaded_by = NULL WHERE uploaded_by = profile_id;
  
  -- Finally, delete the profile
  DELETE FROM public.profiles WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.force_delete_profile(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.force_delete_profile IS 'Safely removes a profile by first removing all references to it';
