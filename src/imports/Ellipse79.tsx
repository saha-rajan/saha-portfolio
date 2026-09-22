import svgPaths from "./svg-li8w44ne5o";
import { useState, useRef, useEffect } from "react";
import { useCursor } from "@/app/contexts/CursorContext";
import { useChakku } from "@/app/contexts/ChakkuContext";
import { motion, AnimatePresence } from "motion/react";

interface Spark {
  id: number;
  angle: number;
  distance: number;
  size: number;
  duration: number;
  ease: string;
}

export default function Ellipse() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const { setHideCursor } = useCursor();
  const { startSession, isSessionActive } = useChakku();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [sparkIdCounter, setSparkIdCounter] = useState(0);
  const hasActivatedRef = useRef(false);

  useEffect(() => {
    if (!isSessionActive) return;

    const intervalId = setInterval(() => {
      const sparkCount = 8; // Exactly like the click burst
      const newSparks: Spark[] = [];

      for (let i = 0; i < sparkCount; i++) {
        newSparks.push({
          id: Date.now() + Math.random() + i,
          angle: Math.random() * 360, // Random direction
          distance: 40, // Matches click exact distance
          size: Math.random() * 3 + 2, // Matches click size
          duration: 2, // Matches click duration
          ease: "easeOut", // Matches click fluid motion
        });
      }

      setSparks(prev => [...prev, ...newSparks]);

      setTimeout(() => {
        setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
      }, 2500); // Wait to clear
    }, 1200); // ~1.2s interval gives that perfect "almost faded before the next pop" rhythm

    return () => clearInterval(intervalId);
  }, [isSessionActive]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHideCursor(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsHolding(false);
    setHideCursor(false);
  };

  const handlePointerDown = () => {
    if (!isSessionActive) {
      setIsHolding(true);
      hasActivatedRef.current = false;
    }
  };

  const handlePointerUp = () => {
    setIsHolding(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasActivatedRef.current) {
      hasActivatedRef.current = false;
      e.preventDefault();
      return;
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Create sparks
    const sparkCount = 8; // Number of sparks per click
    const newSparks: Spark[] = [];
    
    for (let i = 0; i < sparkCount; i++) {
      newSparks.push({
        id: sparkIdCounter + i,
        angle: Math.random() * 360, // Random direction
        distance: 40,
        size: Math.random() * 3 + 2, // Random size between 2-5px
        duration: 2,
        ease: "easeOut",
      });
    }
    
    setSparks([...sparks, ...newSparks]);
    setSparkIdCounter(sparkIdCounter + sparkCount);
    
    // Remove sparks after animation completes
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
    }, 2000);
  };

  return (
    <div 
      className="relative size-full cursor-pointer overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
    >
      <svg 
        className="block size-full transition-all duration-300" 
        fill="none" 
        preserveAspectRatio="none" 
        viewBox="0 0 34 34"
        style={{
          filter: isHovered 
            ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.6))' 
            : 'none',
          overflow: 'visible'
        }}
      >
        <path d={svgPaths.p1bed5780} fill="var(--fill-0, white)" id="Ellipse 79" />
        
        <motion.circle
          cx="17"
          cy="17"
          r="15.5"
          stroke="#1CB4F5"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isHolding ? 1 : 0 }}
          transition={{ duration: isHolding ? 2 : 0.3, ease: "linear" }}
          onAnimationComplete={(definition: any) => {
            if (definition.pathLength === 1 && !isSessionActive) {
              hasActivatedRef.current = true;
              setIsHolding(false);
              startSession();
            }
          }}
          style={{ rotate: -90, transformOrigin: 'center' }}
        />
      </svg>
      
      <AnimatePresence>
        {isHovered && !isSessionActive && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-[50px] top-1/2 -translate-y-1/2 whitespace-nowrap text-xs sm:text-sm text-[#A7A7A7] pointer-events-none drop-shadow-md"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Hold two seconds to activate Chakku
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sparks container */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {sparks.map(spark => {
            const radians = (spark.angle * Math.PI) / 180;
            
            return (
              <motion.div
                key={spark.id}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `${-spark.size / 2}px`,
                  marginTop: `${-spark.size / 2}px`,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos(radians) * spark.distance,
                  y: Math.sin(radians) * spark.distance,
                  opacity: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: spark.duration,
                  ease: spark.ease as any,
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
