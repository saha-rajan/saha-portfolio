const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("animation: aiBubble infinite ease-in-out;", "animation: aiBubble 3s infinite ease-in-out;");

fs.writeFileSync(file, content);
console.log("CSS shorthand fixed!");
