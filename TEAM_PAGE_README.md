# Team Page Implementation

This document outlines the implementation of the Team page in the Project Spark Agency application.

## Overview

The Team page allows users to manage team members, including:
- Viewing a list of all team members
- Inviting new team members
- Editing existing team members
- Removing team members
- Filtering and searching team members

## Database Schema

The Team page uses the following database tables:

### Profiles Table

The `profiles` table stores information about users:

```sql
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
```

### Team Invitations Table

The `team_invitations` table tracks pending invitations:

```sql
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
```

## Components

The Team page implementation consists of the following components:

1. **TeamPage.tsx**: The main page component that displays the team member list and provides filtering and search functionality.

2. **InviteMemberModal.tsx**: A modal component for inviting new team members.

3. **EditMemberModal.tsx**: A modal component for editing existing team members.

## Features

### Team Member List

- Displays all team members with their information
- Supports both grid (card) and list (table) views
- Shows status indicators (Active/Invited/Inactive)

### Invite Member

- Form for entering email, role, and optional project assignments
- Sends invitation to the specified email
- Creates a record in the `team_invitations` table

### Edit Member

- Form for updating member information
- Allows changing role, job title, department, and active status
- Updates the `profiles` table

### Remove Member

- Confirmation dialog before removing a member
- Removes the member from the `profiles` table
- Removes any associated project assignments

### Search and Filter

- Search by name, email, job title, or department
- Filter by role (Admin, Manager, Member, Viewer)
- Filter by status (Active, Invited, Inactive)

## Future Enhancements

1. **Email Integration**: Implement actual email sending for invitations.
2. **Invitation Acceptance Flow**: Create a page for users to accept invitations.
3. **Bulk Actions**: Implement bulk role changes and bulk deletion.
4. **Pagination**: Add pagination for large teams.
5. **Role-Based Access Control**: Restrict certain actions based on user roles.

## How to Use

1. Navigate to the Team page from the sidebar.
2. Use the search bar to find specific team members.
3. Use the filters to narrow down the list by role or status.
4. Click "Invite Member" to add a new team member.
5. Click the edit icon on a team member card/row to edit their information.
6. Click the remove icon to remove a team member (requires confirmation).
