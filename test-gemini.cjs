const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

async function test() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
  const apiKey = match[1].trim();
  
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  try {
    const tokenResponse = await ai.authTokens.create({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: ['AUDIO'],
        systemInstruction: { parts: [{ text: "You are Chakku, a JARVIS-like AI guide. This is a tiny prompt." }] }
      }
    });
    
    console.log("Token generated:", tokenResponse.name);
    
    const session = await ai.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: ['AUDIO'],
        systemInstruction: { parts: [{ text: "You are Chakku, a JARVIS-like AI guide. This is a tiny prompt." }] }
      },
      callbacks: {
        onmessage: (msg) => {
          console.log("Got message!");
        },
        onclose: (e) => {
          console.log("WS Closed:", e.code, e.reason);
          process.exit(1);
        },
        onerror: (e) => {
          console.error("WS Error:", e);
        }
      }
    });
    
    console.log("Connected successfully!");
    session.sendClientContent({ turns: [{ role: "user", parts: [{ text: "Hello" }] }], turnComplete: true });
    
    setTimeout(() => {
      console.log("Success! No immediate 1011 drop.");
      process.exit(0);
    }, 3000);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
