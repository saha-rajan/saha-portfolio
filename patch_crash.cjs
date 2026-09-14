const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const constantStr = `
const AI_BUBBLE_CSS = \`
@keyframes aiBubble {
  0% { transform: translateY(0) scale(0); opacity: 0; }
  50% { opacity: 0.4; scale: 1; }
  100% { transform: translateY(-100px) scale(0); opacity: 0; }
}
.ai-bubble {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: aiBubble infinite ease-in-out;
}
\`;
`;

// Safely inject it right after the imports
content = content.replace("type ChakkuMode =", constantStr + "\\ntype ChakkuMode =");

fs.writeFileSync(file, content);
console.log("Crash fixed!");
