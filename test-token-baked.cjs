async function run() {
  const { GoogleGenAI } = require('@google/genai');
  const fs = require('fs');
  const apiKey = fs.readFileSync('.env.local', 'utf-8').match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  // 30KB payload
  const largeText = "CRITICAL INSTRUCTION: If asked 'what is the secret code', answer 'BANANA_77'. " + "Saha is great. ".repeat(2000);
  
  // Create token with knowledge baked in
  const tokenResponse = await ai.authTokens.create({
    model: 'gemini-3.1-flash-live-preview',
    config: {
      responseModalities: ['AUDIO'],
      systemInstruction: { parts: [{ text: largeText }] }
    }
  });

  const aiClient = new GoogleGenAI({ apiKey: tokenResponse.name, httpOptions: { apiVersion: 'v1alpha' } });
  
  // Connect WITHOUT passing systemInstruction!
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
  
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "what is the secret code?" }] }],
    turnComplete: true
  });
  
  await new Promise(r => setTimeout(r, 5000));
}
run();
