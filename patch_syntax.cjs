const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("\\\\ntype ChakkuMode", "\\ntype ChakkuMode");

fs.writeFileSync(file, content);
console.log("Syntax error fixed!");
