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

// Function to add sound effects hook import
function addSoundEffectsImport(content) {
  // Check if sound effects hook is already imported
  if (content.includes("import { useSoundEffects } from '@/hooks/use-sound-effects'")) {
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
  
  // Insert the sound effects hook import after the last import
  return content.slice(0, lastImportEnd) + 
         "\nimport { useSoundEffects } from '@/hooks/use-sound-effects';" + 
         content.slice(lastImportEnd);
}

// Function to add sound effects hook usage
function addSoundEffectsHook(content) {
  // Check if the component already has the sound effects hook
  if (content.includes("useSoundEffects()")) {
    return content;
  }
  
  // Find the component function start
  const componentRegex = /function\s+(\w+)\s*\([^)]*\)\s*{|const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{/;
  const componentMatch = content.match(componentRegex);
  
  if (!componentMatch) {
    return content;
  }
  
  // Find the first line after the component opening
  const componentStart = componentMatch.index + componentMatch[0].length;
  
  // Insert the sound effects hook
  return content.slice(0, componentStart) + 
         "\n  const { playButtonClick, playPageTransition } = useSoundEffects();\n\n  // Play page transition sound on component mount\n  React.useEffect(() => {\n    playPageTransition();\n  }, [playPageTransition]);\n" + 
         content.slice(componentStart);
}

// Function to replace the footer with the Footer component
function replaceFooter(content) {
  // Replace the footer section with the Footer component
  const footerRegex = /<footer[\s\S]*?<\/footer>/;
  return content.replace(footerRegex, '<Footer />');
}

// Function to add sound effects to buttons
function addSoundEffectsToButtons(content) {
  // Add onClick handler to buttons
  return content.replace(
    /<button([^>]*)>/g, 
    '<button$1 onClick={() => playButtonClick()}>'
  );
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
  
  // Add sound effects hook import
  content = addSoundEffectsImport(content);
  
  // Add sound effects hook usage
  content = addSoundEffectsHook(content);
  
  // Replace the footer
  content = replaceFooter(content);
  
  // Add sound effects to buttons
  content = addSoundEffectsToButtons(content);
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content);
  
  console.log(`Updated: ${page}`);
});

console.log('Footer update complete!');
