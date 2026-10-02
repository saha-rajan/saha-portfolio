const fs = require('fs');

let content = fs.readFileSync('src/app/contexts/ChakkuContext.tsx', 'utf-8');

// 1. Remove raw imports
content = content.replace(/import resumeMd from '\.\.\/\.\.\/\.\.\/portfolio-knowledge\/resume\.md\?raw';\nimport chemobuddyMd from '\.\.\/\.\.\/\.\.\/portfolio-knowledge\/chemobuddy\.md\?raw';\nimport aisleMd from '\.\.\/\.\.\/\.\.\/portfolio-knowledge\/aisle\.md\?raw';\nimport auraMd from '\.\.\/\.\.\/\.\.\/portfolio-knowledge\/aura\.md\?raw';\nimport guardrailsMd from '\.\.\/\.\.\/\.\.\/portfolio-knowledge\/guardrails\.md\?raw';\n/, "");

// 2. Remove READ_PORTFOLIO_FILE case
content = content.replace(/case 'READ_PORTFOLIO_FILE':[\s\S]*?break;/, "");

// 3. Revert onresult
const newOnResult = `          recognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                transcriptRef.current += \`\\nVisitor: \${event.results[i][0].transcript.trim()}\\n\`;
              }
            }
          };`;
content = content.replace(/recognition\.onresult = \(event: any\) => \{[\s\S]*?\}\n            \}\n          \};/, newOnResult);

fs.writeFileSync('src/app/contexts/ChakkuContext.tsx', content);
console.log("Done");
