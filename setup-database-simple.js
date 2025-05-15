// Simple script to set up the database tables for the project
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key. Make sure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20240720000000_create_project_tables_simple.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('Error setting up database:', error);
      return;
    }

    console.log('Database setup complete!');

    // Insert a sample project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          name: 'Sample Project',
          description: 'This is a sample project created by the setup script.',
          type: 'website',
          status: 'in_progress',
          start_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_by: null, // Will be updated with the current user's ID if available
        },
      ])
      .select();

    if (projectError) {
      console.error('Error creating sample project:', projectError);
      return;
    }

    console.log('Sample project created:', project);

  } catch (error) {
    console.error('Error:', error);
  }
}

setupDatabase();