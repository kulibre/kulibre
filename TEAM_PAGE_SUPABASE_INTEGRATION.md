# Team Page Supabase Integration

This document outlines the changes made to connect the Team page with Supabase.

## Database Schema Updates

1. Added a new `team_invitations` table to track pending invitations:
   - `id`: UUID primary key
   - `email`: Email address of the invited user
   - `role`: Role assigned to the invited user
   - `user_id`: Reference to the profiles table
   - `created_at`: Timestamp when the invitation was created
   - `expires_at`: Timestamp when the invitation expires
   - `accepted_at`: Timestamp when the invitation was accepted

2. Added new columns to the `profiles` table:
   - `email`: Email address of the user
   - `active`: Boolean indicating if the user is active

## Team Page Functionality Updates

### Team Members Fetching

- Updated to fetch profiles from the `profiles` table
- Added logic to determine user status based on pending invitations
- Included email information in the team member data

### Invite Member Functionality

- Connected to Supabase to create a new profile for the invited user
- Added an invitation record in the `team_invitations` table
- Implemented project assignment for invited users
- Added error handling for database operations

### Update Member Functionality

- Connected to Supabase to update profile information
- Added support for updating user status (active/inactive)
- Implemented proper error handling

### Remove Member Functionality

- Connected to Supabase to remove team members
- Added cascading deletion of related records:
  - Project assignments
  - Pending invitations
  - User profile
- Implemented proper error handling

### Bulk Actions

- Implemented bulk role changes using Supabase
- Implemented bulk deletion using Supabase
- Added proper error handling and success notifications

## Migration File

Created a migration file (`20240701000000_create_team_invitations.sql`) that:
- Creates the `team_invitations` table
- Adds the `email` and `active` columns to the `profiles` table if they don't exist
- Sets up Row Level Security (RLS) policies for the `team_invitations` table

## Type Definitions

Updated the Supabase type definitions to include:
- The new `team_invitations` table
- The new columns in the `profiles` table

## Next Steps

1. Run the migration to create the new table and columns
2. Implement email sending functionality for invitations
3. Create an invitation acceptance flow
4. Add more detailed error handling and validation