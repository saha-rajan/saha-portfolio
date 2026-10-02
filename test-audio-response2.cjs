async function run() {
  const { GoogleGenAI } = require('@google/genai');
  const fs = require('fs');
  const apiKey = fs.readFileSync('.env.local', 'utf-8').match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const aiClient = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  const session = await aiClient.live.connect({
    model: 'gemini-3.1-flash-live-preview',
    config: { responseModalities: ['AUDIO'] },
    callbacks: {
      onmessage: (msg) => {
        if (msg.serverContent && msg.serverContent.modelTurn) {
           console.log("GOT AUDIO!");
           process.exit(0);
        }
      },
      onclose: (e) => { console.log("WS Closed:", e.code); process.exit(1); }
    }
  });
  
  // Use Object format
  session.sendRealtimeInput({
    audio: { mimeType: "audio/pcm;rate=16000", data: Buffer.alloc(1600).toString('base64') }
  });
  
  // Trigger text just to force a turn
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "Hello" }] }],
    turnComplete: true
  });
  await new Promise(r => setTimeout(r, 5000));
}
run();
