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
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      (window as any).mouseX = e.clientX;
      (window as any).mouseY = e.clientY;
      
      // Reset state by default
      let isOverHeadingText = false;
      let headingElementFound: HTMLElement | null = null;
      let lineHeight = 0;
      
      // First, find if cursor is over any text at the cursor position
      const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
      
      // Check each element at the cursor position
      for (const elem of elementsAtPoint) {
        if (elem instanceof HTMLElement) {
          // Check if this element or any parent is a heading, paragraph, OR has cursor-line-effect class
          let currentElement: HTMLElement | null = elem;
          
          while (currentElement) {
            const tagName = currentElement.tagName;
            if (
              tagName === 'H1' || 
              tagName === 'H2' || 
              tagName === 'H3' ||
              tagName === 'H4' ||
              tagName === 'H5' ||
              tagName === 'H6' ||
              tagName === 'P' ||
              currentElement.classList.contains('cursor-line-effect')
            ) {
              headingElementFound = currentElement;
              break;
            }
            currentElement = currentElement.parentElement;
          }
          
          if (headingElementFound) {
            break;
          }
        }
      }
      
      // If we found a heading or cursor-line-effect element, check if cursor is actually over text
      if (headingElementFound) {
        // Skip if element is invisible or hidden
        const computedStyle = window.getComputedStyle(headingElementFound);
        const isVisible = computedStyle.visibility !== 'hidden' && 
                         computedStyle.display !== 'none' && 
                         computedStyle.opacity !== '0' &&
                         !headingElementFound.classList.contains('invisible');
        
        if (!isVisible) {
          setIsHoveringHeading(false);
          setHeadingHeight(0);
          return;
        }
        
        // Get computed style to check line-height
        const fontSize = parseFloat(computedStyle.fontSize);
        const computedLineHeight = parseFloat(computedStyle.lineHeight);
        const actualLineHeight = isNaN(computedLineHeight) ? fontSize * 1.3 : computedLineHeight;
        
        // Get all text nodes from the heading
        const textNodes: Node[] = [];
        const getTextNodes = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            textNodes.push(node);
          } else {
            node.childNodes.forEach(getTextNodes);
          }
        };
        getTextNodes(headingElementFound);
        
        // First try: Check if cursor is within any text node's bounding box (precise detection only)
        for (const textNode of textNodes) {
          const range = document.createRange();
          range.selectNodeContents(textNode);
          const rects = range.getClientRects();
          
          // Check all rectangles (text might wrap)
          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            
            // Skip empty or very small rectangles
            if (rect.width < 1 || rect.height < 1) {
              continue;
            }
            
            // No tolerance - must be directly over text
            if (
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom
            ) {
              isOverHeadingText = true;
              // Use the actual line height from CSS or the rect height, whichever is more accurate
              lineHeight = Math.max(rect.height, actualLineHeight);
              break;
            }
          }
          
          if (isOverHeadingText) {
            break;
          }
        }
      }
      
      // Update state
      if (isOverHeadingText && headingElementFound && lineHeight > 0) {
        setIsHoveringHeading(true);
        setHeadingHeight(lineHeight);
      } else {
        setIsHoveringHeading(false);
        setHeadingHeight(0);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
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