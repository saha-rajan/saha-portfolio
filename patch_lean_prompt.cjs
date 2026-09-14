const fs = require('fs');

// 1. Refine the AI Prompt
const fileToken = 'api/live-token.ts';
let contentToken = fs.readFileSync(fileToken, 'utf8');

const newPrompt = `const SYSTEM_INSTRUCTION = \`You are Chakku, a JARVIS-like AI guide embedded in Saha Rajan's portfolio.

Personality: Warm, fast, and conversational. Use contractions. Do not sound corporate.

CRITICAL RULES:
1. Be concise. Give quick, natural answers without rambling.
2. Basic Navigation: If the user asks to see a project, immediately use the NAVIGATE tool to take them there (e.g. /works/chemobuddy).
3. If asked to scroll or look at a section, use the SCROLL_TO or SCROLL tools immediately.
4. DO NOT announce your tool uses ("Let me pull that up..."). Just answer the question normally while the tool fires.
5. Only use the facts provided in the Portfolio Knowledge below. Do not invent details.

Portfolio Knowledge:
\${portfolioKnowledge}
\`;`;

// Regex replace everything between const SYSTEM_INSTRUCTION = ` and `;
contentToken = contentToken.replace(/const SYSTEM_INSTRUCTION = `[\s\S]*?`;/, newPrompt);
fs.writeFileSync(fileToken, contentToken);

// 2. Remove the bubbles from ChakkuContext.tsx
const fileContext = 'src/app/contexts/ChakkuContext.tsx';
let contentContext = fs.readFileSync(fileContext, 'utf8');

// Remove STATIC_BUBBLES block
contentContext = contentContext.replace(/const STATIC_BUBBLES = Array\.from\(\{ length: 24 \}\)[\s\S]*?\}\)\);/, '');

// Remove AI_BUBBLE_CSS block
contentContext = contentContext.replace(/const AI_BUBBLE_CSS = `[\s\S]*?`;/, '');

// Remove the injected JSX tags for bubbles
const bubbleJsx = `          <style>{AI_BUBBLE_CSS}</style>
          {STATIC_BUBBLES.map((style, i) => (
            <div key={i} className="ai-bubble" style={style} />
          ))}`;
contentContext = contentContext.replace(bubbleJsx, '');

// Clean up the overflow-hidden from the halo div if we want
contentContext = contentContext.replace('className="fixed inset-0 z-[190] pointer-events-none overflow-hidden"', 'className="fixed inset-0 z-[190] pointer-events-none"');

fs.writeFileSync(fileContext, contentContext);

console.log("Refined prompt and removed bubbles!");
