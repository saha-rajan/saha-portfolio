import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Loader2 } from 'lucide-react';

interface AntigravityExperimentProps {
  onClose: () => void;
}

export function AntigravityExperiment({ onClose }: AntigravityExperimentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading MediaPipe Models...");
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const frameRef = useRef<number>();

  useEffect(() => {
    // Check for mobile device (User Agent or small screen width)
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (checkMobile) {
      setIsMobile(true);
      setIsLoading(false);
      return;
    }

    let camera: any;
    let hands: any;
    
    const loadScripts = async () => {
      try {
        setLoadingText("Loading Hand Tracking Models (4MB)...");
        // Dynamically load MediaPipe scripts
        const loadScript = (src: string) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.crossOrigin = "anonymous";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        };

        // We only need camera_utils and hands for the Dr. Strange effect
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        setLoadingText("Starting Camera...");
        await initializeEffect();
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
        setError("Failed to load experiment. Check your connection.");
        setIsLoading(false);
      }
    };

    const initializeEffect = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      const ctx = canvasElement.getContext('2d', { alpha: true });
      if (!ctx) return;

      // Ensure canvas matches container size
      const updateSize = () => {
        if (containerRef.current) {
          canvasElement.width = containerRef.current.clientWidth;
          canvasElement.height = containerRef.current.clientHeight;
        }
      };
      updateSize();
      window.addEventListener('resize', updateSize);

      // ==========================================
      // HIGH RESOLUTION PROCEDURAL MANDALA
      // ==========================================
      const mandalaCanvas = document.createElement('canvas');
      const mSize = 1024;
      mandalaCanvas.width = mSize;
      mandalaCanvas.height = mSize;
      const mCtx = mandalaCanvas.getContext('2d');

      if (!mCtx) return;

      function drawRuneString(ctx: CanvasRenderingContext2D, radius: number, angleOffset: number) {
          ctx.save();
          ctx.rotate(angleOffset);
          ctx.font = 'bold 32px sans-serif';
          ctx.fillStyle = '#ffcc00';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          let chars = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟΔΞΦΨΩ"; 
          let numRunes = 45;
          for(let i=0; i<numRunes; i++) {
              ctx.save();
              ctx.rotate((i / numRunes) * Math.PI * 2);
              ctx.translate(0, -radius);
              let char = chars[i % chars.length];
              ctx.fillText(char, 0, 0);
              ctx.restore();
          }
          ctx.restore();
      }

      function generateMandala() {
          if (!mCtx) return;
          mCtx.clearRect(0, 0, mSize, mSize);
          mCtx.translate(mSize/2, mSize/2);
          
          mCtx.shadowBlur = 15;
          mCtx.shadowColor = '#ff5500';
          
          const drawRing = (rad: number, width: number, color: string, dashed: number[] = []) => {
              mCtx.beginPath();
              mCtx.arc(0, 0, rad, 0, Math.PI * 2);
              mCtx.strokeStyle = color;
              mCtx.lineWidth = width;
              if (dashed.length > 0) mCtx.setLineDash(dashed);
              else mCtx.setLineDash([]);
              mCtx.stroke();
          };

          drawRing(480, 8, '#ff8800');
          drawRing(460, 4, '#ffdd55', [10, 15]);
          drawRuneString(mCtx, 420, 0);
          drawRing(380, 6, '#ffaa00');

          mCtx.strokeStyle = '#ffaa00';
          mCtx.lineWidth = 8;
          mCtx.setLineDash([]);
          for(let r=0; r<2; r++) {
              mCtx.save();
              mCtx.rotate(r * Math.PI / 4);
              mCtx.beginPath();
              mCtx.rect(-268, -268, 536, 536); 
              mCtx.stroke();
              mCtx.restore();
          }

          drawRing(250, 6, '#ffaa00');
          drawRing(230, 2, '#ffdd55');
          
          mCtx.lineWidth = 4;
          mCtx.beginPath();
          for(let i=0; i<8; i++) {
              mCtx.moveTo(0,0);
              mCtx.lineTo(Math.cos(i*Math.PI/4)*230, Math.sin(i*Math.PI/4)*230);
          }
          mCtx.stroke();

          drawRing(120, 8, '#ffaa00');
          drawRing(100, 3, '#ffffff');
          mCtx.beginPath();
          mCtx.arc(0, 0, 50, 0, Math.PI * 2);
          mCtx.fillStyle = 'rgba(255, 150, 0, 0.8)';
          mCtx.fill();
          
          for(let i=0; i<8; i++) {
              let ang = (i/8) * Math.PI * 2;
              mCtx.beginPath();
              mCtx.arc(Math.cos(ang)*330, Math.sin(ang)*330, 10, 0, Math.PI*2);
              mCtx.fillStyle = '#ffffff';
              mCtx.fill();
          }
      }
      generateMandala();

      function getHandOpenness(h: any[]) {
          let scale = Math.hypot(h[9].x - h[0].x, h[9].y - h[0].y);
          let d8 = Math.hypot(h[8].x - h[0].x, h[8].y - h[0].y) / scale;
          let d12 = Math.hypot(h[12].x - h[0].x, h[12].y - h[0].y) / scale;
          let d16 = Math.hypot(h[16].x - h[0].x, h[16].y - h[0].y) / scale;
          let d20 = Math.hypot(h[20].x - h[0].x, h[20].y - h[0].y) / scale;
          
          let avgDist = (d8 + d12 + d16 + d20) / 4;
          let openness = (avgDist - 1.0) / 1.0; 
          return Math.max(0, Math.min(1, openness));
      }

      function drawMandala(h: any[], time: number, handedness: any) {
          if (!ctx) return;
          let cw = canvasElement.width;
          let ch = canvasElement.height;
          
          let openness = getHandOpenness(h);
          if (openness <= 0.05) return; 
          
          let dx1 = h[5].x - h[0].x;
          let dy1 = h[5].y - h[0].y;
          let dx2 = h[17].x - h[0].x;
          let dy2 = h[17].y - h[0].y;
          
          let crossZ = dx1 * dy2 - dy1 * dx2; 
          let isLeft = handedness.label === 'Left';
          let faceRatio = isLeft ? -crossZ : crossZ; 
          
          let len1 = Math.hypot(dx1, dy1);
          let len2 = Math.hypot(dx2, dy2);
          let sinTheta = faceRatio / ((len1 * len2) || 1); 
          
          let facingAlpha = Math.max(0, Math.min(1, (sinTheta + 0.1) * 10)); 
          if (facingAlpha <= 0.01) return;

          let cx = 0, cy = 0;
          const palmIds = [0, 1, 5, 9, 13, 17];
          for(let id of palmIds) {
              cx += h[id].x * cw;
              cy += h[id].y * ch;
          }
          cx /= palmIds.length;
          cy /= palmIds.length;

          let hHeight = Math.hypot((h[9].x - h[0].x) * cw, (h[9].y - h[0].y) * ch);
          let scaleBase = (hHeight * 4.0) / mSize; 
          let squashX = Math.max(0.05, Math.min(1.0, Math.abs(sinTheta) * 1.8));
          let scaleY = scaleBase * openness;
          let scaleX = scaleBase * openness * squashX;

          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = openness * facingAlpha;

          ctx.save();
          ctx.translate(cx, cy);
          
          let dxY = h[9].x - h[0].x;
          let dyY = h[9].y - h[0].y;
          let angle = Math.atan2(dyY * ch, dxY * cw) + Math.PI/2;
          ctx.rotate(angle);
          
          ctx.scale(scaleX, scaleY);
          ctx.rotate(time * 0.0005);

          ctx.drawImage(mandalaCanvas, -mSize/2, -mSize/2, mSize, mSize);
          
          ctx.restore();
          ctx.globalAlpha = 1.0;
      }

      let isTracking = false;
      let handLandmarks: any[] = [];
      let multiHandedness: any[] = [];
      let trackingTimeout: any = null;

      function animate() {
          if (!ctx) return;
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          let time = performance.now();

          if (isTracking) {
              for (let i = 0; i < handLandmarks.length; i++) {
                  let h = handLandmarks[i];
                  drawMandala(h, time, multiHandedness[i]);
              }
          }

          frameRef.current = requestAnimationFrame(animate);
      }
      
      const onResults = (results: any) => {
          if (isLoading) {
              setIsLoading(false);
          }
          
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              isTracking = true;
              handLandmarks = results.multiHandLandmarks;
              multiHandedness = results.multiHandedness;
              
              clearTimeout(trackingTimeout);
              trackingTimeout = setTimeout(() => {
                  isTracking = false;
              }, 200); 
          }
      };

      // @ts-ignore - MediaPipe globals
      hands = new window.Hands({locateFile: (file: string) => {
        return 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/' + file;
      }});

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1, 
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      hands.onResults(onResults);

      // @ts-ignore
      camera = new window.Camera(videoElement, {
        onFrame: async () => {
          await hands.send({image: videoElement});
        },
        width: 1280,
        height: 720
      });

      try {
        await camera.start();
        animate();
      } catch (e) {
        console.error("Camera start failed:", e);
        setError("Camera access denied or unavailable.");
        setIsLoading(false);
      }
    };

    loadScripts();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (camera) camera.stop();
      if (hands) hands.close();
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center cursor-default"
      onClick={(e) => e.stopPropagation()} 
      ref={containerRef}
    >
      {isMobile ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 p-8 text-center">
            <div className="bg-[#ffaa00]/10 p-6 rounded-2xl border border-[#ffaa00]/20 max-w-sm">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#ffaa00]/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">💻</span>
                </div>
                <h3 className="text-[#ffaa00] font-mono text-lg mb-4 font-bold tracking-widest uppercase">Desktop Required</h3>
                <p className="text-white/80 font-mono text-sm leading-relaxed mb-6">
                    This experiment uses high-performance WebGL and MediaPipe hand tracking which requires a desktop camera and more processing power.
                </p>
                <p className="text-white/50 font-mono text-xs uppercase tracking-widest">
                    Please open this page on a computer to play the effect.
                </p>
            </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)" }}
          />
          
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
            style={{ 
                transform: "scaleX(-1)", 
                mixBlendMode: "screen", 
                filter: "drop-shadow(0 0 10px rgba(255, 100, 0, 0.5))" 
            }}
          />
        </>
      )}
      
      {isLoading && !error && !isMobile && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-[#ffaa00]">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-mono text-sm tracking-widest">{loadingText}</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-red-500">
            <p className="font-mono text-lg">{error}</p>
        </div>
      )}

      <button 
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors z-40 cursor-pointer"
      >
        <X size={24} />
      </button>

      {!isMobile && (
        <div className="absolute bottom-4 left-0 right-0 text-center z-30 pointer-events-none opacity-50">
          <p className="text-white/70 font-mono text-xs tracking-widest uppercase">Show your palm to the camera</p>
        </div>
      )}
    </motion.div>
  );
}
