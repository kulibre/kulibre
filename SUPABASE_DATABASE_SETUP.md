# Supabase Database Setup Guide

This guide will help you set up the project database in Supabase and verify that it's working correctly with the Project Spark Agency application.

## Step 1: Run the SQL Script in Supabase

1. **Log in to your Supabase dashboard**
   - Go to [https://app.supabase.io/](https://app.supabase.io/)
   - Sign in with your credentials
   - Select your project

2. **Open the SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New Query" to create a new SQL query

3. **Run the Database Setup Script**
   - Open the `project_database_setup.sql` file from this repository
   - Copy the entire contents of the file
   - Paste it into the SQL Editor in Supabase
   - Click "Run" to execute the script
   - You should see a success message when the script completes

## Step 2: Verify the Tables Were Created

1. **Check the Table Editor**
   - In the left sidebar, click on "Table Editor"
   - You should see the following tables:
     - `profiles`
     - `clients`
     - `projects`
     - `project_members`
     - `project_milestones`
     - `tasks`
     - `project_files`

2. **Verify Sample Data**
   - Click on the `projects` table
   - You should see three sample projects:
     - Website Redesign
     - Mobile App Development
     - Brand Identity Update
   - Click on the `project_milestones` table
   - You should see milestones for the Website Redesign project
   - Click on the `tasks` table
   - You should see tasks for the Website Redesign project

## Step 3: Test the Application

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Log in to the Application**
   - Navigate to the login page
   - Sign in with your Supabase credentials

3. **Go to the Projects Page**
   - Navigate to the Projects page
   - You should see the sample projects you created
   - Click on a project to view its details, milestones, and tasks

## Troubleshooting

If you don't see the projects in the application:

1. **Check the Browser Console**
   - Open your browser's developer tools (F12 or right-click > Inspect)
   - Look for any errors in the Console tab

2. **Verify Authentication**
   - Make sure you're logged in to the application
   - The projects are only visible to the user who created them

3. **Check Row Level Security (RLS)**
   - In Supabase, go to Authentication > Policies
   - Verify that the policies for the `projects` table are set up correctly

4. **Run the Demo Data Script**
   - If you still don't see any projects, try running:
   ```bash
   npm run setup-demo
   ```

## Additional Notes

- The SQL script creates tables with Row Level Security (RLS) enabled
- Projects are only visible to their creator or members
- The sample data is created for the currently authenticated user
- You can modify the script to add more sample data as needed