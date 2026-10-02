const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
async function test() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim();
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
  
  const tools = [{ functionDeclarations: [
    { name: "NAVIGATE", description: "Navigate", parameters: { type: "OBJECT", properties: { path: { type: "STRING" } } } },
    { name: "SCROLL_TO", description: "Scroll to", parameters: { type: "OBJECT", properties: { sectionId: { type: "STRING" } } } },
    { name: "HIGHLIGHT", description: "Highlight", parameters: { type: "OBJECT", properties: { elementId: { type: "STRING" } } } },
    { name: "SCROLL", description: "Scroll", parameters: { type: "OBJECT", properties: { direction: { type: "STRING" }, amount: { type: "STRING" } } } },
    { name: "GO_BACK", description: "Go back", parameters: { type: "OBJECT", properties: {} } },
    { name: "PLAY_AUDIO", description: "Play audio", parameters: { type: "OBJECT", properties: { target: { type: "STRING" } } } }
  ]}];

  const model = 'gemini-3.1-flash-live-preview';
  try {
    const tokenResponse = await ai.authTokens.create({
      model,
      config: { responseModalities: ['AUDIO'], systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] }, tools }
    });
    const aiClient = new GoogleGenAI({ apiKey: tokenResponse.name, httpOptions: { apiVersion: 'v1alpha' } });
    const session = await aiClient.live.connect({
      model,
      config: { responseModalities: ['AUDIO'], systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] }, tools },
      callbacks: {
        onmessage: () => {},
        onclose: (e) => { console.log(`WS Closed:`, e.code); process.exit(1); }
      }
    });
    console.log("Connected");
    await new Promise(r => setTimeout(r, 2000));
    console.log("Success");
  } catch(e) { console.error("Error", e); }
  process.exit(0);
}
test();
