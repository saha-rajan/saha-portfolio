import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MicOff, Mic, Info } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AudioStreamer, AudioPlayer } from '../utils/audioProcessing';

type ChakkuMode = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface ChakkuContextType {
  isSessionActive: boolean;
  mode: ChakkuMode;
  startSession: () => void;
  stopSession: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  errorMsg?: string;
}

const ChakkuContext = createContext<ChakkuContextType | undefined>(undefined);

export function ChakkuProvider({ children }: { children: ReactNode }) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<ChakkuMode>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  const sessionRef = useRef<any>(null);
  const streamerRef = useRef<AudioStreamer | null>(null);
  const transcriptRef = useRef<string>('');
  const chakkuTextBufferRef = useRef<string>('');
  const recognitionRef = useRef<any>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  
  // Track location changes to send context to Gemini Live
    // Removed context auto-updater because sendClientContent interrupts the AI's audio stream during tool-triggered navigations/scrolls.
  const executeActionSequence = async (calls: any[]) => {
    for (const call of calls) {
      const name = call.name;
      const args = call.args;
      
      console.log(`[LIVE_DEBUG] Live tool call received: ${name}`);
      console.log(`[LIVE_DEBUG] Validated arguments: ${JSON.stringify(args)}`);
      console.log(`[LIVE_DEBUG] Current route: ${location.pathname}, active section: ${activeSection}`);
      console.log(`[LIVE_DEBUG] Execution attempted for: ${name}`);
      
      let success = true;
      try {
        switch (name) {
          case 'NAVIGATE':
            if (args.path) {
              navigate(args.path);
              window.scrollTo({ top: 0, behavior: 'smooth' });
               
            }
            break;
          case 'SCROLL_TO':
            if (args.sectionId === 'hero' || args.sectionId === 'top') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (args.sectionId === 'bottom') {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
              const el = document.getElementById(args.sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              else success = false;
            }
            
            break;
          case 'SCROLL':
            const amt = args.amount === 'large' ? 800 : 300;
            const dir = args.direction === 'up' ? -amt : amt;
            window.scrollBy({ top: dir, behavior: 'smooth' });
            
            break;
          case 'HIGHLIGHT':
            const target = document.getElementById(args.elementId);
            if (target) {
              target.classList.add('chakku-highlight');
              setTimeout(() => target.classList.remove('chakku-highlight'), 3000);
            } else {
              success = false;
            }
            break;
          case 'GO_BACK':
            navigate(-1);
            
            break;
          default:
            success = false;
        }
        
        console.log(`[LIVE_DEBUG] Execution success/failure: ${success ? 'SUCCESS' : 'FAILED'}`);
        
        // Respond to the tool call
        if (sessionRef.current) {
           console.log(`[LIVE_DEBUG] Tool response sent for ${name}`);
           sessionRef.current.sendToolResponse({
             functionResponses: [{
               id: call.id,
               name: name,
               response: { success: success }
             }]
           });
        }
      } catch (err: any) {
        console.error(`[LIVE_DEBUG] Tool execution failed: `, err);
        if (sessionRef.current) {
           sessionRef.current.sendToolResponse({
             functionResponses: [{
               id: call.id,
               name: name,
               response: { success: false, error: err.message }
             }]
           });
        }
      }
    }
  };

  const startSession = async () => {
    setIsSessionActive(true);
    setMode('thinking');
    setErrorMsg('');
    
    // Create Audio contexts synchronously during the user gesture!
    if (!playerRef.current) {
      playerRef.current = new AudioPlayer();
    }
    // Also synchronously create streamer to capture user gesture
    if (!streamerRef.current) {
      streamerRef.current = new AudioStreamer(() => {});
    }
    // Force resume immediately
    playerRef.current.resume();
    
    try {
      const res = await fetch('/api/live-token');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Token fetch failed');
      const ai = new GoogleGenAI({ apiKey: data.token, httpOptions: { apiVersion: 'v1alpha' } });
      const session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: { 
          responseModalities: ['AUDIO'],
          systemInstruction: { parts: [{ text: data.systemInstruction }] },
          tools: data.tools
        },
        callbacks: {
          onmessage: (msg: any) => {
            if (msg.serverContent) {
               if (msg.serverContent.modelTurn) {
                 const modelTurn = msg.serverContent.modelTurn;
                 if (modelTurn && modelTurn.parts) {
                   for (const part of modelTurn.parts) {
                     if (part.text) {
                         chakkuTextBufferRef.current += part.text;
                     }
                     if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                        setMode('speaking');
                        playerRef.current?.play(part.inlineData.data);
                     }
                   }
                 }
               }
               
               if (msg.serverContent.turnComplete) {
                   if (chakkuTextBufferRef.current.trim().length > 0) {
                       transcriptRef.current += `\nChakku: ${chakkuTextBufferRef.current.trim()}\n`;
                       chakkuTextBufferRef.current = "";
                   }
               }
               
               if (msg.serverContent.interrupted) {
                 if (chakkuTextBufferRef.current.trim().length > 0) {
                     transcriptRef.current += `\nChakku: ${chakkuTextBufferRef.current.trim()} [interrupted]\n`;
                     chakkuTextBufferRef.current = "";
                 }
                 playerRef.current?.interrupt();
                 setMode('listening');
               }
            } else {
               }
            
            if (msg.toolCall) {
               executeActionSequence(msg.toolCall.functionCalls);
            }
          },
          onclose: (e: any) => {
            setMode('error');
            setErrorMsg(`WS Closed: ${e?.code} ${e?.reason}`);
            // stopSession(); // Disable auto-stop so we can see the error
          },
          onerror: (e: any) => {
            console.error('[LIVE_DEBUG] Live error:', e);
            setMode('error');
            setErrorMsg('WS Error: ' + (e?.message || 'Unknown'));
          }
        }
      });
      sessionRef.current = session;
      
      // Send initial page context
      session.sendClientContent({
          turns: [{
            role: "user",
            parts: [{ text: `[Context Update: User is currently on route '${location.pathname}' at section '${activeSection}']` }]
          }],
          turnComplete: false
      }); window.__chakku_session = session; window.__chakku_session = session;
      
      let firstChunk = false;
      // Update the streamer callback
      streamerRef.current.onAudioData = (base64Audio: string) => {
         if (!streamerRef.current?.isMuted && sessionRef.current) {
            sessionRef.current.sendRealtimeInput({
                 audio: {
                   mimeType: "audio/pcm;rate=16000",
                   data: base64Audio
                 }
            });
         }
      };
      await streamerRef.current.start();
      setMode('listening');

      // Setup silent dictation for logging
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                transcriptRef.current += `\nVisitor: ${event.results[i][0].transcript.trim()}\n`;
              }
            }
          };
          recognition.onend = () => {
             // Browser might stop it if silent, try restarting if session is still active
             try { recognition.start(); } catch(e) {}
          };
          recognition.start();
          recognitionRef.current = recognition;
        }
      } catch(e) { console.error("Dictation error", e); }

    } catch(e: any) {
      console.error("[LIVE_DEBUG] Chakku session initialization exception:", e);
      setMode('error');
      setErrorMsg(e.message || 'Initialization failed');
    }
  };

  const stopSession = () => {
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
    
    // Flush any pending Chakku text before sending
    if (chakkuTextBufferRef.current.trim().length > 0) {
        transcriptRef.current += `\nChakku: ${chakkuTextBufferRef.current.trim()} [hung up]\n`;
        chakkuTextBufferRef.current = "";
    }

    if (transcriptRef.current.trim().length > 0) {
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
                    message: `A visitor just finished a conversation with Chakku on your portfolio.\n\nHere is what they said:\n\n${transcriptRef.current}`
                })
            }).catch(console.error);
        } else {
            console.warn("Transcript not sent: VITE_WEB3FORMS_ACCESS_KEY is missing in environment.");
        }
    }
    transcriptRef.current = '';
    
    sessionRef.current = null;
    streamerRef.current = null;
    playerRef.current = null;
  };

  
  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (playerRef.current) {
         if (next) playerRef.current.interrupt(); // mute stops current audio
         // Actually, if we want to mute the MIC, we'd stop the streamer or pause it.
         // Let's implement mic mute since that's usually what users mean.
         if (streamerRef.current) {
            streamerRef.current.isMuted = next;
         }
      }
      return next;
    });
  };

  return (
    <ChakkuContext.Provider value={{ isSessionActive, mode, startSession, stopSession, isMuted, toggleMute, errorMsg }}>
      {children}
    </ChakkuContext.Provider>
  );
}

export function useChakku() {
  const context = useContext(ChakkuContext);
  if (!context) throw new Error("useChakku must be used within ChakkuProvider");
  return context;
}

export function ChakkuOverlay() {
  const { isSessionActive, mode, stopSession, isMuted, toggleMute } = useChakku();
  const context = useChakku() as any;

  return (
    <AnimatePresence>
      {isSessionActive && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-[200] flex justify-center px-4 pointer-events-none"
        >
          <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-6 w-fit pointer-events-auto flex flex-col gap-3">
            <div className="flex items-center gap-6">
              <span className="text-[11px] tracking-widest uppercase text-white/80 flex items-center gap-2 relative group cursor-help" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <span className="text-white/40">✦</span> CHAKKU · {mode} {mode === 'error' && context.errorMsg ? ` [${context.errorMsg}]` : ''}
                <Info size={14} className="text-white/40 group-hover:text-white/80 ml-1 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] bg-[#1a1a1a] text-white/80 text-[10px] tracking-normal p-2.5 rounded-lg border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center leading-relaxed font-sans normal-case z-50">
                  Conversations with Chakku are anonymously transcribed to help improve this portfolio.
                </div>
              </span>
              <div className="flex items-center gap-1 ml-4">
                <button onClick={toggleMute} className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${isMuted ? 'text-red-400' : 'text-white/40 hover:text-white'}`} title="Mute Microphone">
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button onClick={stopSession} className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Exit">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
