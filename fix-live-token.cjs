const fs = require('fs');

let content = fs.readFileSync('api/live-token.ts', 'utf-8');
content = content.replace(/,\s*systemInstruction:/, "\n      ]\n    }];\n\n    const tokenResponse = await ai.authTokens.create({\n      model: 'gemini-3.1-flash-live-preview',\n      config: {\n        responseModalities: ['AUDIO'],\n        speechConfig: {\n          voiceConfig: {\n            prebuiltVoiceConfig: {\n              voiceName: \"Puck\"\n            }\n          }\n        },\n        systemInstruction:");
fs.writeFileSync('api/live-token.ts', content);
console.log("Fixed");
