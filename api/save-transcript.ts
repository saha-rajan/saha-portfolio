export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  let transcript = "";

  // Handle both stringified JSON and automatically parsed JSON
  if (typeof req.body === 'string') {
    try { transcript = JSON.parse(req.body).transcript; } catch(e) {}
  } else if (req.body) {
    transcript = req.body.transcript;
  }

  if (!transcript) {
    return res.status(400).json({ error: "No transcript provided", receivedBody: req.body });
  }

  if (!accessKey) {
    return res.status(200).json({ success: true, message: "Logged locally" });
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: accessKey.trim(), // Ensure no weird spaces
        subject: "New Chakku Conversation Transcript",
        from_name: "Chakku AI",
        message: `A visitor just finished a conversation with Chakku on your portfolio.\n\nHere is what they said:\n\n${transcript}`
      })
    });

    const result = await response.json();
    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      // Return exactly what Web3Forms complained about!
      return res.status(500).json({ error: "Web3Forms Error", details: result });
    }
  } catch (error: any) {
    console.error("Transcription error:", error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
