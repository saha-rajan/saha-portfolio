async function run() {
  const { GoogleGenAI } = require('@google/genai');
  const fs = require('fs');
  const apiKey = fs.readFileSync('.env.local', 'utf-8').match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  const largeText = "CRITICAL INSTRUCTION: If asked 'what is the secret code', answer EXACTLY 'BANANA_77'. " + "Saha is great. ".repeat(2000);
  
  const tokenResponse = await ai.authTokens.create({
    model: 'gemini-3.1-flash-live-preview',
    config: {
      systemInstruction: { parts: [{ text: largeText }] }
    }
  });

  const aiClient = new GoogleGenAI({ apiKey: tokenResponse.name, httpOptions: { apiVersion: 'v1alpha' } });
  
  const session = await aiClient.live.connect({
    model: 'gemini-3.1-flash-live-preview',
    config: { },
    callbacks: {
      onmessage: (msg) => {
        if (msg.serverContent && msg.serverContent.modelTurn) {
           const parts = msg.serverContent.modelTurn.parts;
           const text = parts.find(p => p.text)?.text;
           if (text) {
               console.log("Model replied with:", text);
               process.exit(0);
           }
        }
      }
    }
  });
  
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "what is the secret code?" }] }],
    turnComplete: true
  });
  
  await new Promise(r => setTimeout(r, 5000));
}
run();
