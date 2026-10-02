const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
async function test() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
  const apiKey = match[1].trim();
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  const model = 'gemini-3.1-flash-live-preview';
  
  try {
    console.log(`Testing model: ${model}`);
    const session = await ai.live.connect({
      model,
      config: { responseModalities: ['AUDIO'] },
      callbacks: {
        onmessage: (msg) => console.log("Got message"),
        onclose: (e) => {
          console.log(`[${model}] WS Closed:`, e.code, e.reason);
          process.exit(1);
        },
        onerror: (e) => console.error(`[${model}] WS Error`)
      }
    });
    console.log(`[${model}] Connected successfully!`);
    session.sendClientContent({ turns: [{ role: "user", parts: [{ text: "Hello" }] }], turnComplete: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log("Session stayed alive for 2 seconds without 1011 drop!");
  } catch (e) {
    console.error(`[${model}] Connect Failed:`, e.message);
  }
  process.exit(0);
}
test();
