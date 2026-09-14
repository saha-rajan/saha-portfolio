const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const importRegex = /import React, { createContext, useContext, useState, useRef, useEffect } from 'react';/;
content = content.replace(importRegex, `import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AI_BUBBLE_CSS = \`
@keyframes aiBubble {
  0% { transform: translateY(0) scale(0); opacity: 0; }
  50% { opacity: 0.5; scale: 1; }
  100% { transform: translateY(-100px) scale(0); opacity: 0; }
}
.ai-bubble {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: aiBubble infinite ease-in-out;
}
\`;
`);

// If the regex failed to match (due to exact string differences), we'll do an insert near top.
if (!content.includes('AI_BUBBLE_CSS')) {
    content = content.replace("export const ChakkuContext", `
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

export const ChakkuContext`);
}

const haloDiv = `<motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[190] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 60%, rgba(150, 150, 150, 0.2) 140%)',
            boxShadow: 'inset 0 0 100px rgba(150, 150, 150, 0.2)',
            border: '1px solid rgba(150, 150, 150, 0.25)'
          }}
        />`;

const haloWithBubbles = `        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[190] pointer-events-none overflow-hidden"
          style={{
            background: 'radial-gradient(circle, transparent 60%, rgba(150, 150, 150, 0.2) 140%)',
            boxShadow: 'inset 0 0 100px rgba(150, 150, 150, 0.2)',
            border: '1px solid rgba(150, 150, 150, 0.25)'
          }}
        >
          <style>{AI_BUBBLE_CSS}</style>
          {Array.from({ length: 24 }).map((_, i) => (
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
          ))}
        </motion.div>`;

content = content.replace(haloDiv, haloWithBubbles);
fs.writeFileSync(file, content);
console.log("Bubbles added!");
