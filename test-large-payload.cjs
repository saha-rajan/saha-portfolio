async function run() {
  const { GoogleGenAI } = require('@google/genai');
  const fs = require('fs');
  const apiKey = fs.readFileSync('.env.local', 'utf-8').match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const aiClient = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  // Generate 30KB of dummy knowledge
  const largeText = "Knowledge: " + "Saha is great. ".repeat(2000); // ~30KB
  
  try {
      const session = await aiClient.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: { 
            responseModalities: ['AUDIO'],
            systemInstruction: { parts: [{ text: largeText }] },
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
            }
        },
        callbacks: {
          onmessage: (msg) => {
            console.log("Got message!");
            process.exit(0);
          },
          onclose: (e) => { console.log("WS Closed:", e.code, e.reason); process.exit(1); }
        }
      });
      console.log("Connected successfully with 30KB payload!");
      
      session.sendClientContent({
        turns: [{ role: "user", parts: [{ text: "Hello" }] }],
        turnComplete: true
      });
      await new Promise(r => setTimeout(r, 5000));
  } catch(e) {
      console.error("Connection failed:", e);
  }
}
run();
