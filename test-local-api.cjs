async function test() {
  try {
    const res = await fetch('http://localhost:5174/api/live-token');
    const data = await res.json();
    console.log("Token generated:", data.token.substring(0, 20) + "...");
    
    const { GoogleGenAI } = require('@google/genai');
    const aiClient = new GoogleGenAI({ apiKey: data.token, httpOptions: { apiVersion: 'v1alpha' } });
    const session = await aiClient.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: ['AUDIO'],
        generationConfig: {
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Puck"
              }
            }
          }
        },
        systemInstruction: { parts: [{ text: data.systemInstruction }] },
        tools: data.tools
      },
      callbacks: {
        onmessage: () => {},
        onclose: (e) => { console.log("WS Closed:", e.code); process.exit(1); }
      }
    });
    console.log("Connected successfully to Live API using local API token!");
    await new Promise(r => setTimeout(r, 2000));
    console.log("Success! No 1011 drop.");
  } catch(e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
test();
