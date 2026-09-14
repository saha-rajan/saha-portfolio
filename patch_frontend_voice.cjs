const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldConfig = `        config: { 
          responseModalities: ['AUDIO'],
          systemInstruction: { parts: [{ text: data.systemInstruction }] },
          tools: data.tools
        },`;

const newConfig = `        config: { 
          responseModalities: ['AUDIO'],
          generationConfig: {
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Puck"
                }
              }
            }
          },
          systemInstruction: { parts: [{ text: data.systemInstruction }] },
          tools: data.tools
        },`;

content = content.replace(oldConfig, newConfig);

fs.writeFileSync(file, content);
console.log("Frontend voice config applied!");
