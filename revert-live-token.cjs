const fs = require('fs');

let content = fs.readFileSync('api/live-token.ts', 'utf-8');

// 1. Revert portfolioKnowledge
const originalKnowledgeLoader = `
  const knowledgeDir = path.join(process.cwd(), 'portfolio-knowledge');
  
  const filesToLoad = [
    'resume.md',
    'chemobuddy.md',
    'aisle.md',
    'aura.md',
    'guardrails.md'
  ];
  
  for (const file of filesToLoad) {
    const filePath = path.join(knowledgeDir, file);
    if (fs.existsSync(filePath)) {
      portfolioKnowledge += '\\n\\n--- ' + file + ' ---\\n\\n';
      portfolioKnowledge += fs.readFileSync(filePath, 'utf-8');
    }
  }
`;

content = content.replace(/portfolioKnowledge = \`[\s\S]*?\`;/, originalKnowledgeLoader);

// 2. Remove READ_PORTFOLIO_FILE rules
content = content.replace(/5\. Only use the facts provided in the Portfolio Knowledge below, or facts you retrieve using the READ_PORTFOLIO_FILE tool\. Do not invent details\./, "5. Only use the facts provided in the Portfolio Knowledge below. Do not invent details.");
content = content.replace(/7\. You ONLY have a brief summary of Saha in your starting knowledge.*?\n/, "");

// 3. Remove READ_PORTFOLIO_FILE tool
content = content.replace(/,\s*\{\s*name:\s*"READ_PORTFOLIO_FILE"[\s\S]*?\}\s*\}\s*\}/, "");

fs.writeFileSync('api/live-token.ts', content);
console.log("Done");
