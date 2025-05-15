import { createClient } from '@supabase/supabase-js';

// Supabase connection details (same as in your client.ts file)
const SUPABASE_URL = "https://itaechlpkrvaccxyeaud.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0YWVjaGxwa3J2YWNjeHllYXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODE2NjksImV4cCI6MjA2MTE1NzY2OX0.ZUmObRVDx4jtbJiGeZj4e3JkK_rQpFfV2bSP0c-68_U";

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkDatabaseConnection() {
  console.log("Checking database connection and tables...");
  
  try {
    // Check authentication
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error("Authentication error:", authError.message);
      console.log("Please sign in first to check database connection.");
      return;
    }
    
    if (!authData?.user) {
      console.error("No authenticated user found.");
      console.log("Please sign in first to check database connection.");
      return;
    }
    
    console.log(`Authenticated as user: ${authData.user.email}`);
    
    // Check if tables exist by querying them
    const tables = [
      'profiles',
      'clients',
      'projects',
      'project_members',
      'project_milestones',
      'tasks',
      'project_files'
    ];
    
    console.log("\nChecking tables:");
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: Error - ${error.message}`);
        } else {
          console.log(`✅ ${table}: Table exists with ${count} rows`);
        }
      } catch (e) {
        console.log(`❌ ${table}: Error - ${e.message}`);
      }
    }
    
    // Check for projects specifically
    console.log("\nChecking projects data:");
    
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, description, type, status, created_at, due_date');
    
    if (projectsError) {
      console.error("Error fetching projects:", projectsError.message);
    } else if (!projects || projects.length === 0) {
      console.log("No projects found. You may need to create some projects.");
    } else {
      console.log(`Found ${projects.length} projects:`);
      projects.forEach(project => {
        console.log(`- ${project.name} (${project.status})`);
      });
    }
    
    // Check for project members
    console.log("\nChecking project members:");
    
    const { data: members, error: membersError } = await supabase
      .from('project_members')
      .select(`
        project_id,
        projects:project_id (name),
        user_id,
        role
      `);
    
    if (membersError) {
      console.error("Error fetching project members:", membersError.message);
    } else if (!members || members.length === 0) {
      console.log("No project members found.");
    } else {
      console.log(`Found ${members.length} project member assignments:`);
      members.forEach(member => {
        console.log(`- Project: ${member.projects?.name}, Role: ${member.role}`);
      });
    }
    
    // Check for project milestones
    console.log("\nChecking project milestones:");
    
    const { data: milestones, error: milestonesError } = await supabase
      .from('project_milestones')
      .select(`
        id,
        title,
        project_id,
        projects:project_id (name),
        due_date,
        completed
      `);
    
    if (milestonesError) {
      console.error("Error fetching project milestones:", milestonesError.message);
    } else if (!milestones || milestones.length === 0) {
      console.log("No project milestones found.");
    } else {
      console.log(`Found ${milestones.length} project milestones:`);
      milestones.forEach(milestone => {
        console.log(`- Project: ${milestone.projects?.name}, Milestone: ${milestone.title}, Completed: ${milestone.completed ? 'Yes' : 'No'}`);
      });
    }
    
    console.log("\nDatabase connection check completed!");
    
  } catch (error) {
    console.error("Unexpected error during database check:", error.message);
  }
}

// Run the check
checkDatabaseConnection();