import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Pre-load knowledge base content
let portfolioKnowledge = '';
try {
  const kbDir = path.join(process.cwd(), 'portfolio-knowledge');
  const files = fs.readdirSync(kbDir).filter(file => file.endsWith('.md'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(kbDir, file), 'utf-8');
    portfolioKnowledge += `\n\n--- FILE: ${file} ---\n${content}`;
  }
} catch (error) {
  console.error('Error loading portfolio knowledge:', error);
}

const SYSTEM_INSTRUCTION = `You are Chakku, an intelligent JARVIS-like AI guide embedded directly within Saha Rajan's portfolio website.

Your Role:
- You converse naturally with visitors and intelligently control the website interface on their behalf.
- When they ask to see something, you can navigate them to the right page, scroll to a section, or highlight elements using action commands.
- You are concise, warm, technically comfortable, and highly capable.

Portfolio Context:
${portfolioKnowledge}

Current Visitor Context:
You will receive the visitor's current route and active section in their prompt. Use this to understand what they are currently looking at (e.g. if they say "What is this?", refer to their active section).

Rules for Actions:
1. You can return an array of actions to execute on the website.
2. Valid action types: NAVIGATE, SCROLL_TO, SCROLL_DIR, HIGHLIGHT, NO_ACTION.
3. NAVIGATE payload: { path: string } (e.g. "/works/aisle", "/", "/about").
4. SCROLL_TO payload: { sectionId: string } (e.g. "research", "design", "problem", "hero").
5. SCROLL_DIR payload: { direction: "up" | "down", amount: "small" | "large" }.
6. HIGHLIGHT payload: { elementId: string }. Use this to temporarily focus a project card or section ID.
7. Only issue actions if they make sense. Don't force navigation if they just asked a question.
8. If the user says something indicating they want to end the voice session (e.g., "stop listening", "that's all", "goodbye"), set "endSession" to true.

Output Format:
You MUST return a valid JSON object matching this schema:
{
  "speech": "Text that will be spoken to the user.",
  "actions": [
    { "type": "NAVIGATE", "payload": { "path": "/works/aisle" } }
  ],
  "endSession": false
}`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
        if (match) apiKey = match[1].trim();
      }
    } catch (e) {
      console.error('Failed to read .env.local:', e);
    }
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  const { message, history, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Inject context into the user's latest message
    const contextString = context ? `[System: The visitor is currently at route '${context.route}' and viewing section '${context.activeSection}'.] ` : '';
    const augmentedMessage = contextString + message;

    let contents = [];
    if (history && Array.isArray(history) && history.length > 0) {
      contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: augmentedMessage }] });
    } else {
      contents = [{ role: 'user', parts: [{ text: augmentedMessage }] }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    try {
      const parsed = JSON.parse(response.text);
      return res.status(200).json({ 
        success: true, 
        response: parsed
      });
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", response.text);
      return res.status(500).json({ error: 'Invalid JSON response from AI' });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to communicate with Gemini API',
      details: error.message 
    });
  }
}
