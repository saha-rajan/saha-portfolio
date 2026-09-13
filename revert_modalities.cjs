const fs = require('fs');

let liveToken = fs.readFileSync('api/live-token.ts', 'utf8');
liveToken = liveToken.replace(/responseModalities:\s*\['AUDIO',\s*'TEXT'\]/, "responseModalities: ['AUDIO']");
fs.writeFileSync('api/live-token.ts', liveToken);

let chakkuCtx = fs.readFileSync('src/app/contexts/ChakkuContext.tsx', 'utf8');
chakkuCtx = chakkuCtx.replace(/responseModalities:\s*\['AUDIO',\s*'TEXT'\]/, "responseModalities: ['AUDIO']");
fs.writeFileSync('src/app/contexts/ChakkuContext.tsx', chakkuCtx);

console.log("Modalities reverted to ['AUDIO']");
