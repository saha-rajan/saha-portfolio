import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useCursor } from "../contexts/CursorContext";

// Stiffer, lighter spring: same near-critical damping (no overshoot) but it
// settles in roughly half the time of the old { damping: 30, stiffness: 400, mass: 0.5 }.
const springConfig = { damping: 32, stiffness: 800, mass: 0.3 };

type TextRects = { rects: DOMRect[]; actualLineHeight: number };

type HeadingHover = { active: boolean; height: number };
const NO_HOVER: HeadingHover = { active: false, height: 0 };

const TEXT_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P"]);

// Reads layout once per element (not per mousemove) and returns the text line boxes.
function measureTextRects(el: HTMLElement): TextRects | null {
  const computedStyle = window.getComputedStyle(el);
  const isVisible =
    computedStyle.visibility !== "hidden" &&
    computedStyle.display !== "none" &&
    computedStyle.opacity !== "0" &&
    !el.classList.contains("invisible");
  if (!isVisible) return null;

  const fontSize = parseFloat(computedStyle.fontSize);
  const computedLineHeight = parseFloat(computedStyle.lineHeight);
  const actualLineHeight = isNaN(computedLineHeight) ? fontSize * 1.3 : computedLineHeight;

  const rects: DOMRect[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    const nodeRects = range.getClientRects();
    for (let i = 0; i < nodeRects.length; i++) {
      if (nodeRects[i].width > 1 && nodeRects[i].height > 1) rects.push(nodeRects[i]);
    }
  }
  return { rects, actualLineHeight };
}

function isTouchOrSmall() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
}

export function CustomCursor() {
  // One state object instead of two, so a hover change is a single render.
  const [headingHover, setHeadingHover] = useState<HeadingHover>(NO_HOVER);
  const [isMobile, setIsMobile] = useState(isTouchOrSmall);
  const location = useLocation();
  const { hideCursor, setHideCursor, isTextCursor, cursorText, cursorProgress, cursorTimeLeft, cursorMode, setCursorMode, setCursorText } = useCursor();

  // Refs give listeners the latest values without re-binding. They are written
  // synchronously (not in effects) so they are never a render behind.
  const isTextCursorRef = useRef(isTextCursor);
  isTextCursorRef.current = isTextCursor;
  const headingHoverRef = useRef(headingHover);

  const updateHeadingHover = (next: HeadingHover) => {
    const prev = headingHoverRef.current;
    if (prev.active === next.active && prev.height === next.height) return;
    headingHoverRef.current = next;
    setHeadingHover(next);
  };
  const updateHeadingHoverRef = useRef(updateHeadingHover);
  updateHeadingHoverRef.current = updateHeadingHover;

  // Reset cursor state on route change
  useEffect(() => {
    setCursorMode('default');
    setCursorText('');
  }, [location.pathname, setCursorMode, setCursorText]);

  // Motion values update the DOM directly and bypass React's render cycle
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const textX = useMotionValue(-100);
  const textY = useMotionValue(-100);

  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const smoothTextX = useSpring(textX, springConfig);
  const smoothTextY = useSpring(textY, springConfig);

  // Detect if device is mobile/touch (resize is throttled to one check per frame)
  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIsMobile(isTouchOrSmall());
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let currentTextRects: TextRects | null = null;
    let currentEligibleElement: HTMLElement | null = null;
    // Set on scroll: rects are re-measured lazily on the next mousemove,
    // once per scroll burst, instead of being dropped until the next mouseover.
    let rectsDirty = false;

    const setHover = (next: HeadingHover) => updateHeadingHoverRef.current(next);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest('[data-no-text-cursor="true"]')) {
        currentEligibleElement = null;
        currentTextRects = null;
        setHover(NO_HOVER);
        return;
      }

      let headingElementFound: HTMLElement | null = null;
      let currentElement: HTMLElement | null = target;
      while (currentElement && currentElement !== document.body) {
        if (TEXT_TAGS.has(currentElement.tagName) || currentElement.classList.contains('cursor-line-effect')) {
          headingElementFound = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (headingElementFound !== currentEligibleElement) {
        currentEligibleElement = headingElementFound;
        rectsDirty = false;
        if (headingElementFound) {
          currentTextRects = measureTextRects(headingElementFound);
        } else {
          currentTextRects = null;
          setHover(NO_HOVER);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget === null) {
        currentEligibleElement = null;
        currentTextRects = null;
        setHover(NO_HOVER);
      }
    };

    const updateMousePosition = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      (window as any).mouseX = x;
      (window as any).mouseY = y;

      if (rectsDirty && currentEligibleElement) {
        rectsDirty = false;
        currentTextRects = currentEligibleElement.isConnected
          ? measureTextRects(currentEligibleElement)
          : null;
      }

      let isOverText = false;
      let matchedHeight = 0;

      if (currentTextRects) {
        const { rects, actualLineHeight } = currentTextRects;
        for (let i = 0; i < rects.length; i++) {
          const rect = rects[i];
          if (x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top - 2 && y <= rect.bottom + 2) {
            isOverText = true;
            matchedHeight = Math.max(rect.height, actualLineHeight);
            break;
          }
        }
        setHover(isOverText ? { active: true, height: matchedHeight } : NO_HOVER);
      }

      const isTextC = isTextCursorRef.current;
      const offsetX = (isOverText || isTextC) ? 1 : 16;
      const offsetY = isOverText ? (matchedHeight / 2) : (isTextC ? 12 : 16);

      // Motion values already batch writes into the next animation frame, so we
      // set them straight from the latest event. The old extra requestAnimationFrame
      // added a frame of delay and used the first event of each frame, not the latest.
      mouseX.set(x - offsetX);
      mouseY.set(y - offsetY);
      textX.set(x - 60);
      textY.set(y - 20);
    };

    const handleScroll = () => {
      rectsDirty = true;
      setHover(NO_HOVER);
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
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
    // Named handler so cleanup actually removes it, on the element that
    // really fires mouseleave when the pointer exits the window.
    const handleLeave = () => setHideCursor(false);
    window.addEventListener("mouseup", restoreCursor);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mouseup", restoreCursor);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [isMobile, setHideCursor]);

  const showTextCursor = cursorText.length > 0;
  const shouldShowHeadingCursor = headingHover.active;
  const headingHeight = headingHover.height;

  if (isMobile) {
    return null;
  }

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center text-center ${
          (shouldShowHeadingCursor || isTextCursor) && cursorMode !== 'project' ? 'bg-[#1CB4F5]' : 'rounded-full'
        }`}
        style={{
          opacity: hideCursor || (showTextCursor && cursorMode !== 'project') ? 0 : cursorMode === 'project' ? 0.5 : (shouldShowHeadingCursor || isTextCursor) ? 1 : 0.5,
          width: cursorMode === 'project' ? '100px' : (shouldShowHeadingCursor || isTextCursor) ? '2px' : '32px',
          height: cursorMode === 'project' ? '100px' : shouldShowHeadingCursor ? `${headingHeight}px` : (isTextCursor ? '24px' : '32px'),
          backgroundColor: cursorMode === 'project' ? '#8B8B8B' : (shouldShowHeadingCursor || isTextCursor) ? '#1CB4F5' : '#8B8B8B',
          x: smoothX,
          y: smoothY,
          marginLeft: cursorMode === 'project' ? '-34px' : '0px',
          marginTop: cursorMode === 'project' ? '-34px' : '0px',
          boxShadow: 'none',
          willChange: 'transform',
        }}
        transition={{
          width: { duration: 0.3, ease: "easeOut" },
          height: { duration: 0.3, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
      >
        <AnimatePresence>
          {cursorMode === 'project' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-white font-semibold text-[11px] leading-tight uppercase tracking-[0.05em] whitespace-pre-wrap px-2"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {showTextCursor && cursorMode !== 'project' && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] bg-white text-black pl-6 pr-6 py-3 rounded-full font-medium text-sm flex items-center gap-3"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '0.02em',
            x: smoothTextX,
            y: smoothTextY,
            width: 'max-content',
            paddingRight: cursorProgress !== null ? '0.5rem' : '1.5rem',
            willChange: 'transform',
          }}
        >
          <span className="whitespace-nowrap">{cursorText}</span>

          {cursorProgress !== null && cursorTimeLeft !== null && (
            <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0 bg-gray-100 rounded-full">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
                <circle cx="16" cy="16" r="14" fill="none" stroke="black" strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - cursorProgress)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-bold mt-[1px]">{cursorTimeLeft}s</span>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}