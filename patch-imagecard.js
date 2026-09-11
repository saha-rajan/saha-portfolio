import fs from 'fs';
let content = fs.readFileSync('src/app/pages/StudioDetail.tsx', 'utf-8');

// Replace ImageCard styles
content = content.replace(
  /cursor: "grab",/,
  \`cursor: "none",\`
);

content = content.replace(
  /whileDrag=\{\{ scale: 1\.05, cursor: "grabbing" \}\}/,
  \`whileDrag={{ scale: 1.05, cursor: "none" }}\`
);

fs.writeFileSync('src/app/pages/StudioDetail.tsx', content);
