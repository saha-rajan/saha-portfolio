const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCss = `  50% { opacity: 0.4; scale: 1; }`;
const newCss = `  50% { opacity: 0.8; scale: 1.5; }`;
content = content.replace(oldCss, newCss);

const oldClass = `  background: white;
  border-radius: 50%;
  animation: aiBubble 3s infinite ease-in-out;`;
const newClass = `  background: white;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255,255,255,0.8);
  animation: aiBubble 3s infinite ease-in-out;`;
content = content.replace(oldClass, newClass);

fs.writeFileSync(file, content);
console.log("Bubbles made brighter!");
