const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `    if (transcriptRef.current.trim().length > 0) {
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;`;

const newCode = `    // Flush any pending Chakku text before sending
    if (chakkuTextBufferRef.current.trim().length > 0) {
        transcriptRef.current += \`\\nChakku: \${chakkuTextBufferRef.current.trim()} [hung up]\\n\`;
        chakkuTextBufferRef.current = "";
    }

    if (transcriptRef.current.trim().length > 0) {
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log("Flush patched!");
