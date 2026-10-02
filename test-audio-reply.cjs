async function run() {
  try {
    const res = await fetch('http://localhost:5174/api/live-token');
    const data = await res.json();
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey: data.token, httpOptions: { apiVersion: 'v1alpha' } });
    
    const session = await ai.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: ['AUDIO'],
        systemInstruction: { parts: [{ text: data.systemInstruction }] },
        tools: data.tools
      },
      callbacks: {
        onmessage: (msg) => {
          console.log("Got message!");
          if (msg.serverContent && msg.serverContent.modelTurn) {
             console.log("Model replied with turn!");
             process.exit(0);
          }
        },
        onclose: (e) => { console.log("WS Closed:", e.code); process.exit(1); }
      }
    });
    console.log("Connected");
    
    // Send 3 seconds of dummy silence
    for(let i=0; i<30; i++) {
        const dummyAudio = Buffer.alloc(1600).toString('base64');
        session.sendRealtimeInput([{ mimeType: "audio/pcm;rate=16000", data: dummyAudio }]);
        await new Promise(r => setTimeout(r, 100));
    }
    console.log("Sent dummy audio, waiting for reply...");
    
    await new Promise(r => setTimeout(r, 10000));
    console.log("No reply after 10s");
  } catch(e) { console.error(e); }
  process.exit(0);
}
run();
