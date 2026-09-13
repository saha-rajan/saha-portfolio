const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update imports
if (!content.includes('Info')) {
  content = content.replace(
    "import { X, MicOff, Mic } from 'lucide-react';",
    "import { X, MicOff, Mic, Info } from 'lucide-react';"
  );
}

// Replace the JSX block
const oldJSX = `<span className="text-[11px] tracking-widest uppercase text-white/80 flex items-center gap-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <span className="text-white/40">✦</span> CHAKKU · {mode} {mode === 'error' && context.errorMsg ? \` [\${context.errorMsg}]\` : ''}
              </span>
              <button onClick={toggleMute} className={\`p-1.5 rounded-full hover:bg-white/10 transition-colors \${isMuted ? 'text-red-400' : 'text-white/40 hover:text-white'}\`} title="Mute Microphone">
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button onClick={stopSession} className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Exit">
                <X size={16} />
              </button>
            </div>
            <span className="text-[10px] text-white/30 text-center mx-auto block w-full">
              Conversations with Chakku are transcribed to help improve this portfolio.
            </span>
          </div>`;

const newJSX = `<span className="text-[11px] tracking-widest uppercase text-white/80 flex items-center gap-2 relative group cursor-help" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <span className="text-white/40">✦</span> CHAKKU · {mode} {mode === 'error' && context.errorMsg ? \` [\${context.errorMsg}]\` : ''}
                <Info size={14} className="text-white/40 group-hover:text-white/80 ml-1 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] bg-[#1a1a1a] text-white/80 text-[10px] tracking-normal p-2.5 rounded-lg border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center leading-relaxed font-sans normal-case z-50">
                  Conversations with Chakku are anonymously transcribed to help improve this portfolio.
                </div>
              </span>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={toggleMute} className={\`p-1.5 rounded-full hover:bg-white/10 transition-colors \${isMuted ? 'text-red-400' : 'text-white/40 hover:text-white'}\`} title="Mute Microphone">
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button onClick={stopSession} className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Exit">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>`;

content = content.replace(oldJSX, newJSX);
fs.writeFileSync(file, content);
console.log("UI Updated!");
