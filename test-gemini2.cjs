const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
async function test() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
  const apiKey = match[1].trim();
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
  
  let portfolioKnowledge = '';
  const kbDir = './portfolio-knowledge';
  const criticalFiles = ['resume.md', 'chemobuddy.md', 'aisle.md', 'aura.md', 'guardrails.md'];
  for (const file of criticalFiles) {
    if (fs.existsSync(`${kbDir}/${file}`)) {
      portfolioKnowledge += `\n\n--- FILE: ${file} ---\n` + fs.readFileSync(`${kbDir}/${file}`, 'utf-8');
    }
  }

  const SYSTEM_INSTRUCTION = `You are Chakku... Portfolio Knowledge:\n${portfolioKnowledge}`;
  
  const model = 'gemini-3.1-flash-live-preview';
  
  try {
    const tokenResponse = await ai.authTokens.create({
      model,
      config: {
        responseModalities: ['AUDIO'],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        tools: [{ functionDeclarations: [{ name: "NAVIGATE", description: "Navigate", parameters: { type: "OBJECT", properties: { path: { type: "STRING" } } } }] }]
      }
    });
    
    console.log("Token generated:", tokenResponse.name);
    
    const aiClient = new GoogleGenAI({ apiKey: tokenResponse.name, httpOptions: { apiVersion: 'v1alpha' } });
    const session = await aiClient.live.connect({
      model,
      config: {
        responseModalities: ['AUDIO'],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        tools: [{ functionDeclarations: [{ name: "NAVIGATE", description: "Navigate", parameters: { type: "OBJECT", properties: { path: { type: "STRING" } } } }] }]
      },
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
    await new Promise(r => setTimeout(r, 2000));
    console.log("Success! No 1011 drop.");
  } catch (e) {
    console.error(`[${model}] Connect Failed:`, e.message);
  }
  process.exit(0);
}
test();
