const WebSocket = require('ws');
const fs = require('fs');
async function run() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
  const { GoogleGenAI } = require('@google/genai');
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  const tokenResponse = await ai.authTokens.create({
    model: 'gemini-3.1-flash-live-preview',
    config: { responseModalities: ['AUDIO'] }
  });
  
  const ws = new WebSocket(`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`, {
    headers: { 'Authorization': `Bearer ${tokenResponse.name}` }
  });
  
  ws.on('open', () => {
    console.log("WS Opened");
    ws.send(JSON.stringify({
      "setup": {
        "model": "models/gemini-3.1-flash-live-preview",
        "generationConfig": { "responseModalities": ["AUDIO"] }
      }
    }));
  });
  ws.on('message', (data) => console.log("Received:", data.toString()));
  ws.on('close', (code, reason) => { console.log(`WS Closed: ${code} ${reason}`); process.exit(1); });
}
run();
