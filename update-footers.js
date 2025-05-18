import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of pages to update
const pagesToUpdate = [
  'Careers.tsx',
  'Contact.tsx',
  'Documentation.tsx',
  'FAQ.tsx',
  'Privacy.tsx',
  'RefundPolicy.tsx',
  'Security.tsx',
  'Support.tsx',
  'Terms.tsx',
  'Tutorials.tsx'
];

// Path to the pages directory
const pagesDir = path.join(__dirname, 'src', 'pages');

// Function to add the Footer import
function addFooterImport(content) {
  // Check if Footer is already imported
  if (content.includes("import Footer from '@/components/ui/footer'")) {
    return content;
  }
  
  // Find the last import statement
  const importRegex = /^import .+;$/gm;
  const imports = [...content.matchAll(importRegex)];
  
  if (imports.length === 0) {
    return content;
  }
  
  const lastImport = imports[imports.length - 1];
  const lastImportEnd = lastImport.index + lastImport[0].length;
  
  // Insert the Footer import after the last import
  return content.slice(0, lastImportEnd) + 
         "\nimport Footer from '@/components/ui/footer';" + 
         content.slice(lastImportEnd);
}

// Function to replace the footer with the Footer component
function replaceFooter(content) {
  // Replace the footer section with the Footer component
  const footerRegex = /<footer[\s\S]*?<\/footer>/;
  return content.replace(footerRegex, '<Footer />');
}

// Process each file
pagesToUpdate.forEach(page => {
  const filePath = path.join(pagesDir, page);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add the Footer import
  content = addFooterImport(content);
  
  // Replace the footer
  content = replaceFooter(content);
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content);
  
  console.log(`Updated: ${page}`);
});

console.log('Footer update complete!');