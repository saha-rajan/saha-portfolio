import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MicOff, Mic, Info, ArrowUp, Keyboard, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AudioStreamer, AudioPlayer } from '../utils/audioProcessing';

import resumeMd from '../../../portfolio-knowledge/resume.md?raw';
import chemobuddyMd from '../../../portfolio-knowledge/chemobuddy.md?raw';
import aisleMd from '../../../portfolio-knowledge/aisle.md?raw';
import auraMd from '../../../portfolio-knowledge/aura.md?raw';
import guardrailsMd from '../../../portfolio-knowledge/guardrails.md?raw';




type ChakkuMode = 'idle' | 'requesting-mic' | 'connecting' | 'listening' | 'speaking' | 'mic-blocked' | 'error';

// Why the microphone couldn't be opened — each gets its own fix-it instructions
type MicIssue = 'blocked' | 'dismissed' | 'os-blocked' | 'no-device' | 'in-use' | 'in-app' | 'unsupported' | 'unknown';

interface ChakkuContextType {
  isSessionActive: boolean;
  mode: ChakkuMode;
  startSession: () => void;
  startTextSession: () => void;
  stopSession: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  errorMsg?: string;
  micIssue: MicIssue | null;
  inputMode: 'voice' | 'text';
  sendText: (text: string) => void;
}

const isInAppBrowser = () => /Instagram|FBAN|FBAV|LinkedInApp|Line\/|Twitter|Snapchat|TikTok/i.test(navigator.userAgent);

function classifyMicError(e: any): MicIssue {
  if (isInAppBrowser()) return 'in-app';
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) return 'unsupported';
  const name = e?.name || '';
  const message = String(e?.message || '').toLowerCase();
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
    if (message.includes('system')) return 'os-blocked'; // Chrome: "Permission denied by system"
    if (message.includes('dismissed')) return 'dismissed';
    return 'blocked';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'OverconstrainedError') return 'no-device';
  if (name === 'NotReadableError' || name === 'TrackStartError' || name === 'AbortError') return 'in-use';
  return 'unknown';
}

const ChakkuContext = createContext<ChakkuContextType | undefined>(undefined);

export function ChakkuProvider({ children }: { children: ReactNode }) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<ChakkuMode>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [micIssue, setMicIssue] = useState<MicIssue | null>(null);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  const sessionRef = useRef<any>(null);
  const streamerRef = useRef<AudioStreamer | null>(null);
  const transcriptRef = useRef<string>('');
  const isConnectingRef = useRef<boolean>(false);
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
      let resultData: any = null;
      try {
        switch (name) {
          case 'NAVIGATE':
            if (args.path) {
              const rawPath = args.path.toLowerCase().trim();
              let targetPath = rawPath;
              
              // Normalize aliases and common LLM hallucinations
              if (rawPath === '/works/aio' || rawPath === '/aio' || rawPath === '/works/isle' || rawPath === '/aisle' || rawPath === 'aisle') {
                targetPath = '/works/aisle';
              } else if (rawPath === '/works/chemo' || rawPath === '/works/chemo-buddy' || rawPath === '/chemobuddy' || rawPath === 'chemobuddy') {
                targetPath = '/works/chemobuddy';
              } else if (rawPath === '/works/aura' || rawPath === '/aura' || rawPath === 'aura') {
                targetPath = '/works/aura';
              } else if (rawPath === '/resume' || rawPath === '/experience' || rawPath === '/education' || rawPath === '/skills') {
                targetPath = '/about';
              } else if (rawPath === '/reach-out' || rawPath === '/email') {
                targetPath = '/contact';
              } else if (rawPath === '/experiments' || rawPath === '/lab') {
                targetPath = '/studio';
              } else if (rawPath === '/home' || rawPath === '/work' || rawPath === '/works') {
                targetPath = '/';
              }
              
              // Ensure path has leading slash
              if (!targetPath.startsWith('/')) {
                targetPath = '/' + targetPath;
              }

              // Validate against known routes
              const validRoutes = ['/', '/about', '/contact', '/studio', '/works/chemobuddy', '/works/aisle', '/works/aura', '/works/arizona-yoga-studio', '/works/art-gallery', '/works/e-commerce'];
              
              if (validRoutes.includes(targetPath)) {
                navigate(targetPath);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                console.warn(`[LIVE_DEBUG] Unrecognized navigation path: ${targetPath}`);
                // Instead of crashing the router, fallback to failure
                success = false;
              }
            }
            break;
          case 'SCROLL_TO':
            if (args.sectionId === 'hero' || args.sectionId === 'top') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (args.sectionId === 'bottom') {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
              const cleanId = String(args.sectionId).toLowerCase().trim().replace(/\s+/g, '-');
              const el = document.getElementById(cleanId) || document.getElementById(args.sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          case 'PLAY_AUDIO':
            if (args.target === 'chemobuddy') {
              if (location.pathname !== '/works/chemobuddy') {
                navigate('/works/chemobuddy');
              }
              // Wait for navigation/render then dispatch audio trigger
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('chakku-play-audio', { detail: { target: 'chemobuddy' } }));
              }, 500);

              // Mute Chakku's microphone so it doesn't talk to itself
              setIsMuted(true);
              if (streamerRef.current) {
                streamerRef.current.isMuted = true;
              }
              // Stop any current Chakku speech
              if (playerRef.current) {
                playerRef.current.interrupt();
              }
            }
            break;
          case 'READ_PORTFOLIO_FILE':
            if (args.topic === 'resume') {
              resultData = { success: true, content: resumeMd };
            } else if (args.topic === 'chemobuddy') {
              resultData = { success: true, content: chemobuddyMd };
            } else if (args.topic === 'aisle') {
              resultData = { success: true, content: aisleMd };
            } else if (args.topic === 'aura') {
              resultData = { success: true, content: auraMd };
            } else if (args.topic === 'guardrails') {
              resultData = { success: true, content: guardrailsMd };
            } else {
              resultData = { success: false, error: 'File not found' };
            }
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
               response: resultData || { success: success }
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

  useEffect(() => {
    const handleAudioEnded = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.target === 'chemobuddy') {
        // Unmute Chakku
        setIsMuted(false);
        if (streamerRef.current) {
          streamerRef.current.isMuted = false;
        }
        
        // Notify Chakku that the audio is over
        if (sessionRef.current) {
          try {
            sessionRef.current.sendClientContent({
              turns: [{
                role: "user",
                parts: [{ text: "[System Notification: The ChemoBuddy audio case study has finished playing or was stopped by the user. You are now unmuted. Briefly acknowledge this and ask the user what they thought.]" }]
              }],
              turnComplete: true
            });
          } catch (err) {
            console.error('Error sending audio-end notification', err);
          }
        }
      }
    };
    
    window.addEventListener('chakku-audio-ended', handleAudioEnded);
    return () => window.removeEventListener('chakku-audio-ended', handleAudioEnded);
  }, []);

  // textOnly skips the microphone entirely — the fallback for visitors who can't or won't grant it
  const startSession = async (textOnly = false) => {
    if (sessionRef.current || isConnectingRef.current) return; // Prevent double-clicks
    isConnectingRef.current = true;
    setIsSessionActive(true);
    setErrorMsg('');
    setMicIssue(null);
    setInputMode(textOnly ? 'text' : 'voice');

    // Retrying after a dropped connection: release the previous attempt's mic and dictation
    streamerRef.current?.stop();
    streamerRef.current = null;
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch(e) {}
      recognitionRef.current = null;
    }
    
    // Create Audio contexts synchronously during the user gesture!
    if (!playerRef.current) {
      playerRef.current = new AudioPlayer();
      playerRef.current.onPlaybackComplete = () => {
        setMode(prev => (prev === 'speaking') ? 'listening' : prev);
      };
    }
    // Also synchronously create streamer to capture user gesture
    if (!textOnly && !streamerRef.current) {
      streamerRef.current = new AudioStreamer(() => {});
    }
    // Force resume immediately
    playerRef.current.resume();

    // Ask for the mic first, while still inside the click, and before opening a Gemini session.
    // If it fails we stop here with a fix-it panel instead of a raw browser error.
    if (!textOnly) {
      setMode('requesting-mic');
      try {
        if (!streamerRef.current) throw new Error('Audio unavailable');
        await streamerRef.current.start();
      } catch (e: any) {
        console.error('[LIVE_DEBUG] Microphone unavailable:', e?.name, e?.message);
        streamerRef.current?.stop();
        streamerRef.current = null;
        isConnectingRef.current = false;
        setMicIssue(classifyMicError(e));
        setMode('mic-blocked');
        return;
      }
    }
    setMode('connecting');
    
    try {
      const res = await fetch('/api/live-token');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Token fetch failed');
      const ai = new GoogleGenAI({ apiKey: data.token, httpOptions: { apiVersion: 'v1alpha' } });
      const session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: { 
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Puck"
              }
            }
          },
          systemInstruction: { parts: [{ text: data.systemInstruction }] },
          tools: data.tools
        },
        callbacks: {
          onmessage: (msg: any) => {
            isConnectingRef.current = false;
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
            isConnectingRef.current = false;
            sessionRef.current = null;
            setMode('error');
            setErrorMsg(`WS Closed: ${e?.code} ${e?.reason}`);
            // stopSession(); // Disable auto-stop so we can see the error
          },
          onerror: (e: any) => {
            isConnectingRef.current = false;
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
      if (streamerRef.current) streamerRef.current.onAudioData = (base64Audio: string) => {
         if (!streamerRef.current?.isMuted && sessionRef.current) {
            sessionRef.current.sendRealtimeInput({
                 audio: {
                   mimeType: "audio/pcm;rate=16000",
                   data: base64Audio
                 }
            });
         }
      };
      setMode('listening');

      // Setup silent dictation for logging (voice only — typed messages are logged directly)
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition && !textOnly) {
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
          recognition.onerror = (event: any) => {
             // Denied/unavailable: stop for good instead of restarting in a loop
             if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
               recognition.onend = null;
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
      isConnectingRef.current = false;
      console.error("[LIVE_DEBUG] Chakku session initialization exception:", e);
      // Release the mic if we got it but couldn't connect
      streamerRef.current?.stop();
      streamerRef.current = null;
      try { sessionRef.current?.close(); } catch(err) {}
      sessionRef.current = null;
      setMode('error');
      setErrorMsg(e.message || 'Initialization failed');
    }
  };

  const startTextSession = () => startSession(true);

  const sendText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !sessionRef.current) return;
    playerRef.current?.interrupt();
    transcriptRef.current += `\nVisitor (typed): ${trimmed}\n`;
    sessionRef.current.sendClientContent({
      turns: [{ role: 'user', parts: [{ text: trimmed }] }],
      turnComplete: true
    });
  };

  const stopSession = () => {
    isConnectingRef.current = false;
    setIsSessionActive(false);
    setMode('idle');
    setMicIssue(null);
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
    <ChakkuContext.Provider value={{ isSessionActive, mode, startSession: () => startSession(false), startTextSession, stopSession, isMuted, toggleMute, errorMsg, micIssue, inputMode, sendText }}>
      {children}
    </ChakkuContext.Provider>
  );
}

export function useChakku() {
  const context = useContext(ChakkuContext);
  if (!context) throw new Error("useChakku must be used within ChakkuProvider");
  return context;
}

const isMac = () => /Mac/i.test(navigator.platform || navigator.userAgent);

function browserName() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'your browser';
}

// Plain-language fix for each way the mic can fail
function micHelp(issue: MicIssue): { title: string; steps: string[]; canRetry: boolean } {
  const browser = browserName();
  switch (issue) {
    case 'blocked':
      return {
        title: 'Microphone is blocked for this site',
        steps: [
          'Click the icon at the left of the address bar (lock or sliders).',
          'Set Microphone to Allow, then press Try again.',
        ],
        canRetry: true,
      };
    case 'dismissed':
      return { title: 'The mic prompt was closed', steps: ['Press Try again and choose Allow when your browser asks.'], canRetry: true };
    case 'os-blocked':
      return {
        title: `Your computer is blocking ${browser} from the mic`,
        steps: isMac()
          ? [`Open System Settings → Privacy & Security → Microphone.`, `Turn on ${browser}, restart it, then press Try again.`]
          : [`Open Settings → Privacy & security → Microphone.`, `Turn on microphone access for desktop apps, then press Try again.`],
        canRetry: true,
      };
    case 'no-device':
      return { title: 'No microphone found', steps: ['Connect a mic or headset and press Try again.'], canRetry: true };
    case 'in-use':
      return { title: 'Your mic is busy', steps: ['Another app (Zoom, Meet, Teams…) may be using it. Close it and press Try again.'], canRetry: true };
    case 'in-app':
      return { title: "This in-app browser can't use the mic", steps: ['Open this page in Chrome or Safari to talk to Chakku.'], canRetry: false };
    case 'unsupported':
      return { title: "This browser can't use the mic here", steps: ['Try the latest Chrome, Edge or Safari.'], canRetry: false };
    default:
      return { title: "Couldn't start the microphone", steps: ['Check your mic settings and press Try again.'], canRetry: true };
  }
}

const statusLabel: Record<ChakkuMode, string> = {
  idle: 'idle',
  'requesting-mic': 'allow mic access ↑',
  connecting: 'connecting',
  listening: 'listening',
  speaking: 'speaking',
  'mic-blocked': 'mic unavailable',
  error: 'connection lost',
};

export function ChakkuOverlay() {
  const { isSessionActive, mode, stopSession, isMuted, toggleMute, micIssue, inputMode, sendText, startSession, startTextSession } = useChakku();
  const [draft, setDraft] = useState('');
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const help = micIssue ? micHelp(micIssue) : null;
  const textReady = inputMode === 'text' && (mode === 'listening' || mode === 'speaking');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sendText(draft);
    setDraft('');
  };

  return (
    <AnimatePresence>
      {isSessionActive && (
        <>
                <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[190] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 60%, rgba(150, 150, 150, 0.2) 140%)',
            boxShadow: 'inset 0 0 100px rgba(150, 150, 150, 0.2)',
            border: '1px solid rgba(150, 150, 150, 0.25)'
          }}
        >

        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-[200] flex justify-center px-4 pointer-events-none"
        >
          <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-6 w-fit max-w-[min(440px,100%)] pointer-events-auto flex flex-col gap-3">
            <div className="flex items-center gap-6">
              <span className="text-[11px] tracking-widest uppercase text-white/80 flex items-center gap-2 relative group cursor-help" style={mono}>
                <span className="text-white/40">✦</span> CHAKKU · {statusLabel[mode]}
                <Info size={14} className="text-white/40 group-hover:text-white/80 ml-1 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] bg-[#1a1a1a] text-white/80 text-[10px] tracking-normal p-2.5 rounded-lg border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center leading-relaxed font-sans normal-case z-50">
                  Conversations with Chakku are anonymously transcribed to help improve this portfolio.
                </div>
              </span>
              <div className="flex items-center gap-1 ml-auto">
                {inputMode === 'voice' && mode !== 'mic-blocked' && (
                  <button onClick={toggleMute} className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${isMuted ? 'text-red-400' : 'text-white/40 hover:text-white'}`} title="Mute Microphone">
                    {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
                <button onClick={stopSession} className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Exit">
                  <X size={16} />
                </button>
              </div>
            </div>

            {mode === 'requesting-mic' && (
              <p className="text-white/60 text-xs leading-relaxed">
                Chakku talks with you by voice. Click <span className="text-white">Allow</span> when your browser asks for the microphone.
              </p>
            )}

            {mode === 'mic-blocked' && help && (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-white text-sm font-medium">{help.title}</p>
                  <ol className="mt-1.5 flex flex-col gap-1 text-white/60 text-xs leading-relaxed list-decimal pl-4">
                    {help.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </div>
                <div className="flex flex-wrap gap-2" style={mono}>
                  {help.canRetry && (
                    <button onClick={startSession} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-[11px] uppercase tracking-wider hover:bg-white/90 transition-colors">
                      <RotateCcw size={12} /> Try again
                    </button>
                  )}
                  <button onClick={startTextSession} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white text-[11px] uppercase tracking-wider hover:bg-white/10 transition-colors">
                    <Keyboard size={12} /> Type instead
                  </button>
                </div>
              </div>
            )}

            {mode === 'error' && (
              <div className="flex flex-col gap-3">
                <p className="text-white/60 text-xs leading-relaxed">Chakku couldn't connect. Check your internet connection and try again.</p>
                <div className="flex flex-wrap gap-2" style={mono}>
                  <button onClick={inputMode === 'text' ? startTextSession : startSession} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-[11px] uppercase tracking-wider hover:bg-white/90 transition-colors">
                    <RotateCcw size={12} /> Try again
                  </button>
                </div>
              </div>
            )}

            {inputMode === 'text' && mode !== 'error' && (
              <form onSubmit={submit} className="flex items-center gap-2 min-w-[min(380px,80vw)]">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={!textReady}
                  placeholder={textReady ? 'Ask Chakku anything…' : 'Connecting…'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 disabled:opacity-50"
                />
                <button type="submit" disabled={!textReady || !draft.trim()} className="p-2 rounded-full bg-white text-black disabled:opacity-30 transition-opacity" aria-label="Send">
                  <ArrowUp size={16} />
                </button>
              </form>
            )}
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
