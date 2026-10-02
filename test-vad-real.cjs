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
  
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "Context Update" }] }],
    turnComplete: false
  });
  
  // Send proper turnComplete true to FORCE a turn
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "Hello, reply to me now." }] }],
    turnComplete: true
  });
  
  await new Promise(r => setTimeout(r, 5000));
  console.log("No reply after 5s");
  process.exit(0);
}
run();
