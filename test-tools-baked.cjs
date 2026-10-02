async function run() {
  const { GoogleGenAI } = require('@google/genai');
  const fs = require('fs');
  const apiKey = fs.readFileSync('.env.local', 'utf-8').match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  const tokenResponse = await ai.authTokens.create({
    model: 'gemini-3.1-flash-live-preview',
    config: {
      systemInstruction: { parts: [{ text: "Call the GET_WEATHER tool." }] },
      tools: [{ functionDeclarations: [{ name: "GET_WEATHER", description: "Gets weather", parameters: { type: "OBJECT", properties: { loc: {type: "STRING"} } } }] }]
    }
  });

  const aiClient = new GoogleGenAI({ apiKey: tokenResponse.name, httpOptions: { apiVersion: 'v1alpha' } });
  
  const session = await aiClient.live.connect({
    model: 'gemini-3.1-flash-live-preview',
    config: { },
    callbacks: {
      onmessage: (msg) => {
        if (msg.toolCall) {
           console.log("TOOL CALLED!");
           process.exit(0);
        }
      }
    }
  });
  
  session.sendClientContent({
    turns: [{ role: "user", parts: [{ text: "what is the weather?" }] }],
    turnComplete: true
  });
  
  await new Promise(r => setTimeout(r, 5000));
}
run();
