# Team Page Supabase Connection

This document outlines the changes made to connect the Team page with the Supabase database.

## Database Schema Updates

1. Added missing columns to the `profiles` table:
   - `job_title`: Text field for storing the team member's job title
   - `department`: Text field for storing the team member's department
   - `active`: Boolean field for tracking whether a team member is active

2. Created the `team_invitations` table with the following structure:
   - `id`: UUID primary key
   - `email`: Email address of the invited user
   - `role`: Role assigned to the invited user
   - `user_id`: Reference to the profiles table
   - `token`: Unique token for the invitation
   - `created_at`: Timestamp when the invitation was created
   - `expires_at`: Timestamp when the invitation expires
   - `accepted_at`: Timestamp when the invitation was accepted

3. Set up Row Level Security (RLS) policies for the `team_invitations` table:
   - Allow authenticated users to view team invitations
   - Allow authenticated users to create team invitations
   - Allow authenticated users to update their own invitations

## Code Updates

### TeamPage.tsx

1. Updated the team members query to handle the `user_role` enum:
   - Added mapping from database enum values to UI role values
   - Added logging for better debugging
   - Improved error handling

2. Enhanced the status determination logic:
   - Active: Team member with active status
   - Invited: Team member with a pending invitation
   - Inactive: Team member with inactive status

### InviteMemberModal.tsx

1. Updated the invite member mutation to handle the `user_role` enum:
   - Added mapping from UI role values to database enum values
   - Added more detailed logging
   - Improved error handling

### EditMemberModal.tsx

1. Updated the update member mutation to handle the `user_role` enum:
   - Added mapping from UI role values to database enum values
   - Added more detailed logging
   - Improved error handling

## Sample Data

Added sample data to the database:
1. Updated existing profiles with roles, job titles, and departments
2. Created a sample invitation to test the invitation functionality

## Next Steps

1. **Email Integration**: Implement actual email sending for invitations
2. **Invitation Acceptance Flow**: Create a page for users to accept invitations
3. **Project Assignment**: Implement the functionality to assign invited users to projects
4. **Bulk Actions**: Implement bulk role changes and bulk deletion
5. **Pagination**: Add pagination for large teams

## Testing

To test the Team page functionality:
1. Navigate to the Team page
2. View the list of team members
3. Try inviting a new team member
4. Edit an existing team member
5. Try filtering and searching team members
