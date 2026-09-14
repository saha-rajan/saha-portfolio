const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const constantStr = `
const STATIC_BUBBLES = Array.from({ length: 24 }).map(() => ({
  width: Math.random() * 4 + 2 + 'px',
  height: Math.random() * 4 + 2 + 'px',
  left: Math.random() * 100 + '%',
  bottom: Math.random() * 20 - 5 + '%',
  animationDelay: Math.random() * 4 + 's',
  animationDuration: Math.random() * 3 + 3 + 's'
}));
`;

content = content.replace("type ChakkuMode =", constantStr + "\\ntype ChakkuMode =");

const oldBubbles = `          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="ai-bubble"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                bottom: Math.random() * 20 - 5 + '%',
                animationDelay: Math.random() * 4 + 's',
                animationDuration: Math.random() * 3 + 3 + 's'
              }}
            />
          ))}`;

const newBubbles = `          {STATIC_BUBBLES.map((style, i) => (
            <div key={i} className="ai-bubble" style={style} />
          ))}`;

content = content.replace(oldBubbles, newBubbles);

fs.writeFileSync(file, content);
console.log("Static bubbles applied!");
