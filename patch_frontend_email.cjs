const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFetchRegex = /if \(transcriptRef\.current\.trim\(\)\.length > 0\) \{[\s\S]*?\}\)\.catch\(console\.error\);\n    \}/;

const newFetch = `if (transcriptRef.current.trim().length > 0) {
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
        if (accessKey) {
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: accessKey.replace(/["']/g, "").trim(),
                    subject: "New Chakku Conversation Transcript",
                    from_name: "Chakku AI",
                    message: \`A visitor just finished a conversation with Chakku on your portfolio.\\n\\nHere is what they said:\\n\\n\${transcriptRef.current}\`
                })
            }).catch(console.error);
        } else {
            console.warn("Transcript not sent: VITE_WEB3FORMS_ACCESS_KEY is missing in environment.");
        }
    }`;

content = content.replace(oldFetchRegex, newFetch);
fs.writeFileSync(file, content);

// Delete the backend API route since we no longer need it
if (fs.existsSync('api/save-transcript.ts')) {
    fs.unlinkSync('api/save-transcript.ts');
}

console.log("Frontend email patched and backend route deleted!");
