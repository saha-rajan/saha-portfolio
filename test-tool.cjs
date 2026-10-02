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
          if (msg.toolCall) {
            console.log("Got tool call:", JSON.stringify(msg.toolCall));
            msg.toolCall.functionCalls.forEach(call => {
              if (call.name === 'READ_PORTFOLIO_FILE') {
                console.log("Sending response...");
                session.sendToolResponse({
                  functionResponses: [{
                    id: call.id,
                    name: call.name,
                    response: { success: true, content: "Test content phone number 555-1234" }
                  }]
                });
              }
            });
          }
        },
        onclose: (e) => { console.log("WS Closed:", e.code); process.exit(1); }
      }
    });
    console.log("Connected");
    
    // Trigger it
    session.sendClientContent({
      turns: [{ role: "user", parts: [{ text: "What is Saha's phone number?" }] }],
      turnComplete: true
    });
    
    await new Promise(r => setTimeout(r, 4000));
    console.log("Success");
  } catch(e) { console.error(e); }
  process.exit(0);
}
run();
