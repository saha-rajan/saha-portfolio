const fs = require('fs');
const file = 'api/live-token.ts';
let content = fs.readFileSync(file, 'utf8');

const oldConfig = `        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Puck"
            }
          }
        },`;

const newConfig = `        generationConfig: {
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Puck"
              }
            }
          }
        },`;

content = content.replace(oldConfig, newConfig);

fs.writeFileSync(file, content);
console.log("Voice fixed!");
