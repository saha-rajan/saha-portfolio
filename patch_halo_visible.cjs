const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHalo = `style={{
            boxShadow: 'inset 0 0 150px rgba(150, 150, 150, 0.15)'
          }}`;

const newHalo = `style={{
            boxShadow: 'inset 0 0 200px rgba(0, 0, 0, 0.25), inset 0 0 0 2px rgba(0, 0, 0, 0.05)'
          }}`;

content = content.replace(oldHalo, newHalo);
fs.writeFileSync(file, content);
console.log("Halo made visible!");
