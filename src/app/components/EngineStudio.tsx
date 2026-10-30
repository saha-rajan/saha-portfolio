import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, useMotionValue, useTransform, type MotionValue } from "motion/react";
import type { EngineLook } from "./JetEngine";
import { CloseButton } from "./TrifoldViewer";

// The turbofan in the Studio. three.js and the 0.9 MB model only load once the piece is near the
// screen; until then (and on the homepage window) a still of the assembled engine stands in.
const JetEngine = lazy(() => import("./JetEngine").then((m) => ({ default: m.JetEngine })));

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const phase = (p: number, start: number, length: number) => smoothstep(clamp01((p - start) / length));

// true once the element has come within `margin` of the viewport (then stays true)
function useNear<T extends HTMLElement>(margin = "300px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin]);
  return [ref, near] as const;
}

// Poster until the live engine has drawn its first frame, then a quick cross-fade
function EngineStage({ poster, live, children }: { poster: string; live: boolean; children: (onReady: () => void) => ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <>
      {live && <Suspense fallback={null}>{children(() => setReady(true))}</Suspense>}
      <img
        src={poster}
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500"
        style={{ opacity: ready ? 0 : 1 }}
      />
    </>
  );
}

function Toggle<T extends string>({ options, value, onChange, small }: { options: { key: T; label: string }[]; value: T; onChange: (v: T) => void; small?: boolean }) {
  return (
    <div className="inline-flex p-0.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-sm" style={mono} role="group">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={o.key === value}
          onClick={(e) => {
            e.stopPropagation();
            onChange(o.key);
          }}
          className={`rounded-full uppercase tracking-[0.14em] transition-colors ${small ? "px-2.5 py-1 text-[9px] md:text-[10px]" : "px-3 py-1.5 text-[10px] md:text-xs"} ${
            o.key === value ? "bg-white text-black" : "text-white/60 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const LOOKS: { key: EngineLook; label: string }[] = [
  { key: "technical", label: "Technical" },
  { key: "real", label: "Render" },
];
const STATES: { key: "assembled" | "exploded"; label: string }[] = [
  { key: "assembled", label: "Assembled" },
  { key: "exploded", label: "Exploded" },
];

// The canvas reaches past the card on every side, so close-ups can grow beyond the card's frame
const BLEED = { x: 0.3, y: 0.25 };
const FIT_SCALE = 1 + 2 * BLEED.y;
// close-ups can reach the canvas edge: fade it out instead of a hard cut
const SOFT_EDGES = {
  maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

// Thread, as you scroll through the card:
//   push in on the assembled engine → pull back as it comes apart → fly to each part in turn (01–15)
//   → pull back and put it back together before the thread moves on
export function EngineThreadCard({ poster, progress, preview }: { poster: string; progress: MotionValue<number>; preview?: boolean }) {
  const [ref, near] = useNear<HTMLDivElement>("200px");
  const [look, setLook] = useState<EngineLook>("technical");
  const explode = useTransform(progress, (p) => phase(p, 0.1, 0.14) - phase(p, 0.88, 0.1));
  const dolly = useTransform(progress, (p) => 1 - 0.38 * phase(p, 0, 0.08) + 0.38 * phase(p, 0.08, 0.14));
  const tour = useTransform(progress, (p) => (p < 0.25 || p > 0.86 ? -1 : (p - 0.25) / 0.61));
  return (
    <div ref={ref} className="absolute inset-0">
      <EngineStage poster={poster} live={near && !preview}>
        {(onReady) => (
          <div className="absolute pointer-events-none" style={{ inset: `${-BLEED.y * 100}% ${-BLEED.x * 100}%`, ...SOFT_EDGES }}>
            <JetEngine explode={explode} tour={tour} dolly={dolly} fitScale={FIT_SCALE} look={look} onReady={onReady} />
          </div>
        )}
      </EngineStage>
      {!preview && (
        <div className="absolute top-0 left-0">
          <Toggle options={LOOKS} value={look} onChange={setLook} small />
        </div>
      )}
    </div>
  );
}

function useExplode(initial: boolean) {
  const explode = useMotionValue(initial ? 1 : 0);
  const [state, setState] = useState<"assembled" | "exploded">(initial ? "exploded" : "assembled");
  const set = (s: "assembled" | "exploded") => {
    setState(s);
    animate(explode, s === "exploded" ? 1 : 0, { duration: 1.6, ease: [0.45, 0, 0.25, 1] });
  };
  return { explode, state, set };
}

// Grid: a live tile with the same switches; clicking the engine opens the full-screen viewer
export function EngineTile({ poster, title, meta, onExpand }: { poster: string; title: string; meta: string; onExpand: () => void }) {
  const [ref, near] = useNear<HTMLDivElement>("300px");
  const [look, setLook] = useState<EngineLook>("technical");
  const { explode, state, set } = useExplode(false);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={onExpand} aria-label={`Open ${title}`} className="relative block w-full overflow-hidden rounded-sm bg-[#050505]" style={{ aspectRatio: "1.6" }}>
        <EngineStage poster={poster} live={near}>
          {(onReady) => <JetEngine explode={explode} look={look} onReady={onReady} />}
        </EngineStage>
      </button>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3 md:p-4 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.35)_60%,transparent_100%)] pointer-events-none" style={mono}>
        <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300">
          <span className="text-white text-xs md:text-sm font-medium tracking-wide">{title}</span>
          <span className="text-white/60 text-[10px] uppercase tracking-[0.18em]">{meta}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pointer-events-auto">
          <Toggle options={STATES} value={state} onChange={set} small />
          <Toggle options={LOOKS} value={look} onChange={setLook} small />
        </div>
      </div>
    </div>
  );
}

// Full screen: drag to orbit, hover a part to name it
export function EngineViewer({ poster, onClose }: { poster: string; onClose: () => void }) {
  const [look, setLook] = useState<EngineLook>("technical");
  const { explode, state, set } = useExplode(true);
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 cursor-default" onClick={(e) => e.stopPropagation()}>
      <CloseButton onClose={onClose} />
      <div className="relative" style={{ width: "min(100%, 72rem, 115vh)", aspectRatio: "1.6" }}>
        <EngineStage poster={poster} live>
          {(onReady) => <JetEngine explode={explode} look={look} interactive onReady={onReady} />}
        </EngineStage>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Toggle options={STATES} value={state} onChange={set} />
          <Toggle options={LOOKS} value={look} onChange={setLook} />
        </div>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]" style={mono}>Drag to rotate · scroll to zoom · hover a part to name it</p>
      </div>
    </div>
  );
}
