import svgPaths from "./svg-li8w44ne5o";
import { useState } from "react";
import { useCursor } from "@/app/contexts/CursorContext";
import { motion, AnimatePresence } from "motion/react";

interface Spark {
  id: number;
  angle: number;
  distance: number;
  size: number;
}

export default function Ellipse() {
  const [isHovered, setIsHovered] = useState(false);
  const { setHideCursor } = useCursor();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [sparkIdCounter, setSparkIdCounter] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHideCursor(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHideCursor(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Create sparks
    const sparkCount = 8; // Number of sparks per click
    const newSparks: Spark[] = [];
    
    for (let i = 0; i < sparkCount; i++) {
      newSparks.push({
        id: sparkIdCounter + i,
        angle: Math.random() * 360, // Random direction
        distance: 0,
        size: Math.random() * 3 + 2, // Random size between 2-5px
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
      className="relative size-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            : 'none'
        }}
      >
        <path d={svgPaths.p1bed5780} fill="var(--fill-0, white)" id="Ellipse 79" />
      </svg>
      
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
                  x: Math.cos(radians) * 40,
                  y: Math.sin(radians) * 40,
                  opacity: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
