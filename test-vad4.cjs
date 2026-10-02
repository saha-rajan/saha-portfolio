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
           console.log("Model replied!");
           process.exit(0);
        }
      }
    }
  });
  
  console.log("Streaming dummy audio...");
  for(let i=0; i<30; i++) {
     session.sendRealtimeInput({
       audio: { mimeType: "audio/pcm;rate=16000", data: Buffer.alloc(1600).toString('base64') }
     });
     await new Promise(r => setTimeout(r, 100));
  }
  
  await new Promise(r => setTimeout(r, 5000));
  console.log("No reply after 5s");
  process.exit(0);
}
run();
