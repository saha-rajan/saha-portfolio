import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import videoPitch from "../../assets/Video Pitch.mp4";
import { Volume2, VolumeX } from "lucide-react";
import { useCursor } from "../contexts/CursorContext";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCursorText, setCursorProgress, setCursorTimeLeft } = useCursor();

  // Play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
    
    // Cleanup cursor on unmount
    return () => {
      setCursorText("");
      setCursorProgress(null);
      setCursorTimeLeft(null);
    };
  }, [setCursorText, setCursorProgress, setCursorTimeLeft]);

  const handleEnter = () => {
    setIsFading(true);
    setCursorText("");
    setCursorProgress(null);
    setCursorTimeLeft(null);
    onLoadingComplete();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (duration > 0) {
        setCursorProgress(currentTime / duration);
        setCursorTimeLeft(Math.ceil(duration - currentTime));
      }
    }
  };

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-none"
      onClick={handleEnter}
      onMouseEnter={() => setCursorText("Click to Enter")}
      onMouseLeave={() => setCursorText("")}
    >
      <motion.video
        ref={videoRef}
        src={videoPitch}
        autoPlay
        muted={isMuted}
        defaultMuted
        playsInline
        onEnded={handleEnter}
        onTimeUpdate={handleTimeUpdate}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full object-cover opacity-90"
      />
      
      {/* Minimal Gradient Overlay for text readability at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      
      {/* Controls Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-0 right-0 px-8 md:px-16 lg:px-24 flex justify-between items-center z-10 pointer-events-none"
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setCursorText("");
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setCursorText("Click to Enter");
          }}
          className="p-4 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all border border-white/10 group flex items-center gap-3 pointer-events-auto cursor-pointer"
        >
          {isMuted ? <VolumeX size={20} className="opacity-70 group-hover:opacity-100" /> : <Volume2 size={20} />}
          <span className="font-mono text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            {isMuted ? "UNMUTE" : "MUTE"}
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
