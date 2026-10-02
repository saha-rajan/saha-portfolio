import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

let portfolioKnowledge = '';
try {
  const knowledgeDir = path.join(process.cwd(), 'portfolio-knowledge');
  const filesToLoad = ['resume.md', 'chemobuddy.md', 'aisle.md', 'aura.md', 'guardrails.md'];
  for (const file of filesToLoad) {
    const filePath = path.join(knowledgeDir, file);
    if (fs.existsSync(filePath)) {
      portfolioKnowledge += '\n\n--- ' + file + ' ---\n\n';
      portfolioKnowledge += fs.readFileSync(filePath, 'utf-8');
    }
  }
} catch (error) {
  console.error('Error loading portfolio knowledge:', error);
}

const SYSTEM_INSTRUCTION = `You are Chakku, a JARVIS-like AI guide embedded in Saha Rajan's portfolio.

Personality: Warm, fast, and conversational. Use contractions. Do not sound corporate.

Identity Context:
- "Chakku" is Saha's personal nickname used by his family and friends. Saha chose this name for you so the portfolio feels personal, like an extension of himself guiding visitors, rather than a generic bot. You are not literally Saha; you are his AI guide.
- If asked about your name, explain this origin naturally and briefly.

CRITICAL RULES:
1. Be concise. Give quick, natural answers without rambling.
2. Basic Navigation: If the user asks to see a project, immediately use the NAVIGATE tool to take them there.
   VALID ROUTES (Use ONLY these paths for NAVIGATE):
   - /works/aisle for AIsle (IMPORTANT: ALWAYS use /works/aisle, NEVER use /works/aio)
   - /works/chemobuddy for ChemoBuddy
   - /works/aura for Aura
   - /about for About / Resume / Experience / Education
   - /contact for Contact
   - /studio for Studio / Experiments
   - / for Home
3. If asked to scroll or look at a section, use the SCROLL_TO or SCROLL tools immediately.
4. DO NOT announce your tool uses ("Let me pull that up..."). Just answer the question normally while the tool fires.
5. Only use the facts provided in the Portfolio Knowledge below. Do not invent details.
6. The ChemoBuddy case study has a special guided audio walkthrough narrated by Saha. If the user asks to play, hear, or listen to the ChemoBuddy audio, immediately use the PLAY_AUDIO tool.
7. Mirror the user's language. If the user speaks to you in Tamil, Hindi, Spanish, or any other language, you MUST reply in that exact same language.

Portfolio Knowledge:
${portfolioKnowledge}
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
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
    } catch (e) {}
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });

    // Tools definition for Live API
    const tools = [{
      functionDeclarations: [
        {
          name: "NAVIGATE",
          description: "Navigate to a different portfolio page.",
          parameters: {
            type: "OBJECT",
            properties: {
              path: { 
                type: "STRING", 
                enum: [
                  "/", 
                  "/about", 
                  "/contact", 
                  "/studio", 
                  "/works/chemobuddy", 
                  "/works/aisle", 
                  "/works/aura"
                ],
                description: "The exact route to navigate to." 
              }
            },
            required: ["path"]
          }
        },
        {
          name: "SCROLL_TO",
          description: "Scroll to a specific section on the current page.",
          parameters: {
            type: "OBJECT",
            properties: {
              sectionId: { type: "STRING", description: "The section ID to scroll to (e.g. research, design, problem)" }
            },
            required: ["sectionId"]
          }
        },
        {
          name: "HIGHLIGHT",
          description: "Temporarily highlight a specific project card or section.",
          parameters: {
            type: "OBJECT",
            properties: {
              elementId: { type: "STRING", description: "The element ID to highlight" }
            },
            required: ["elementId"]
          }
        },
        {
          name: "SCROLL",
          description: "Scroll the page up or down.",
          parameters: {
            type: "OBJECT",
            properties: {
              direction: { type: "STRING", enum: ["up", "down"] },
              amount: { type: "STRING", enum: ["small", "large"] }
            },
            required: ["direction", "amount"]
          }
        },
        {
          name: "GO_BACK",
          description: "Go back to the previous page.",
          parameters: {
            type: "OBJECT",
            properties: {}
          }
        },
        {
          name: "PLAY_AUDIO",
          description: "Play the guided audio walkthrough for a specific case study. Only supported for 'chemobuddy'.",
          parameters: {
            type: "OBJECT",
            properties: {
              target: { type: "STRING", enum: ["chemobuddy"] }
            },
            required: ["target"]
          }
        }
      ]
    }];

    const tokenResponse = await ai.authTokens.create({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Puck"
            }
          }
        },
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        tools: tools,
      }
    });

    return res.status(200).json({ 
      success: true, 
      token: tokenResponse.name,
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: tools
    });
  } catch (error: any) {
    console.error('Token Generation Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate Live session token',
      details: error.message 
    });
  }
}
