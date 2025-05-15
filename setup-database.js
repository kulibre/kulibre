import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Setting up database tables for Project Spark Agency...');

// Check if supabase directory exists
if (!fs.existsSync(path.join(__dirname, 'supabase'))) {
  console.error('Error: supabase directory not found. Make sure you are in the project root directory.');
  process.exit(1);
}

try {
  // Run the migration
  console.log('Running migrations...');
  execSync('npx supabase migration up', { stdio: 'inherit' });

  console.log('\nDatabase setup completed successfully!');
  console.log('You can now use the project management features.');
} catch (error) {
  console.error('Error running migrations:', error.message);
  console.log('\nTroubleshooting tips:');
  console.log('1. Make sure Supabase is running locally');
  console.log('2. Check if you have the correct Supabase credentials');
  console.log('3. Try running "npx supabase migration up" manually');
  process.exit(1);
}
