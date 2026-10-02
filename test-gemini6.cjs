const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
async function test() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  const model = 'gemini-3.1-flash-live-preview';
  try {
    const tokenResponse = await ai.authTokens.create({
      model,
      config: { responseModalities: ['AUDIO'] }
    });
    const aiClient = new GoogleGenAI({ apiKey: tokenResponse.name, httpOptions: { apiVersion: 'v1alpha' } });
    const session = await aiClient.live.connect({
      model,
      config: { responseModalities: ['AUDIO'] },
      callbacks: {
        onmessage: () => {},
        onclose: (e) => { console.log(`WS Closed:`, e.code); process.exit(1); }
      }
    });
    console.log("Connected");
    session.sendClientContent({
      turns: [{ role: "user", parts: [{ text: `[Context Update]` }] }],
      turnComplete: false
    });
    await new Promise(r => setTimeout(r, 2000));
    console.log("Success");
  } catch(e) { console.error("Error", e); }
  process.exit(0);
}
test();
