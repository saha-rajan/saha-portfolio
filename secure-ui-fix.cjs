const fs = require('fs');

// 1. Update AudioPlayer
let audioContent = fs.readFileSync('src/app/utils/audioProcessing.ts', 'utf-8');
audioContent = audioContent.replace(/private currentSources: AudioBufferSourceNode\[\] = \[\];/, "private currentSources: AudioBufferSourceNode[] = [];\n  public onPlaybackComplete?: () => void;");
audioContent = audioContent.replace(/this\.currentSources = this\.currentSources\.filter\(s => s !== source\);/, "this.currentSources = this.currentSources.filter(s => s !== source);\n      if (this.currentSources.length === 0) {\n         setTimeout(() => {\n           if (this.currentSources.length === 0 && this.onPlaybackComplete) {\n             this.onPlaybackComplete();\n           }\n         }, 300);\n      }");
audioContent = audioContent.replace(/this\.nextPlayTime = this\.audioContext\.currentTime;/, "this.nextPlayTime = this.audioContext.currentTime;\n    if (this.onPlaybackComplete) this.onPlaybackComplete();");
fs.writeFileSync('src/app/utils/audioProcessing.ts', audioContent);

// 2. Update ChakkuContext.tsx
let chakkuContent = fs.readFileSync('src/app/contexts/ChakkuContext.tsx', 'utf-8');
chakkuContent = chakkuContent.replace(/type ChakkuMode = 'idle' \| 'listening' \| 'thinking' \| 'speaking' \| 'error';/, "type ChakkuMode = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';");
chakkuContent = chakkuContent.replace(/setMode\('thinking'\);/, "setMode('connecting');");
chakkuContent = chakkuContent.replace(/playerRef\.current = new AudioPlayer\(\);/, "playerRef.current = new AudioPlayer();\n      playerRef.current.onPlaybackComplete = () => {\n        setMode(prev => (prev === 'speaking') ? 'listening' : prev);\n      };");
chakkuContent = chakkuContent.replace(/setMode\('listening'\);/, "setMode('listening');"); // keep as is
fs.writeFileSync('src/app/contexts/ChakkuContext.tsx', chakkuContent);
console.log("Done");
