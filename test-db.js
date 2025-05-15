// Simple script to execute the database test
const { execSync } = require('child_process');

try {
  console.log('Running database test...');
  execSync('npx tsx src/test-db.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running test:', error);
}
