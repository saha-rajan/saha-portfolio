const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add refs for transcript
if (!content.includes('transcriptRef')) {
  content = content.replace(
    /const streamerRef = useRef<AudioStreamer \| null>\(null\);/,
    "const streamerRef = useRef<AudioStreamer | null>(null);\n  const transcriptRef = useRef<string>('');\n  const recognitionRef = useRef<any>(null);"
  );
}

// 2. Add SpeechRecognition logic to startSession
if (!content.includes('window.webkitSpeechRecognition')) {
  content = content.replace(
    /setMode\('listening'\);\n\s*\} catch\(e: any\) \{/,
    `setMode('listening');\n\n      // Setup silent dictation for logging\n      try {\n        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;\n        if (SpeechRecognition) {\n          const recognition = new SpeechRecognition();\n          recognition.continuous = true;\n          recognition.interimResults = false;\n          recognition.onresult = (event: any) => {\n            for (let i = event.resultIndex; i < event.results.length; i++) {\n              if (event.results[i].isFinal) {\n                transcriptRef.current += event.results[i][0].transcript + "\\n";\n              }\n            }\n          };\n          recognition.onend = () => {\n             // Browser might stop it if silent, try restarting if session is still active\n             try { recognition.start(); } catch(e) {}\n          };\n          recognition.start();\n          recognitionRef.current = recognition;\n        }\n      } catch(e) { console.error("Dictation error", e); }\n\n    } catch(e: any) {`
  );
}

// 3. Add send logic to stopSession
if (!content.includes('/api/save-transcript')) {
  content = content.replace(
    /const stopSession = \(\) => \{[\s\S]*?playerRef\.current = null;\n  \};/,
    `const stopSession = () => {
    setIsSessionActive(false);
    setMode('idle');
    if (streamerRef.current) streamerRef.current.stop();
    if (playerRef.current) playerRef.current.interrupt();
    if (sessionRef.current) {
       try { sessionRef.current.close(); } catch(e) {}
    }
    
    // Stop recognition and send transcript
    if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        try { recognitionRef.current.stop(); } catch(e) {}
    }
    
    if (transcriptRef.current.trim().length > 0) {
        fetch('/api/save-transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: transcriptRef.current })
        }).catch(console.error);
    }
    transcriptRef.current = '';
    
    sessionRef.current = null;
    streamerRef.current = null;
    playerRef.current = null;
  };`
  );
}

// 4. Add disclaimer to UI
if (!content.includes('Conversations with Chakku are transcribed')) {
  content = content.replace(
    /<\/div>\n          <\/div>\n        <\/motion\.div>/,
    `</div>\n            <span className="text-[10px] text-white/30 text-center mx-auto block w-full">\n              Conversations with Chakku are transcribed to help improve this portfolio.\n            </span>\n          </div>\n        </motion.div>`
  );
}

fs.writeFileSync(file, content);
console.log("Patched ChakkuContext.tsx!");
