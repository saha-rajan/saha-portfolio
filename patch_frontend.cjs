const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFetch = `    if (transcriptRef.current.trim().length > 0) {
        fetch('/api/save-transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: transcriptRef.current })
        }).catch(console.error);
    }`;

const newFetch = `    if (transcriptRef.current.trim().length > 0) {
        fetch('/api/save-transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: transcriptRef.current })
        }).then(async (res) => {
            if (!res.ok) {
                const errData = await res.json();
                console.error("Backend Error Details:", errData);
            }
        }).catch(console.error);
    }`;

content = content.replace(oldFetch, newFetch);
fs.writeFileSync(file, content);
console.log("Frontend patched!");
