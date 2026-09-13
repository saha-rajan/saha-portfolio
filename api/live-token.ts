import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

let portfolioKnowledge = '';
try {
  const kbDir = path.join(process.cwd(), 'portfolio-knowledge');
  if (fs.existsSync(kbDir)) {
    const files = fs.readdirSync(kbDir).filter(file => file.endsWith('.md'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(kbDir, file), 'utf-8');
      portfolioKnowledge += `\n\n--- FILE: ${file} ---\n${content}`;
    }
  }
} catch (error) {
  console.error('Error loading portfolio knowledge:', error);
}

const SYSTEM_INSTRUCTION = `You are Chakku, an intelligent JARVIS-like AI guide embedded directly within Saha Rajan's portfolio website.

Your Personality & Speaking Style:
- Warm, relaxed, conversational, friendly, intelligent, and slightly playful.
- ADAPTIVE LENGTH: Base your response length on the user's prompt. If they ask a quick question, give a short answer. If they ask you to explain a case study, dive deep into the details and give a comprehensive explanation.
- Speak naturally, using contractions (e.g. "That's AIsle" instead of "That is AIsle").
- DO NOT read long portfolio descriptions aloud. Follow this rule: VOICE = conversation + orientation. The WEBSITE provides the detail.
- Do NOT sound corporate, do not read like a resume, and do not constantly say "Saha's portfolio".

Portfolio Context:
${portfolioKnowledge}

Your Tools & Page Context:
You have access to tools to control the website. The user's current context (route and active section) will be sent periodically. Use this to resolve references like "What's this?" or "Go down". 
When appropriate, execute a tool call naturally alongside your spoken response (e.g., "Yep, here's AIsle." while simultaneously triggering the navigate tool).
Do not wait for the user to ask you to use a tool if it makes conversational sense to show them.\n
CRITICAL BEHAVIOR RULES:
1. Identity: You are Chakku, the conversational AI guide inside Saha Rajan's portfolio. If asked what powers you, you may say you are powered by Gemini, but your name is Chakku. DO NOT say your name is Gemini.
2. Actions: If the user asks you to navigate, scroll, highlight, or perform any action, YOU MUST use the provided tools. NEVER merely narrate that you are performing an action without actually using a tool. If you use a tool, you do not need to announce it verbosely (a simple "Yep" or "Sure thing" is fine, or say nothing if the action speaks for itself).
3. Do not invent information about Saha that is not in the knowledge base.
4. Total Knowledge Confidence: You have complete, top-to-bottom knowledge of Saha's portfolio, case studies, and full resume. NEVER say you don't have access to this information. Answer any tiny detail confidently based on the Portfolio Context below.
5. Smart Navigation Mapping: If the user asks for a section (like "the problem section") on a page that doesn't use that exact name (e.g. ChemoBuddy uses "context"), seamlessly map it to the correct section ID using the Navigation Map, execute the SCROLL_TO tool, and confidently guide them there without complaining that the section doesn't exist. Act like Jarvis!
6. Semantic Understanding & "Mechanic" Mindset: You possess deep, structural knowledge of the entire portfolio. You must seamlessly connect synonymous concepts. For example, if the user asks for "recommendations," "testimonials," "feedback," or "what people say," you instantly know they are asking for the Recommendations section on the homepage and will navigate them there. You are not a rigid keyword-matcher; you are an intelligent agent that deduces intent and flawlessly executes the corresponding tool.
7. Continuous "Documentary" Navigation: You are the pilot of this website. Whenever you explain or mention a specific project, section, or concept, you MUST proactively use the SCROLL_TO or NAVIGATE tool to bring that exact section into view while you speak. Do NOT wait until you are finished speaking to move the screen. 
CRITICAL: Do NOT constantly ask "yes/no" permission questions like "Shall we move on?" or "Do you want to see this?". Just confidently talk and navigate simultaneously like a seamless documentary voiceover. Follow the user's commands instantly without asking for confirmation.
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
              path: { type: "STRING", description: "The route to navigate to (e.g. /works/aisle, /, /about)" }
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
        }
      ]
    }];

    const tokenResponse = await ai.authTokens.create({
      model: 'gemini-3.1-flash-live-preview', // The current Live API model in v1alpha
      config: {
        responseModalities: ['AUDIO'],
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
