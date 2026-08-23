import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useCursor } from "../contexts/CursorContext";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringHeading, setIsHoveringHeading] = useState(false);
  const [headingHeight, setHeadingHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { hideCursor, setHideCursor, isTextCursor, cursorText } = useCursor();

  // Detect if device is mobile/touch
  useEffect(() => {
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024; // Hide on tablets and mobile
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Skip if mobile
    if (isMobile) return;
    
    let ticking = false;
    const updateMousePosition = (e: MouseEvent) => {
      (window as any).mouseX = e.clientX;
      (window as any).mouseY = e.clientY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePosition({ x: (window as any).mouseX, y: (window as any).mouseY });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [isMobile]);

  // Safety net: if the cursor was hidden (e.g. on a link hover) and the
  // user clicks or the mouse leaves the window, ensure it reappears unless still hovering a cursor-hide button.
  useEffect(() => {
    if (isMobile) return;
    const restoreCursor = (e: MouseEvent) => {
      const x = e.clientX || (window as any).mouseX || 0;
      const y = e.clientY || (window as any).mouseY || 0;
      const elems = document.elementsFromPoint(x, y);
      const isOverHideElem = elems.some(
        (el) =>
          el.getAttribute("data-cursor-hide") === "true" ||
          el.closest('[data-cursor-hide="true"]') !== null
      );
      if (!isOverHideElem) {
        setHideCursor(false);
      }
    };
    window.addEventListener("mouseup", restoreCursor);
    window.addEventListener("mouseleave", () => setHideCursor(false));
    return () => {
      window.removeEventListener("mouseup", restoreCursor);
      window.removeEventListener("mouseleave", () => setHideCursor(false));
    };
  }, [isMobile, setHideCursor]);

  // Show text cursor when there's cursor text
  const showTextCursor = cursorText.length > 0;
  
  // Use vertical blue line when hovering over headings
  const shouldShowHeadingCursor = isHoveringHeading;

  // Don't render cursor on mobile
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Regular cursor */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] ${
          shouldShowHeadingCursor || isTextCursor
            ? 'bg-[#1CB4F5]' 
            : 'rounded-full'
        }`}
        style={{
          opacity: hideCursor || showTextCursor ? 0 : (shouldShowHeadingCursor || isTextCursor) ? 1 : 0.5,
          width: (shouldShowHeadingCursor || isTextCursor) ? '2px' : '32px',
          height: shouldShowHeadingCursor ? `${headingHeight}px` : (isTextCursor ? '24px' : '32px'),
          backgroundColor: (shouldShowHeadingCursor || isTextCursor) ? '#1CB4F5' : '#8B8B8B',
        }}
        animate={{
          x: (shouldShowHeadingCursor || isTextCursor) ? mousePosition.x - 1 : mousePosition.x - 16,
          y: shouldShowHeadingCursor ? mousePosition.y - (headingHeight / 2) : (isTextCursor ? mousePosition.y - 12 : mousePosition.y - 16),
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
          mass: 0.5,
          opacity: { duration: 0.2 },
        }}
      />

      {/* Text cursor */}
      {showTextCursor && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] bg-white text-black px-6 py-3 rounded-full font-medium text-sm whitespace-nowrap"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '0.02em',
          }}
          animate={{
            x: mousePosition.x - 60,
            y: mousePosition.y - 20,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 400,
            mass: 0.5,
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
}