import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface AuraStateObjectProps {
  src: string;
  alt: string;
  className?: string;
  size?: number | string; // e.g. 100 or "100px"
  maxTilt?: number; // max tilt degrees (e.g. 7)
  idleDuration?: number; // idle float cycle duration in seconds (e.g. 12)
  idleY?: number; // max idle float vertical distance in px (e.g. 6)
  idleRotate?: number; // max idle rotation angle (e.g. 6)
}

export function AuraStateObject({
  src,
  alt,
  className = "",
  size = 100,
  maxTilt = 7,
  idleDuration = 12,
  idleY = 6,
  idleRotate = 6,
}: AuraStateObjectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for smooth 3D cursor hover tracking
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawTranslateX = useMotionValue(0);
  const rawTranslateY = useMotionValue(0);
  const rawHoverScale = useMotionValue(1);

  // Soft spring physics for fluid pseudo-3D feel
  const hoverSpringConfig = { stiffness: 100, damping: 18, mass: 0.6 };
  const rotateX = useSpring(rawRotateX, hoverSpringConfig);
  const rotateY = useSpring(rawRotateY, hoverSpringConfig);
  const translateX = useSpring(rawTranslateX, hoverSpringConfig);
  const translateY = useSpring(rawTranslateY, hoverSpringConfig);
  const hoverScale = useSpring(rawHoverScale, hoverSpringConfig);

  // Motion values for elastic drag physics
  const rawDragX = useMotionValue(0);
  const rawDragY = useMotionValue(0);

  // Damped spring physics for smooth responsive drag tracking & 3-4 oscillation snap-back return
  const dragSpringConfig = shouldReduceMotion
    ? { stiffness: 600, damping: 60, mass: 0.5 }
    : { stiffness: 180, damping: 11, mass: 0.6 };

  const dragX = useSpring(rawDragX, dragSpringConfig);
  const dragY = useSpring(rawDragY, dragSpringConfig);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
  }, []);

  // Global mousemove tracking for 3D tilt (suspended while dragging)
  useEffect(() => {
    if (isTouchDevice || shouldReduceMotion || isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.hypot(deltaX, deltaY);
      const influenceRadius = Math.max(window.innerWidth, window.innerHeight) * 0.5;

      if (distance < influenceRadius) {
        const normX = Math.max(-1, Math.min(1, deltaX / (influenceRadius * 0.5)));
        const normY = Math.max(-1, Math.min(1, deltaY / (influenceRadius * 0.5)));

        rawRotateY.set(normX * maxTilt);
        rawRotateX.set(-normY * maxTilt);

        rawTranslateX.set(normX * 4);
        rawTranslateY.set(normY * 4);
        rawHoverScale.set(1 + (1 - Math.min(1, distance / influenceRadius)) * 0.04);
      } else {
        rawRotateX.set(0);
        rawRotateY.set(0);
        rawTranslateX.set(0);
        rawTranslateY.set(0);
        rawHoverScale.set(1);
      }
    };

    const handleMouseLeave = () => {
      rawRotateX.set(0);
      rawRotateY.set(0);
      rawTranslateX.set(0);
      rawTranslateY.set(0);
      rawHoverScale.set(1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouchDevice, shouldReduceMotion, isDragging, maxTilt, rawRotateX, rawRotateY, rawTranslateX, rawTranslateY, rawHoverScale]);

  // Window-level Pointer Drag Event Listeners (prevents sticky events & cursor glitches)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (shouldReduceMotion) return;
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;

    const handleWindowPointerMove = (moveEvt: PointerEvent) => {
      const pointerDx = moveEvt.clientX - startX;
      const pointerDy = moveEvt.clientY - startY;
      const pointerDist = Math.hypot(pointerDx, pointerDy);

      if (pointerDist < 0.5) {
        rawDragX.set(0);
        rawDragY.set(0);
        return;
      }

      // Continuous Asymptotic Exponential Resistance Curve (maxDisplacement ~135px)
      const maxDisplacement = 135;
      const objectDist = maxDisplacement * (1 - Math.exp(-pointerDist / 120));

      const angle = Math.atan2(pointerDy, pointerDx);
      const objX = Math.cos(angle) * objectDist;
      const objY = Math.sin(angle) * objectDist;

      rawDragX.set(objX);
      rawDragY.set(objY);
    };

    const handleWindowPointerUp = () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);

      setIsDragging(false);

      // Snap back to anchor (0, 0) with 3-4 damped harmonic oscillations
      rawDragX.set(0);
      rawDragY.set(0);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);
  };

  const sizeStyle = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center pointer-events-auto touch-pan-y ${className}`}
      style={{
        width: sizeStyle,
        height: sizeStyle,
        perspective: 800,
      }}
    >
      {/* Idle floating wrapper */}
      <motion.div
        animate={
          shouldReduceMotion || isDragging
            ? { y: 0, rotate: 0 }
            : {
                y: [0, -idleY, 0],
                rotate: [0, idleRotate, -idleRotate, 0],
              }
        }
        transition={{
          duration: idleDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full flex items-center justify-center"
      >
        {/* Elastic Rubber-band Pointer Layer & 3D Tilt Layer */}
        <motion.div
          onPointerDown={handlePointerDown}
          style={{
            rotateX: shouldReduceMotion || isDragging ? 0 : rotateX,
            rotateY: shouldReduceMotion || isDragging ? 0 : rotateY,
            x: shouldReduceMotion ? 0 : dragX,
            y: shouldReduceMotion ? 0 : dragY,
            scale: shouldReduceMotion ? 1 : hoverScale,
            transformStyle: "preserve-3d",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          className="w-full h-full flex items-center justify-center select-none"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-none"
            style={{
              transform: "translateZ(0)",
              WebkitUserDrag: "none",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
