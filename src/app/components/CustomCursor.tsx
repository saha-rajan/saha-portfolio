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
    
    // Cache for rects to prevent layout thrashing during mousemove
    let currentTextRects: { rects: DOMRect[], actualLineHeight: number } | null = null;
    let currentEligibleElement: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      let headingElementFound: HTMLElement | null = null;
      let currentElement: HTMLElement | null = target;
      
      while (currentElement && currentElement !== document.body) {
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
      
      // If we hover over a new eligible element
      if (headingElementFound !== currentEligibleElement) {
        currentEligibleElement = headingElementFound;
        
        if (headingElementFound) {
          // Calculate rects ONCE when entering the element
          const computedStyle = window.getComputedStyle(headingElementFound);
          const isVisible = computedStyle.visibility !== 'hidden' && 
                           computedStyle.display !== 'none' && 
                           computedStyle.opacity !== '0' &&
                           !headingElementFound.classList.contains('invisible');
                           
          if (!isVisible) {
            currentTextRects = null;
            return;
          }

          const fontSize = parseFloat(computedStyle.fontSize);
          const computedLineHeight = parseFloat(computedStyle.lineHeight);
          const actualLineHeight = isNaN(computedLineHeight) ? fontSize * 1.3 : computedLineHeight;
          
          const textNodes: Node[] = [];
          const getTextNodes = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
              textNodes.push(node);
            } else {
              node.childNodes.forEach(getTextNodes);
            }
          };
          getTextNodes(headingElementFound);
          
          const allRects: DOMRect[] = [];
          for (const textNode of textNodes) {
            const range = document.createRange();
            range.selectNodeContents(textNode);
            const rects = range.getClientRects();
            for (let i = 0; i < rects.length; i++) {
              if (rects[i].width > 1 && rects[i].height > 1) {
                allRects.push(rects[i]);
              }
            }
          }
          
          currentTextRects = { rects: allRects, actualLineHeight };
        } else {
          currentTextRects = null;
          setIsHoveringHeading(false);
          setHeadingHeight(0);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      // If we completely leave the document body
      if (e.relatedTarget === null) {
        currentEligibleElement = null;
        currentTextRects = null;
        setIsHoveringHeading(false);
        setHeadingHeight(0);
      }
    };

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
      
      // Performant text precision check using cached rects
      if (currentTextRects) {
        let isOverText = false;
        let matchedHeight = 0;
        
        for (let i = 0; i < currentTextRects.rects.length; i++) {
          const rect = currentTextRects.rects[i];
          // Small tolerance for smoother hover feel
          if (
            e.clientX >= rect.left - 2 &&
            e.clientX <= rect.right + 2 &&
            e.clientY >= rect.top - 2 &&
            e.clientY <= rect.bottom + 2
          ) {
            isOverText = true;
            matchedHeight = Math.max(rect.height, currentTextRects.actualLineHeight);
            break;
          }
        }
        
        setIsHoveringHeading(isOverText);
        setHeadingHeight(isOverText ? matchedHeight : 0);
      }
    };

    // Invalidate cache on scroll to recalculate positions correctly
    const handleScroll = () => {
       currentEligibleElement = null;
       currentTextRects = null;
       setIsHoveringHeading(false);
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("scroll", handleScroll);
    };
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