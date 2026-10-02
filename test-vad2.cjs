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
      },
      onclose: (e) => { console.log("WS Closed:", e.code); process.exit(1); }
    }
  });
  
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "Context Update" }] }],
    turnComplete: false
  });
  
  // Now send true!
  setTimeout(() => {
     session.sendClientContent({ turns: [], turnComplete: true });
  }, 1000);
  
  await new Promise(r => setTimeout(r, 5000));
  console.log("No reply after 5s");
  process.exit(0);
}
run();
