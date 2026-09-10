import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MicOff, Mic } from 'lucide-react';
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
                     if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                        setMode('speaking');
                        playerRef.current?.play(part.inlineData.data);
                     }
                   }
                 }
               }
               if (msg.serverContent.interrupted) {
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
              <span className="text-[11px] tracking-widest uppercase text-white/80 flex items-center gap-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <span className="text-white/40">✦</span> CHAKKU · {mode} {mode === 'error' && context.errorMsg ? ` [${context.errorMsg}]` : ''}
              </span>
              <button onClick={toggleMute} className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${isMuted ? 'text-red-400' : 'text-white/40 hover:text-white'}`} title="Mute Microphone">
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button onClick={stopSession} className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Exit">
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
