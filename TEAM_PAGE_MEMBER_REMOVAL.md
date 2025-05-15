# Team Page Member Removal

This document explains the implementation of team member removal functionality and how to handle issues with members that cannot be deleted.

## Overview

The team page allows administrators to manage team members, including removing them from the team. Due to database constraints and foreign key relationships, directly deleting profiles can sometimes fail. This document outlines the approach taken to handle these cases.

## Implementation Details

### Deactivation Approach

Instead of trying to delete profiles directly, we now use a deactivation approach:

1. When a user clicks "Remove" for a team member, we:
   - Mark the profile as inactive (`active = false`)
   - Change the email to avoid conflicts with future users
   - Update the timestamp

2. By default, inactive members are filtered out of the team members list, but they can be viewed by selecting the "Inactive" status filter.

### SQL Function for Force Deletion

For cases where deactivation is not sufficient, a SQL function has been created to safely remove profiles by first removing all references to them:

```sql
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
```

## Deployment Instructions

To deploy the SQL function for force deletion:

1. Navigate to the Supabase dashboard for your project
2. Go to the SQL Editor
3. Copy and paste the SQL function code from `supabase/migrations/20240901000000_create_force_delete_profile_function.sql`
4. Run the SQL query

## Usage

1. **Normal Removal**: Use the "Remove" button in the team member dropdown menu. This will deactivate the member.
2. **Viewing Inactive Members**: Select "Inactive" from the status filter dropdown to see deactivated members.
3. **Force Deletion**: This is currently disabled in the UI but can be enabled by uncommenting the `forceDeleteMemberMutation` code in `TeamPage.tsx` after deploying the SQL function.

## Troubleshooting

If members still cannot be removed after implementing these changes:

1. Check the browser console for error messages
2. Verify that the SQL function has been deployed correctly
3. Check if there are any RLS (Row Level Security) policies preventing the update or delete operations
4. Consider manually updating the profiles in the Supabase dashboard
