const fs = require('fs');

// Patch live-token.ts
let liveToken = fs.readFileSync('api/live-token.ts', 'utf8');
liveToken = liveToken.replace("responseModalities: ['AUDIO']", "responseModalities: ['AUDIO', 'TEXT']");
fs.writeFileSync('api/live-token.ts', liveToken);

// Patch ChakkuContext.tsx
let chakkuCtx = fs.readFileSync('src/app/contexts/ChakkuContext.tsx', 'utf8');
chakkuCtx = chakkuCtx.replace("responseModalities: ['AUDIO']", "responseModalities: ['AUDIO', 'TEXT']");

// Also add the buffer ref
if (!chakkuCtx.includes('chakkuTextBufferRef')) {
    chakkuCtx = chakkuCtx.replace(
        "const transcriptRef = useRef<string>('');",
        "const transcriptRef = useRef<string>('');\n  const chakkuTextBufferRef = useRef<string>('');"
    );
}

// Update the visitor transcript format
chakkuCtx = chakkuCtx.replace(
    /transcriptRef\.current \+= event\.results\[i\]\[0\]\.transcript \+ "\\n";/g,
    'transcriptRef.current += `\\nVisitor: ${event.results[i][0].transcript.trim()}\\n`;'
);

// Update onmessage to capture text and handle turnComplete
const oldOnMessage = `          onmessage: (msg: any) => {
            if (msg.serverContent) {
               if (msg.serverContent.modelTurn) {
                 const modelTurn = msg.serverContent.modelTurn;
                 if (modelTurn && modelTurn.parts) {
                   for (const part of modelTurn.parts) {
                     if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                        setMode('speaking');
                        playerRef.current?.play(part.inlineData.data);
                     }
                   }
                 }
               }
               if (msg.serverContent.interrupted) {
                 playerRef.current?.interrupt();
                 setMode('listening');
               }
            }`;

const newOnMessage = `          onmessage: (msg: any) => {
            if (msg.serverContent) {
               if (msg.serverContent.modelTurn) {
                 const modelTurn = msg.serverContent.modelTurn;
                 if (modelTurn && modelTurn.parts) {
                   for (const part of modelTurn.parts) {
                     if (part.text) {
                         chakkuTextBufferRef.current += part.text;
                     }
                     if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                        setMode('speaking');
                        playerRef.current?.play(part.inlineData.data);
                     }
                   }
                 }
               }
               
               if (msg.serverContent.turnComplete) {
                   if (chakkuTextBufferRef.current.trim().length > 0) {
                       transcriptRef.current += \`\\nChakku: \${chakkuTextBufferRef.current.trim()}\\n\`;
                       chakkuTextBufferRef.current = "";
                   }
               }
               
               if (msg.serverContent.interrupted) {
                 if (chakkuTextBufferRef.current.trim().length > 0) {
                     transcriptRef.current += \`\\nChakku: \${chakkuTextBufferRef.current.trim()} [interrupted]\\n\`;
                     chakkuTextBufferRef.current = "";
                 }
                 playerRef.current?.interrupt();
                 setMode('listening');
               }
            }`;

chakkuCtx = chakkuCtx.replace(oldOnMessage, newOnMessage);
fs.writeFileSync('src/app/contexts/ChakkuContext.tsx', chakkuCtx);

console.log("Patched modalities and conversation log!");
