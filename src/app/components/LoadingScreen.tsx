import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"tangled" | "untangling" | "glowing" | "moving" | "settled" | "complete">("tangled");

  useEffect(() => {
    // Phase 1: Show tangled circle (0.3s)
    const tangledTimer = setTimeout(() => {
      setPhase("untangling");
    }, 300);

    // Phase 2: Untangle to perfect circle (1.2s)
    const untangleTimer = setTimeout(() => {
      setPhase("glowing");
    }, 1500);

    // Phase 3: Glow effect (0.5s)
    const glowTimer = setTimeout(() => {
      setPhase("moving");
    }, 2000);

    // Phase 4: Move to nav position (0.7s)
    const moveTimer = setTimeout(() => {
      setPhase("settled");
    }, 2700);

    // Phase 5: Settled - circle is perfectly in position (0.2s hold)
    const settledTimer = setTimeout(() => {
      setPhase("complete");
    }, 2900);

    // Phase 6: Notify parent so header shows
    const completeTimer = setTimeout(() => {
      onLoadingComplete();
    }, 2900);

    return () => {
      clearTimeout(tangledTimer);
      clearTimeout(untangleTimer);
      clearTimeout(glowTimer);
      clearTimeout(moveTimer);
      clearTimeout(settledTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  // Calculate exact target position matching header circle
  const getTargetPosition = () => {
    const isMobile = window.innerWidth < 768;
    const headerPadding = isMobile ? 24 : 48;
    const headerPaddingY = 32;
    
    const headerCircleCenterX = headerPadding + 17;
    const headerCircleCenterY = headerPaddingY + 17;
    
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    
    return {
      x: headerCircleCenterX - viewportCenterX,
      y: headerCircleCenterY - viewportCenterY,
    };
  };

  const targetPos = getTargetPosition();

  // Tangled swirl - using cubic bezier curves (C commands)
  const tangledPath = `
    M 60,20
    C 90,22 102,40 100,60
    C 98,78 85,92 68,96
    C 54,99 40,88 36,72
    C 33,58 40,44 54,40
    C 66,37 76,44 78,56
    C 79,65 74,72 66,74
    C 60,75 55,71 54,65
    C 53,61 55,58 58,57
    C 60,56 61,57 61,58
    C 61,59 60,60 59,60
    C 58,60 58,59 58,59
  `;

  // Perfect circle - using cubic bezier curves (C commands) with same number of points
  const perfectPath = `
    M 60,20
    C 82,20 100,38 100,60
    C 100,82 82,100 60,100
    C 38,100 20,82 20,60
    C 20,38 38,20 60,20
    C 82,20 100,38 100,60
    C 100,82 82,100 60,100
    C 38,100 20,82 20,60
    C 20,38 38,20 60,20
    C 82,20 100,38 100,60
    C 100,82 82,100 60,100
    C 38,100 20,82 20,60
  `;

  // Exact scale to match 34px header circle
  const targetScale = 34 / 120;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === "complete" ? 0 : 1 
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ 
        pointerEvents: "none"
      }}
    >
      <motion.div
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: phase === "moving" || phase === "settled" || phase === "complete" ? targetScale : 1,
          x: phase === "moving" || phase === "settled" || phase === "complete" ? targetPos.x : 0,
          y: phase === "moving" || phase === "settled" || phase === "complete" ? targetPos.y : 0,
        }}
        transition={{
          scale: { 
            duration: 0.7, 
            ease: [0.4, 0.0, 0.2, 1] 
          },
          x: { 
            duration: 0.7, 
            ease: [0.4, 0.0, 0.2, 1] 
          },
          y: { 
            duration: 0.7, 
            ease: [0.4, 0.0, 0.2, 1] 
          },
        }}
        className="relative"
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Single path that morphs from swirl to circle */}
          <motion.path
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ d: tangledPath }}
            animate={{ 
              d: phase === "tangled" ? tangledPath : perfectPath,
            }}
            transition={{ 
              duration: 1.2,
              ease: [0.65, 0.0, 0.35, 1],
              delay: phase === "untangling" ? 0 : undefined,
            }}
            style={{
              filter: phase === "glowing" ? "url(#glow)" : "none"
            }}
          />

          {/* Subtle glow during glowing phase */}
          {phase === "glowing" && (
            <motion.circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="white"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              style={{
                filter: "blur(6px)"
              }}
            />
          )}
        </svg>
      </motion.div>
    </motion.div>
  );
}
