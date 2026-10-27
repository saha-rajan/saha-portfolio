import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface TrifoldViewerProps {
  outside: string; // outside spread: [inner flap | back | front cover]
  inside: string; // inside spread: [left | middle | right]
  onClose: () => void;
}

// 0 = closed showing cover, 1 = cover opened (flap still tucked), 2 = fully open, 3 = closed + flipped to back
type Step = 0 | 1 | 2 | 3;

const STEPS: { label: string; hint: string }[] = [
  { label: "Cover", hint: "Click to open the cover" },
  { label: "Cover open", hint: "Click to unfold the flap" },
  { label: "Fully open", hint: "Click to fold and flip" },
  { label: "Back", hint: "Click to return to the cover" },
];

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const ease = [0.65, 0, 0.35, 1] as const;

// Soft shading along fold lines so the panels read as paper
const creaseShade =
  "linear-gradient(to right, rgba(0,0,0,0.10), transparent 5%, transparent 95%, rgba(0,0,0,0.10))";

function Face({ src, third, back = false }: { src: string; third: 0 | 1 | 2; back?: boolean }) {
  const style: CSSProperties = {
    backgroundImage: `${creaseShade}, url(${src})`,
    backgroundSize: "100% 100%, 300% 100%",
    backgroundPosition: `0 0, ${third * 50}% 0`,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: back ? "rotateY(180deg)" : undefined,
  };
  return <div className="absolute inset-0 bg-white" style={style} />;
}

function ViewerControls({ steps, step, go }: { steps: { label: string; hint: string }[]; step: number; go: (n: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-3" style={mono}>
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
        <button
          onClick={() => go(step - 1)}
          aria-label="Previous"
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {steps.map((s, i) => (
          <button
            key={s.label}
            onClick={() => go(i)}
            className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-[0.15em] transition-colors ${
              i === step ? "bg-white text-black" : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => go(step + 1)}
          aria-label="Next"
          className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">{steps[step].hint} · ← → keys</p>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      className="absolute top-0 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10"
    >
      <X size={24} />
    </button>
  );
}

export function TrifoldViewer({ outside, inside, onClose }: TrifoldViewerProps) {
  const [step, setStep] = useState<Step>(0);
  const prevStep = useRef<Step>(0);

  const go = (next: number) => setStep((((next % 4) + 4) % 4) as Step);

  useEffect(() => {
    prevStep.current = step;
  }, [step]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setStep((s) => ((s + 1) % 4) as Step);
      if (e.key === "ArrowLeft") setStep((s) => ((s + 3) % 4) as Step);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const leftOpen = step === 1 || step === 2;
  const rightOpen = step === 2;

  // Sequence the folds: cover opens before the flap, flap closes before the cover
  const prev = prevStep.current;
  const leftWasOpen = prev === 1 || prev === 2;
  const rightWasOpen = prev === 2;
  const openingBoth = !leftWasOpen && leftOpen && !rightWasOpen && rightOpen;
  const closingBoth = leftWasOpen && !leftOpen && rightWasOpen && !rightOpen;
  const leftDelay = closingBoth ? 0.45 : 0;
  const rightDelay = openingBoth ? 0.45 : 0;
  const flipDelay = step === 3 && leftWasOpen ? (rightWasOpen ? 0.95 : 0.55) : 0;

  const stageVars = {
    "--ph": "min(70vh, calc(92vw / 3 / 0.4314))",
    "--pw": "calc(var(--ph) * 0.4314)",
  } as CSSProperties;

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-8 cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <CloseButton onClose={onClose} />

      {/* 3D stage */}
      <div className="flex items-center justify-center" style={{ ...stageVars, perspective: "2600px" }}>
        <motion.div
          className="relative cursor-pointer"
          style={{ width: "var(--pw)", height: "var(--ph)", transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ x: step === 1 ? "50%" : "0%", rotateY: step === 3 ? 180 : 0, rotateX: 4 }}
          transition={{ duration: 0.8, ease, delay: flipDelay }}
          onClick={() => go(step + 1)}
        >
          {/* Middle panel — inside middle / outside back */}
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            <Face src={inside} third={1} />
            <Face src={outside} third={1} back />
          </div>

          {/* Right panel — the tuck-in flap, hinged on the middle's right edge */}
          <motion.div
            className="absolute top-0 left-full w-full h-full"
            style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
            initial={false}
            animate={{ rotateY: rightOpen ? 0 : -180, z: rightOpen ? 0 : 2 }}
            transition={{ duration: 0.8, ease, delay: rightDelay }}
          >
            <Face src={inside} third={2} />
            <Face src={outside} third={0} back />
          </motion.div>

          {/* Left panel — the front cover, hinged on the middle's left edge */}
          <motion.div
            className="absolute top-0 right-full w-full h-full"
            style={{ transformStyle: "preserve-3d", transformOrigin: "right center" }}
            initial={false}
            animate={{ rotateY: leftOpen ? 0 : 180, z: leftOpen ? 0 : 4 }}
            transition={{ duration: 0.8, ease, delay: leftDelay }}
          >
            <Face src={inside} third={0} />
            <Face src={outside} third={2} back />
          </motion.div>
        </motion.div>
      </div>

      <ViewerControls steps={STEPS} step={step} go={go} />
    </div>
  );
}

export interface SheetPage {
  src: string;
  label: string;
}

interface SheetViewerProps {
  pages: SheetPage[];
  aspect: number; // width / height of one page
  onClose: () => void;
}

// One sheet that flips over. With more than two pages, the face turning away gets
// swapped to the next page so a set of sheets flips through like the 2-sided flyer.
export function SheetViewer({ pages, aspect, onClose }: SheetViewerProps) {
  const [view, setView] = useState({
    current: 0,
    rotation: 0,
    faces: [pages[0].src, pages[1 % pages.length].src],
  });

  const currentRef = useRef(0);
  currentRef.current = view.current;

  // target may run past either end (prev on first / next on last) — it wraps, and the
  // unwrapped value sets which way the sheet turns
  const go = (target: number) => {
    setView((v) => {
      const next = ((target % pages.length) + pages.length) % pages.length;
      if (next === v.current) return v;
      const dir = target < v.current ? -1 : 1;
      const visibleFace = ((v.rotation / 180) % 2 + 2) % 2;
      const faces = [...v.faces];
      faces[1 - visibleFace] = pages[next].src;
      return { current: next, rotation: v.rotation + dir * 180, faces };
    });
  };

  useEffect(() => {
    pages.forEach((p) => {
      new Image().src = p.src;
    });
  }, [pages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(currentRef.current + 1);
      if (e.key === "ArrowLeft") go(currentRef.current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const steps = pages.map((p) => ({
    label: p.label,
    hint: pages.length === 2 ? "Click to flip the sheet" : "Click to flip to the next sheet",
  }));

  const stageVars = {
    "--ph": `min(70vh, calc(88vw / ${aspect}))`,
    "--pw": `calc(var(--ph) * ${aspect})`,
  } as CSSProperties;

  const faceStyle = (src: string, flipped: boolean): CSSProperties => ({
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: flipped ? "rotateY(180deg)" : undefined,
  });

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-8 cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <CloseButton onClose={onClose} />

      <div className="flex items-center justify-center" style={{ ...stageVars, perspective: "2600px" }}>
        <motion.div
          className="relative cursor-pointer"
          style={{ width: "var(--pw)", height: "var(--ph)", transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ rotateY: view.rotation, rotateX: 4 }}
          transition={{ duration: 0.8, ease }}
          onClick={() => go(view.current + 1)}
        >
          <div className="absolute inset-0 bg-white" style={faceStyle(view.faces[0], false)} />
          <div className="absolute inset-0 bg-white" style={faceStyle(view.faces[1], true)} />
        </motion.div>
      </div>

      <ViewerControls steps={steps} step={view.current} go={go} />
    </div>
  );
}

// A pile of separate sheets: the chosen sheet slides out of the pile and lands on top
export function StackViewer({ pages, aspect, onClose }: SheetViewerProps) {
  const [order, setOrder] = useState(() => pages.map((_, i) => i)); // order[0] is on top
  const [pulling, setPulling] = useState<number | null>(null);
  const current = order[0];

  const currentRef = useRef(current);
  currentRef.current = current;
  const pullingRef = useRef(pulling);
  pullingRef.current = pulling;

  const go = (target: number) => {
    const next = ((target % pages.length) + pages.length) % pages.length;
    if (pullingRef.current !== null || next === currentRef.current) return;
    setPulling(next);
  };

  const land = (i: number) => {
    if (pulling !== i) return;
    setOrder((o) => [i, ...o.filter((x) => x !== i)]);
    setPulling(null);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(currentRef.current + 1);
      if (e.key === "ArrowLeft") go(currentRef.current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = pages.map((p) => ({ label: p.label, hint: "Click to pull out the next sheet" }));

  const stageVars = {
    "--ph": `min(66vh, calc(60vw / ${aspect}))`,
    "--pw": `calc(var(--ph) * ${aspect})`,
  } as CSSProperties;

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-8 cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <CloseButton onClose={onClose} />

      <div
        className="relative cursor-pointer"
        style={{ ...stageVars, width: "var(--pw)", height: "var(--ph)" }}
        onClick={() => go(current + 1)}
      >
        {pages.map((page, i) => {
          const depth = order.indexOf(i);
          const isPulling = pulling === i;
          return (
            <motion.div
              key={page.src}
              className="absolute inset-0 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{
                backgroundImage: `url(${page.src})`,
                backgroundSize: "cover",
                zIndex: pages.length - depth,
              }}
              initial={false}
              animate={
                isPulling
                  ? { x: "72%", y: "-3%", rotate: 7 }
                  : { x: `${depth * 2.5}%`, y: `${depth * 2}%`, rotate: depth === 0 ? 0 : depth % 2 ? -2.5 : 2 }
              }
              transition={{ duration: isPulling ? 0.4 : 0.5, ease }}
              onAnimationComplete={() => land(i)}
            />
          );
        })}
      </div>

      <ViewerControls steps={steps} step={current} go={go} />
    </div>
  );
}

// ---- Scroll-driven versions for the Studio thread view. `progress` runs 0 → 1 as the visitor
// scrolls through the piece, so scrolling back reverses it.

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const phase = (p: number, start: number, length: number) => smoothstep(clamp01((p - start) / length));

const hidden: CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

// One third of a spread image, as one panel face
function ThirdFace({ src, third, back = false }: { src: string; third: 0 | 1 | 2; back?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white" style={{ ...hidden, transform: back ? "rotateY(180deg)" : undefined }}>
      <img
        src={src}
        alt=""
        loading="lazy"
        draggable={false}
        className="absolute top-0 h-full max-w-none select-none"
        style={{ width: "300%", left: `${-third * 100}%` }}
      />
      <div className="absolute inset-0" style={{ background: creaseShade }} />
    </div>
  );
}

// Closed (cover showing) → unfolds to the inside spread → folds back up → turns over to the back panel.
// Fills a box the size of the open spread.
export function ScrollTrifold({ outside, inside, progress }: { outside: string; inside: string; progress: MotionValue<number> }) {
  // opens (cover, then flap), holds open, folds back up (flap, then cover), then turns over to show the back
  const cover = useTransform(progress, (p) => phase(p, 0.04, 0.16) - phase(p, 0.62, 0.14));
  const flap = useTransform(progress, (p) => phase(p, 0.2, 0.16) - phase(p, 0.48, 0.14));
  const flip = useTransform(progress, (p) => 180 * phase(p, 0.78, 0.18));
  const lift = useTransform(flip, (a) => 1 - 0.07 * Math.sin((a * Math.PI) / 180));
  const coverAngle = useTransform(cover, (v) => 180 * (1 - v));
  const coverZ = useTransform(cover, (v) => 4 * (1 - v));
  const flapAngle = useTransform(flap, (v) => -180 * (1 - v));
  const flapZ = useTransform(flap, (v) => 2 * (1 - v));
  // keep the visible part centred: half a panel to the right while only the cover is open
  const shift = useTransform([cover, flap], ([c, f]: number[]) => `${50 * c * (1 - f)}%`);

  return (
    <div className="absolute inset-0" style={{ perspective: "2200px" }}>
      <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateY: flip, scale: lift }}>
      <motion.div
        className="absolute top-0 h-full shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        style={{ left: "33.333%", width: "33.334%", transformStyle: "preserve-3d", x: shift }}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <ThirdFace src={inside} third={1} />
          <ThirdFace src={outside} third={1} back />
        </div>
        <motion.div
          className="absolute top-0 left-full w-full h-full"
          style={{ transformStyle: "preserve-3d", transformOrigin: "left center", rotateY: flapAngle, z: flapZ }}
        >
          <ThirdFace src={inside} third={2} />
          <ThirdFace src={outside} third={0} back />
        </motion.div>
        <motion.div
          className="absolute top-0 right-full w-full h-full"
          style={{ transformStyle: "preserve-3d", transformOrigin: "right center", rotateY: coverAngle, z: coverZ }}
        >
          <ThirdFace src={inside} third={0} />
          <ThirdFace src={outside} third={2} back />
        </motion.div>
      </motion.div>
      </motion.div>
    </div>
  );
}

// Front → turns over → back
export function ScrollFlip({ front, back, progress }: { front: string; back: string; progress: MotionValue<number> }) {
  const angle = useTransform(progress, (p) => 180 * phase(p, 0.25, 0.5));
  const lift = useTransform(angle, (a) => 1 - 0.07 * Math.sin((a * Math.PI) / 180));
  const face = "absolute inset-0 w-full h-full object-cover select-none bg-white";
  return (
    <div className="absolute inset-0" style={{ perspective: "2200px" }}>
      <motion.div className="absolute inset-0 shadow-[0_30px_60px_rgba(0,0,0,0.55)]" style={{ transformStyle: "preserve-3d", rotateY: angle, scale: lift }}>
        <img src={front} alt="" loading="lazy" draggable={false} className={face} style={hidden} />
        <img src={back} alt="" loading="lazy" draggable={false} className={face} style={{ ...hidden, transform: "rotateY(180deg)" }} />
      </motion.div>
    </div>
  );
}

// A pile of separate sheets: each top sheet slides out (away from the details panel) and tucks under the pile
export function ScrollStack({ pages, progress, side }: { pages: string[]; progress: MotionValue<number>; side: 1 | -1 }) {
  const n = pages.length;
  const out = -side; // slide toward the side without the details panel
  const span = 0.8 / (n - 1);

  // Sheet j's place in the pile at progress p: depth (0 = top, continuous) and how far it is slid out
  const state = (p: number, j: number) => {
    let done = 0;
    let mover = -1;
    let t = 0;
    for (let k = 0; k < n - 1; k++) {
      const tk = clamp01((p - (0.1 + k * span)) / span);
      if (tk >= 1) done++;
      else if (tk > 0) { mover = k; t = tk; }
    }
    const base = (((j - done) % n) + n) % n;
    if (j === mover) return { depth: (n - 1) * smoothstep(t), slide: Math.sin(Math.PI * t), above: t < 0.5 };
    return { depth: mover >= 0 && base > 0 ? base - smoothstep(t) : base, slide: 0, above: false };
  };

  return (
    <div className="absolute inset-0">
      {pages.map((src, j) => (
        <StackSheet key={src} src={src} progress={progress} state={(p) => state(p, j)} n={n} out={out} />
      ))}
    </div>
  );
}

function StackSheet({ src, progress, state, n, out }: {
  src: string; progress: MotionValue<number>; n: number; out: number;
  state: (p: number) => { depth: number; slide: number; above: boolean };
}) {
  const x = useTransform(progress, (p) => { const s = state(p); return `${out * (s.slide * 72 - s.depth * 3)}%`; });
  const y = useTransform(progress, (p) => { const s = state(p); return `${s.depth * 2.5 - s.slide * 4}%`; });
  const rotate = useTransform(progress, (p) => { const s = state(p); return out * (s.slide * 9 - s.depth * 2.5); });
  const zIndex = useTransform(progress, (p) => { const s = state(p); return s.above ? 100 : Math.round((n - s.depth) * 10); });
  return (
    <motion.img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      className="absolute left-[6%] top-[3%] w-[88%] h-[88%] object-cover bg-white select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      style={{ x, y, rotate, zIndex }}
    />
  );
}
