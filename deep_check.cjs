const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Get all assets
const assetsDir = path.join(__dirname, 'src/assets');
const allAssets = fs.readdirSync(assetsDir).filter(f => !f.startsWith('.'));

// 2. Get all source code text
const srcFiles = execSync('find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.css"').toString().trim().split('\n');
const fileContents = {};
for (const file of srcFiles) {
  fileContents[file] = fs.readFileSync(file, 'utf8');
}

// 3. Find 0 imports
console.log("--- UNUSED ASSETS (0 IMPORTS) ---");
const unusedAssets = [];
for (const asset of allAssets) {
  let found = false;
  for (const [file, content] of Object.entries(fileContents)) {
    if (content.includes(asset)) {
      found = true;
      break;
    }
  }
  if (!found) {
    unusedAssets.push(asset);
    console.log(asset);
  }
}

// 4. Find dead imports (imported but unused variable)
console.log("\n--- DEAD IMPORTS (IMPORTED BUT UNUSED VARIABLE) ---");
const importRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"].*(?:assets|figma:asset)\/.*['"]/g;
const deadImports = [];

for (const [file, content] of Object.entries(fileContents)) {
  let match;
  // reset regex
  importRegex.lastIndex = 0;
  while ((match = importRegex.exec(content)) !== null) {
    const varName = match[1];
    // count occurrences of varName in this file
    const regex = new RegExp(`\\b${varName}\\b`, 'g');
    const count = (content.match(regex) || []).length;
    if (count === 1) { // Only used in the import statement itself
      deadImports.push({ file, varName });
      console.log(`File: ${file} | Variable: ${varName}`);
    }
  }
}

console.log("\nSummary: " + unusedAssets.length + " unused assets, " + deadImports.length + " dead imports.");
