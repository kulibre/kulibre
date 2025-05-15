# Project Management Setup Guide

This guide will help you set up the project management feature in Project Spark Agency.

## Prerequisites

- Make sure you have Node.js installed
- Make sure you have Supabase CLI installed
- Make sure your local Supabase instance is running

## Setup Steps

1. **Run the database setup script**

   ```bash
   npm run setup-db
   ```

   This script will:
   - Run the necessary database migrations
   - Create the required tables for project management
   - Set up the appropriate permissions

2. **Restart the development server**

   ```bash
   npm run dev
   ```

3. **Access the project management feature**

   Navigate to the Projects page in the application to start using the project management feature.

## Troubleshooting

If you encounter any issues during setup:

1. **Check if Supabase is running**

   Make sure your local Supabase instance is running.

2. **Manual migration**

   You can try running the migration manually:

   ```bash
   npx supabase migration up
   ```

3. **Check the console for errors**

   Open your browser's developer console to see if there are any specific error messages.

## Features

The project management system includes:

- Project listing with filtering and sorting
- Project details with tabs for overview, tasks, files, and team
- Task board with drag-and-drop functionality
- File upload and management
- Team member management

Enjoy using the project management feature!
