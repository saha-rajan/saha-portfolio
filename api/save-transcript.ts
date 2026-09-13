export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use the secret key securely from the backend environment variables
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "No transcript provided" });
  }

  if (!accessKey) {
    // If you haven't added the key to Vercel yet, it will just log to the server console safely
    console.log("----------------------------------------");
    console.log("CHAKKU TRANSCRIPT LOGGED LOCALLY (No Web3Forms key found):");
    console.log(transcript);
    console.log("----------------------------------------");
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
        access_key: accessKey,
        subject: "New Chakku Conversation Transcript",
        from_name: "Chakku AI",
        message: `A visitor just finished a conversation with Chakku on your portfolio.\n\nHere is what they said:\n\n${transcript}`
      })
    });

    const result = await response.json();
    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Failed to send email" });
    }
  } catch (error: any) {
    console.error("Transcription error:", error);
    return res.status(500).json({ error: error.message });
  }
}
