import { supabase } from './integrations/supabase/client';

async function checkUserTasksTable() {
  console.log('Checking if user_tasks table exists...');
  
  try {
    // Try to query the user_tasks table
    const { data, error } = await supabase
      .from('user_tasks')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error querying user_tasks table:', error);
      return false;
    }
    
    console.log('user_tasks table exists!', data);
    return true;
  } catch (error) {
    console.error('Unexpected error checking user_tasks table:', error);
    return false;
  }
}

// Run the check
checkUserTasksTable().then(exists => {
  console.log('user_tasks table exists:', exists);
});
