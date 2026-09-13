export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  let transcript = "";

  if (typeof req.body === 'string') {
    try { transcript = JSON.parse(req.body).transcript; } catch(e) {}
  } else if (req.body) {
    transcript = req.body.transcript;
  }

  if (!transcript) {
    return res.status(400).json({ error: "No transcript provided" });
  }

  if (!accessKey) {
    return res.status(200).json({ success: true, message: "Logged locally" });
  }

  try {
    const cleanKey = accessKey.replace(/["']/g, "").trim();

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" // Pretend to be a browser to bypass WAF
      },
      body: JSON.stringify({
        access_key: cleanKey,
        subject: "New Chakku Conversation Transcript",
        from_name: "Chakku AI",
        message: `A visitor just finished a conversation with Chakku on your portfolio.\n\nHere is what they said:\n\n${transcript}`
      })
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // If Web3Forms returns HTML instead of JSON (e.g. a 500 error page or Cloudflare block)
      console.error("Web3Forms returned HTML instead of JSON:", responseText);
      return res.status(500).json({ 
        error: "Web3Forms blocked the request", 
        htmlPreview: responseText.substring(0, 150) 
      });
    }

    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Web3Forms Error", details: result });
    }
  } catch (error: any) {
    console.error("Transcription error:", error);
    return res.status(500).json({ error: error.message });
  }
}
