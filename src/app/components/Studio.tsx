import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, animate, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useCursor } from "../contexts/CursorContext";
import { StudioThreadPreview } from "../pages/StudioDetail";

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const EASE = [0.65, 0, 0.35, 1] as const;

// The window shows the Studio's landing frame zoomed out (0); entering zooms it in to the real frame (1)
const PREVIEW_ZOOM = 0;

// Renders the Studio page at full viewport size, scaled to fit `width`
function ScaledStudio({ width, introProgress, drift }: { width: MotionValue<number>; introProgress: MotionValue<number>; drift: MotionValue<number> }) {
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const scale = useTransform(width, (w) => w / viewport.w);
  return (
    <motion.div
      // transform makes this the containing block for the page's fixed header, so it stays inside the window
      className="absolute left-0 top-0 origin-top-left pointer-events-none select-none"
      style={{ width: viewport.w, height: viewport.h, scale, overflow: "hidden" }}
      inert
      aria-hidden
    >
      <StudioThreadPreview introProgress={introProgress} drift={drift} />
    </motion.div>
  );
}

export function Studio() {
  const { setIsTextCursor } = useCursor();

  return (
    <section id="studio" className="relative py-16 md:py-24 bg-black overflow-hidden">
      {/* 6-Column Grid Background - Center Aligned - Double Lines */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-full max-w-[1200px] h-full flex justify-between px-8 md:px-16 lg:px-24">
          {/* Desktop: 7 columns - double lines for middle, single for first/last */}
          <div className="hidden lg:flex w-full h-full justify-between">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex gap-[16px]">
                {i === 0 || i === 6 ? (
                  // First and last: single line
                  <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                ) : (
                  // Middle: double lines
                  <>
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Tablet: 4 columns - double lines for middle, single for first/last */}
          <div className="hidden md:flex lg:hidden w-full h-full justify-between">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-[16px]">
                {i === 0 || i === 3 ? (
                  // First and last: single line
                  <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                ) : (
                  // Middle: double lines
                  <>
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile: 2 columns - all single lines */}
          <div className="flex md:hidden w-full h-full justify-between">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">THE STUDIO</h2>
          <p 
            className="text-[#A7A7A7] text-sm sm:text-base md:text-xl leading-relaxed max-w-xl"
            onMouseEnter={() => setIsTextCursor(true)}
            onMouseLeave={() => setIsTextCursor(false)}
          >
            A collection of graphic design, campaign visuals, brand explorations, cinematic storytelling, and creative experiments.
          </p>
        </div>

        <StudioWindow />
      </div>
    </section>
  );
}
function StudioWindow() {
  const navigate = useNavigate();
  const { setCursorMode, setCursorText } = useCursor();
  const frameRef = useRef<HTMLButtonElement>(null);
  const width = useMotionValue(1000);
  const intro = useMotionValue(PREVIEW_ZOOM);
  const drift = useMotionValue(0);
  const [entering, setEntering] = useState<{ rect: DOMRect; drift: number } | null>(null);

  // Slowly follow the thread through the first few works and back, like someone scrolling inside
  useEffect(() => {
    if (entering) return;
    const controls = animate(drift, [0, 1], { duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1.2 });
    return () => controls.stop();
  }, [drift, entering]);

  // Track the window's width so the page inside scales with it
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => width.set(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const resetCursor = () => {
    setCursorMode("default");
    setCursorText("");
  };

  const enter = () => {
    const el = frameRef.current;
    if (!el || entering) return;
    resetCursor();
    setEntering({ rect: el.getBoundingClientRect(), drift: drift.get() });
  };

  return (
    <>
      <motion.button
        ref={frameRef}
        type="button"
        onClick={enter}
        onMouseEnter={() => {
          setCursorMode("project");
          setCursorText("Enter\nthe Studio");
        }}
        onMouseLeave={resetCursor}
        aria-label="Enter the Studio"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        // named group so hovering the window doesn't trigger the tiles' own hover captions
        className="group/window relative block w-full overflow-hidden rounded-2xl border border-white/15 bg-black text-left shadow-[0_40px_120px_rgba(0,0,0,0.8)] hover:border-white/35 transition-colors duration-500"
        style={{
          visibility: entering ? "hidden" : "visible",
          // the screen's shape, so it reads as a window onto the page — capped so it never fills the screen
          aspectRatio: `${window.innerWidth} / ${window.innerHeight}`,
          maxHeight: "72vh",
        }}
      >
        {/* Soften + darken the preview on hover so the "Enter the Studio" cursor stands out */}
        <div className="absolute inset-0 transition-[filter] duration-300 group-hover/window:blur-[3px]">
          <ScaledStudio width={width} introProgress={intro} drift={drift} />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-black/55 opacity-0 group-hover/window:opacity-100 transition-opacity duration-300" />

        {/* Touch screens have no hover cursor, so they get a visible button instead */}
        <span
          className="[@media(hover:hover)]:hidden absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-[11px] uppercase tracking-[0.15em] pointer-events-none"
          style={mono}
        >
          Enter the Studio <ArrowUpRight size={14} />
        </span>
      </motion.button>

      {entering && createPortal(<EnteringWindow from={entering.rect} startDrift={entering.drift} dimmed={window.matchMedia("(hover: hover)").matches} onDone={() => navigate("/studio", { state: { fromPreview: true } })} />, document.body)}
    </>
  );
}

// A copy of the window, fixed above everything, that grows from where the window was to the full screen
// `dimmed`: the window was hovered (darkened) when clicked, so the copy starts dark and clears as it grows
function EnteringWindow({ from, startDrift, dimmed, onDone }: { from: DOMRect; startDrift: number; dimmed: boolean; onDone: () => void }) {
  const intro = useMotionValue(PREVIEW_ZOOM);
  const drift = useMotionValue(startDrift);
  const left = useMotionValue(from.left);
  const top = useMotionValue(from.top);
  const width = useMotionValue(from.width);
  const height = useMotionValue(from.height);
  const radius = useMotionValue(16);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const opts = { duration: 0.85, ease: EASE };
    const all = [
      animate(left, 0, opts),
      animate(top, 0, opts),
      animate(width, window.innerWidth, opts),
      animate(height, window.innerHeight, opts),
      animate(radius, 0, opts),
      animate(intro, 1, opts), // zoom in to the landing frame the Studio page opens on
      animate(drift, 0, opts), // and travel back to the start of the thread
    ];
    Promise.all(all.map((a) => a.finished)).then(() => {
      document.body.style.overflow = "";
      onDone();
    });
    return () => {
      all.forEach((a) => a.stop());
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed z-[5000] overflow-hidden bg-black border border-white/15"
      style={{ left, top, width, height, borderRadius: radius }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ filter: dimmed ? "blur(3px)" : "blur(0px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ScaledStudio width={width} introProgress={intro} drift={drift} />
      </motion.div>
      {dimmed && (
        <motion.div
          className="absolute inset-0 bg-black/55"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}
