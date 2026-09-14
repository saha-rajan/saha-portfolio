const fs = require('fs');
const file = 'api/live-token.ts';
let content = fs.readFileSync(file, 'utf8');

const oldConfig = `        responseModalities: ['AUDIO'],
        systemInstruction: {`;

const newConfig = `        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Puck"
            }
          }
        },
        systemInstruction: {`;

content = content.replace(oldConfig, newConfig);

fs.writeFileSync(file, content);
console.log("Voice set to Puck!");
