import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Connection test
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
    });
    
    return res.status(200).json({ 
      success: true, 
      response: response.text 
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to communicate with Gemini API',
      details: error.message 
    });
  }
}
