async function run() {
  const { GoogleGenAI } = require('@google/genai');
  const fs = require('fs');
  const apiKey = fs.readFileSync('.env.local', 'utf-8').match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  const tokenResponse = await ai.authTokens.create({
    model: 'gemini-3.1-flash-live-preview',
    config: {
      responseModalities: ['AUDIO'],
      systemInstruction: { parts: [{ text: "Hello!" }] }
    }
  });

  const aiClient = new GoogleGenAI({ apiKey: tokenResponse.name, httpOptions: { apiVersion: 'v1alpha' } });
  const session = await aiClient.live.connect({
    model: 'gemini-3.1-flash-live-preview',
    config: {
      responseModalities: ['AUDIO'],
      systemInstruction: { parts: [{ text: "Hello!" }] }
    },
    callbacks: {
      onmessage: (msg) => {
        if (msg.serverContent && msg.serverContent.modelTurn) {
           const parts = msg.serverContent.modelTurn.parts;
           console.log("Model replied with:", JSON.stringify(parts).substring(0, 100));
           if (parts.some(p => p.inlineData && p.inlineData.mimeType.includes("audio"))) {
               console.log("GOT AUDIO!");
               process.exit(0);
           }
        }
      },
      onclose: (e) => { console.log("WS Closed:", e.code); process.exit(1); }
    }
  });
  
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "Hi, are you there? Please speak." }] }],
    turnComplete: true
  });
  
  await new Promise(r => setTimeout(r, 10000));
}
run();
