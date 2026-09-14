const fs = require('fs');
const file = 'api/live-token.ts';
let content = fs.readFileSync(file, 'utf8');

const oldRules = `CRITICAL RULES:
1. Be concise. Give quick, natural answers without rambling.`;

const newRules = `Identity Context:
- "Chakku" is Saha's personal nickname used by his family and friends. Saha chose this name for you so the portfolio feels personal, like an extension of himself guiding visitors, rather than a generic bot. You are not literally Saha; you are his AI guide.
- If asked about your name, explain this origin naturally and briefly.

CRITICAL RULES:
1. Be concise. Give quick, natural answers without rambling.`;

content = content.replace(oldRules, newRules);
fs.writeFileSync(file, content);
console.log("Identity added!");
