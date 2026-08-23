import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useCursor } from "../contexts/CursorContext";

export function CustomCursor() {
  const [isHoveringHeading, setIsHoveringHeading] = useState(false);
  const [headingHeight, setHeadingHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { hideCursor, setHideCursor, isTextCursor, cursorText } = useCursor();

  // Use refs to access latest state inside event listeners without re-binding
  const isTextCursorRef = useRef(isTextCursor);
  const isHoveringHeadingRef = useRef(isHoveringHeading);
  const headingHeightRef = useRef(headingHeight);
  
  useEffect(() => { isTextCursorRef.current = isTextCursor; }, [isTextCursor]);
  useEffect(() => { isHoveringHeadingRef.current = isHoveringHeading; }, [isHoveringHeading]);
  useEffect(() => { headingHeightRef.current = headingHeight; }, [headingHeight]);

  // High-performance motion values that bypass React's render cycle
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const textX = useMotionValue(-100);
  const textY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const smoothTextX = useSpring(textX, springConfig);
  const smoothTextY = useSpring(textY, springConfig);

  // Detect if device is mobile/touch
  useEffect(() => {
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
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
      
      if (headingElementFound !== currentEligibleElement) {
        currentEligibleElement = headingElementFound;
        
        if (headingElementFound) {
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
      
      let isOverText = false;
      let matchedHeight = 0;
      
      if (currentTextRects) {
        for (let i = 0; i < currentTextRects.rects.length; i++) {
          const rect = currentTextRects.rects[i];
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
        
        // Update React state safely if changed
        if (isOverText !== isHoveringHeadingRef.current) {
          setIsHoveringHeading(isOverText);
        }
        if (isOverText && matchedHeight !== headingHeightRef.current) {
          setHeadingHeight(matchedHeight);
        } else if (!isOverText && headingHeightRef.current !== 0) {
          setHeadingHeight(0);
        }
      }

      // Update MotionValues directly to avoid React re-renders on every pixel move
      const isTextC = isTextCursorRef.current;
      const isHovering = currentTextRects ? isOverText : false;
      const hHeight = currentTextRects && isOverText ? matchedHeight : 0;
      
      const offsetX = (isHovering || isTextC) ? 1 : 16;
      const offsetY = isHovering ? (hHeight / 2) : (isTextC ? 12 : 16);
      
      // Update coordinates dynamically without setState
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set(e.clientX - offsetX);
          mouseY.set(e.clientY - offsetY);
          textX.set(e.clientX - 60);
          textY.set(e.clientY - 20);
          ticking = false;
        });
        ticking = true;
      }
    };

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
  }, [isMobile, mouseX, mouseY, textX, textY]);

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

  const showTextCursor = cursorText.length > 0;
  const shouldShowHeadingCursor = isHoveringHeading;

  if (isMobile) {
    return null;
  }

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] ${
          shouldShowHeadingCursor || isTextCursor ? 'bg-[#1CB4F5]' : 'rounded-full'
        }`}
        style={{
          opacity: hideCursor || showTextCursor ? 0 : (shouldShowHeadingCursor || isTextCursor) ? 1 : 0.5,
          width: (shouldShowHeadingCursor || isTextCursor) ? '2px' : '32px',
          height: shouldShowHeadingCursor ? `${headingHeight}px` : (isTextCursor ? '24px' : '32px'),
          backgroundColor: (shouldShowHeadingCursor || isTextCursor) ? '#1CB4F5' : '#8B8B8B',
          x: smoothX,
          y: smoothY
        }}
        transition={{
          opacity: { duration: 0.2 },
        }}
      />

      {showTextCursor && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] bg-white text-black px-6 py-3 rounded-full font-medium text-sm whitespace-nowrap"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '0.02em',
            x: smoothTextX,
            y: smoothTextY
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
}