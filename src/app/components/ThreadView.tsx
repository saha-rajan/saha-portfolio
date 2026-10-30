import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motionValue, type MotionValue } from "motion/react";
import { ArrowUpRight, ChevronsDown } from "lucide-react";

// Normalized rect inside a card's media box (0–1 on each axis)
export interface Rect { x: number; y: number; w: number; h: number }

export interface ThreadItem {
  id: number;
  title: string;
  meta: string;
  blurb: string;
  cta: string;
  aspect: number; // media width / height
  category: string;
  logoAt?: Rect; // where the shared Future Fab Heroes logo sits in this design
  // Pieces that animate as you scroll (unfold, flip, shuffle): no frame behind them, a longer stop
  // on the thread, and this hint in place of the open button
  scrollHint?: string;
  dwell?: number; // how long (in screen heights) the camera rests on this piece, when it needs more than the default
}

export interface MediaState {
  playing: boolean; // this card is the one in focus
  progress: MotionValue<number>; // 0 → 1 while scrolling through this card's stop
  side: 1 | -1; // which side the details panel is on
}

export interface ThreadSection { key: string; label: string; intro: string }

type Stop =
  | { kind: "section"; section: ThreadSection; number: number }
  | { kind: "card"; item: ThreadItem; number: number; section: ThreadSection };

interface Placed {
  stop: Stop;
  x: number; y: number; w: number; h: number;
  tilt: number; zoom: number; focus: number;
  side: 1 | -1; // details panel on the right (1) or left (-1), whichever covers fewer neighbours
  len: number; // distance along the thread
  sIn: number; sOut: number; // scroll range (in screen-heights) where the camera rests on this stop
}

interface Layout {
  placed: Placed[];
  xs: Float32Array; ys: Float32Array; cum: Float32Array; pathD: string; totalLen: number;
  total: number; unitPx: number; mobile: boolean; S: number;
  overview: { x: number; y: number; z: number };
}

interface Cam { x: number; y: number; z: number; focus: number; ox: number }

const INTRO = 1.1; // overview → first stop
const TRAVEL = 0.7; // between two stops
const TRAVEL_SECTION = 0.55; // into or out of a chapter heading
const DWELL = 0.3; // resting on a card
const DWELL_SECTION = 0.25;
const DWELL_SCROLL_PIECE = 1.5; // resting on a piece that unfolds/flips as you scroll
const OFFSET = 0.17; // how far (× viewport) the camera shifts the open card away from the panel
const OUTRO_MOVE = 1.2; // last stop → overview
const OUTRO_HOLD = 0.7; // rest on the overview before looping

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

function buildLayout(stops: Stop[], vw: number, vh: number): Layout {
  const mobile = vw < 768;
  const S = Math.min(760, Math.max(340, vh * 0.6)); // card side for a square piece, in canvas px
  // Wide enough that a resting card's neighbours sit clear of the details panel
  const colGap = Math.max(S * 1.75, vw * 0.6 + S * 0.6);
  const rowGap = S * 1.8;
  const cols = Math.max(3, Math.min(7, Math.round(Math.sqrt(stops.length * (vw / vh) * (rowGap / colGap)))));

  const placed: Placed[] = stops.map((stop, i) => {
    const row = Math.floor(i / cols);
    const c = i % cols;
    const col = row % 2 === 0 ? c : cols - 1 - c; // serpentine: rows alternate direction
    let w = S * 1.3;
    let h = S * 0.62;
    if (stop.kind === "card") {
      const a = stop.item.aspect;
      w = S * Math.sqrt(a);
      h = S / Math.sqrt(a);
      if (w > S * 1.6) { w = S * 1.6; h = w / a; }
    }
    const zoom =
      stop.kind === "card"
        ? Math.min(1, (vh * (mobile ? 0.42 : 0.66)) / h, (vw * (mobile ? 0.86 : 0.5)) / w)
        : Math.min(1, (vw * 0.86) / w);
    return {
      stop,
      x: col * colGap + (rand(i) - 0.5) * colGap * 0.24,
      y: row * rowGap + (rand(i + 50) - 0.5) * rowGap * 0.3,
      w, h,
      tilt: stop.kind === "card" ? (rand(i + 99) - 0.5) * 16 : 0,
      zoom,
      focus: stop.kind === "card" ? 1 : 0,
      side: 1,
      len: 0,
      sIn: 0,
      sOut: 0,
    };
  });

  // Put each card's details panel on the side where it covers the least of the neighbouring cards
  const panelW = Math.min(380, vw * 0.3);
  const covered = (i: number, side: 1 | -1) => {
    const p = placed[i];
    const px0 = side === 1 ? vw * 0.95 - panelW : vw * 0.05;
    const py0 = vh / 2 - 270, py1 = vh / 2 + 270;
    let area = 0;
    placed.forEach((q, j) => {
      if (j === i) return;
      const sc = q.stop.kind === "card" ? 0.68 : 1;
      const cx = vw / 2 - side * OFFSET * vw + (q.x - p.x) * p.zoom;
      const cy = vh / 2 + (q.y - p.y) * p.zoom;
      const hw = (q.w / 2) * p.zoom * sc, hh = (q.h / 2) * p.zoom * sc;
      const w = Math.min(cx + hw, px0 + panelW) - Math.max(cx - hw, px0);
      const h = Math.min(cy + hh, py1) - Math.max(cy - hh, py0);
      if (w > 0 && h > 0) area += w * h;
    });
    return area;
  };
  if (!mobile) {
    placed.forEach((p, i) => {
      if (p.stop.kind === "card" && covered(i, -1) < covered(i, 1)) p.side = -1;
    });
  }

  // Knots the thread passes through: a lead-in, every stop, a loop-around at each row end, a lead-out
  const knots: { x: number; y: number }[] = [];
  const stopKnot: number[] = [];
  knots.push({ x: placed[0].x - colGap * 0.9, y: placed[0].y - rowGap * 0.4 });
  placed.forEach((p, i) => {
    stopKnot.push(knots.length);
    knots.push({ x: p.x, y: p.y });
    const row = Math.floor(i / cols);
    const dir = row % 2 === 0 ? 1 : -1;
    if (i % cols === cols - 1 && i < placed.length - 1) {
      knots.push({ x: p.x + dir * colGap * 0.62, y: (p.y + placed[i + 1].y) / 2 });
    }
  });
  const last = placed[placed.length - 1];
  const lastDir = Math.floor((placed.length - 1) / cols) % 2 === 0 ? 1 : -1;
  knots.push({ x: last.x + lastDir * colGap * 0.9, y: last.y + rowGap * 0.4 });

  // Catmull-Rom through the knots, sampled into a polyline with cumulative lengths
  const px: number[] = [];
  const py: number[] = [];
  const knotSample: number[] = [];
  for (let i = 0; i < knots.length - 1; i++) {
    const p0 = knots[Math.max(0, i - 1)], p1 = knots[i], p2 = knots[i + 1], p3 = knots[Math.min(knots.length - 1, i + 2)];
    const steps = Math.max(8, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 18));
    knotSample[i] = px.length;
    for (let j = 0; j < steps; j++) {
      const t = j / steps, t2 = t * t, t3 = t2 * t;
      px.push(0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3));
      py.push(0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3));
    }
  }
  knotSample[knots.length - 1] = px.length;
  px.push(knots[knots.length - 1].x);
  py.push(knots[knots.length - 1].y);

  const xs = Float32Array.from(px), ys = Float32Array.from(py);
  const cum = new Float32Array(xs.length);
  for (let i = 1; i < xs.length; i++) cum[i] = cum[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]);
  const pathD = "M" + px.map((x, i) => `${x.toFixed(1)} ${py[i].toFixed(1)}`).join("L");

  // Scroll timeline: travel between stops, then rest on each one (longer on pieces that animate)
  let s = INTRO;
  placed.forEach((p, i) => {
    p.len = cum[knotSample[stopKnot[i]]];
    if (i > 0) s += placed[i - 1].stop.kind === "section" || p.stop.kind === "section" ? TRAVEL_SECTION : TRAVEL;
    p.sIn = s;
    s += p.stop.kind === "section" ? DWELL_SECTION : p.stop.item.dwell ?? (p.stop.item.scrollHint ? DWELL_SCROLL_PIECE : DWELL);
    p.sOut = s;
  });

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of placed) {
    minX = Math.min(minX, p.x - p.w / 2); maxX = Math.max(maxX, p.x + p.w / 2);
    minY = Math.min(minY, p.y - p.h / 2); maxY = Math.max(maxY, p.y + p.h / 2);
  }
  for (const k of knots) {
    minX = Math.min(minX, k.x); maxX = Math.max(maxX, k.x);
    minY = Math.min(minY, k.y); maxY = Math.max(maxY, k.y);
  }

  return {
    placed, xs, ys, cum, pathD, totalLen: cum[cum.length - 1],
    total: s + OUTRO_MOVE + OUTRO_HOLD,
    unitPx: vh * 0.85,
    mobile, S,
    overview: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2 + (maxY - minY) * 0.04,
      z: Math.min((vw * 0.92) / (maxX - minX), (vh * (mobile ? 0.62 : 0.74)) / (maxY - minY)),
    },
  };
}

function pointAt(L: Layout, len: number) {
  const { cum, xs, ys } = L;
  let lo = 0, hi = cum.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < len) lo = mid; else hi = mid;
  }
  const t = cum[hi] > cum[lo] ? clamp01((len - cum[lo]) / (cum[hi] - cum[lo])) : 0;
  return { x: lerp(xs[lo], xs[hi], t), y: lerp(ys[lo], ys[hi], t) };
}

const stopCam = (p: Placed): Cam => ({ x: p.x, y: p.y, z: p.zoom, focus: p.focus, ox: p.focus * p.side });

function mixCam(a: Cam, b: Cam, t: number): Cam {
  return {
    x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), t)),
    focus: lerp(a.focus, b.focus, t), ox: lerp(a.ox, b.ox, t),
  };
}

// Where the camera is, how far along the thread it has travelled, and which pair of stops it is between
function cameraAt(L: Layout, s: number) {
  const { placed, overview } = L;
  const ov: Cam = { ...overview, focus: 0, ox: 0 };
  const first = placed[0], last = placed[placed.length - 1];
  if (s <= first.sIn) {
    const t = smooth(clamp01(s / first.sIn));
    return { cam: mixCam(ov, stopCam(first), t), progress: first.len * t, pair: null as null | { k: number; f: number } };
  }
  if (s >= last.sOut) {
    const t = smooth(clamp01((s - last.sOut) / OUTRO_MOVE));
    return { cam: mixCam(stopCam(last), ov, t), progress: lerp(last.len, L.totalLen, t), pair: null };
  }
  let k = 0;
  while (k < placed.length - 1 && placed[k + 1].sIn <= s) k++;
  const a = placed[k];
  if (s <= a.sOut) return { cam: stopCam(a), progress: a.len, pair: null };
  const b = placed[k + 1];
  const f = smooth(clamp01((s - a.sOut) / (b.sIn - a.sOut)));
  const len = lerp(a.len, b.len, f);
  const pt = pointAt(L, len);
  const z = Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), f)) * (1 - 0.34 * Math.sin(Math.PI * f));
  const ca = stopCam(a), cb = stopCam(b);
  return { cam: { x: pt.x, y: pt.y, z, focus: lerp(ca.focus, cb.focus, f), ox: lerp(ca.ox, cb.ox, f) }, progress: len, pair: { k, f } };
}

// Distance (in screen-heights) from scroll position s to a stop's resting range
function distTo(p: Placed, s: number) {
  return s < p.sIn ? p.sIn - s : s > p.sOut ? s - p.sOut : 0;
}

// How open a card is: 1 while the camera rests on it, easing to 0 as it travels away
function openness(L: Layout, i: number, s: number) {
  const { placed } = L;
  const p = placed[i];
  const d = distTo(p, s);
  if (d === 0) return 1;
  const gap = s < p.sIn
    ? (i > 0 ? p.sIn - placed[i - 1].sOut : p.sIn)
    : (i < placed.length - 1 ? placed[i + 1].sIn - p.sOut : OUTRO_MOVE);
  return 1 - smooth(clamp01(d / (gap * 0.6)));
}

interface ThreadViewProps<T extends ThreadItem> {
  items: T[];
  sections: ThreadSection[];
  renderMedia: (item: T, state: MediaState) => ReactNode;
  onOpen: (id: number) => void;
  onGrid: () => void;
  logo: { src: string; crop: Rect }; // the shared logo image and its content box inside the file
  // Preview mode (homepage window): no page scrolling — the camera rests on the landing frame (the first
  // chapter card), zoomed out by PREVIEW_ZOOM_OUT at 0 and exactly as the real page opens at 1
  introProgress?: MotionValue<number>;
  // 0 → 1 moves the preview's camera from the landing frame along the first few works of the thread
  previewDrift?: MotionValue<number>;
}

const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const PREVIEW_ZOOM_OUT = 0.5;
const PREVIEW_DRIFT_STOPS = 4; // how far along the thread the homepage preview travels

export function ThreadView<T extends ThreadItem>({ items, sections, renderMedia, onOpen, onGrid, logo, introProgress, previewDrift }: ThreadViewProps<T>) {
  const preview = introProgress !== undefined;
  const stops = useMemo(() => {
    const out: Stop[] = [];
    let n = 0;
    sections.forEach((section, si) => {
      out.push({ kind: "section", section, number: si + 1 });
      items.filter((it) => it.category === section.key).forEach((item) => out.push({ kind: "card", item, number: ++n, section }));
    });
    return out;
  }, [items, sections]);
  const cardCount = stops.filter((s) => s.kind === "card").length;

  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const L = useMemo(() => buildLayout(stops, viewport.w, viewport.h), [stops, viewport]);
  const layoutRef = useRef(L);
  layoutRef.current = L;

  const cardProgress = useMemo(() => stops.map(() => motionValue(0)), [stops]);

  const [active, setActive] = useState(-1); // index into stops of the stop the camera is nearest
  const activeRef = useRef(-1);

  const stopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const veilRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const groupRef = useRef<SVGGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const floaterRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hintBarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  // Land on the first chapter card (the overview is one scroll up, and is where the loop wraps)
  const landing = L.placed[0].sIn;
  const cur = useRef(landing);

  useEffect(() => {
    if (preview) return;
    window.scrollTo(0, Math.round(layoutRef.current.placed[0].sIn * layoutRef.current.unitPx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const rendered = useRef(-1);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Draw one frame for scroll position s (in screen-heights). Writes styles directly — no React render per frame.
  const draw = (s: number) => {
    const Lc = layoutRef.current;
    const vw = window.innerWidth, vh = window.innerHeight;
    const { cam, progress, pair } = cameraAt(Lc, s);
    if (preview) cam.z *= lerp(PREVIEW_ZOOM_OUT, 1, introProgress.get());
    const offX = Lc.mobile ? 0 : cam.ox * vw * OFFSET;
    const offY = Lc.mobile ? cam.focus * vh * OFFSET : 0;
    const toScreen = (x: number, y: number) => ({ x: vw / 2 - offX + (x - cam.x) * cam.z, y: vh / 2 - offY + (y - cam.y) * cam.z });

    const g = groupRef.current;
    if (g) {
      const o = toScreen(0, 0);
      g.setAttribute("transform", `translate(${o.x} ${o.y}) scale(${cam.z})`);
      baseRef.current?.setAttribute("stroke-width", String(1.5 / cam.z));
      baseRef.current?.setAttribute("stroke-dasharray", `${2 / cam.z} ${9 / cam.z}`);
      const pr = progressRef.current;
      if (pr) {
        pr.setAttribute("stroke-width", String(2.5 / cam.z));
        pr.style.strokeDashoffset = String(Lc.totalLen - progress);
        // fade the travelled thread out while resting on the overview, so the loop back to the start is seamless
        const last = Lc.placed[Lc.placed.length - 1];
        pr.style.opacity = String(1 - clamp01((s - last.sOut - OUTRO_MOVE) / OUTRO_HOLD));
      }
    }

    // Closed cards are dimmed while travelling, but not in the zoomed-out overview
    const zoomedIn = clamp01(Math.log(cam.z / Lc.overview.z) / Math.log(0.45 / Lc.overview.z));

    let nearest = 0;
    let nearestD = Infinity;
    const cardState: { o: number; sc: number; rot: number }[] = [];
    Lc.placed.forEach((p, i) => {
      const el = stopRefs.current[i];
      const d = distTo(p, s);
      if (d < nearestD) { nearestD = d; nearest = i; }
      cardProgress[i].set(clamp01((s - p.sIn) / (p.sOut - p.sIn)));
      const o = openness(Lc, i, s);
      const sc = p.stop.kind === "card" ? 0.68 + 0.32 * o : 1;
      const rot = p.tilt * (1 - o);
      cardState[i] = { o, sc, rot };
      if (!el) return;
      const sp = toScreen(p.x, p.y);
      el.style.transform = `translate(${sp.x}px, ${sp.y}px) translate(-50%, -50%) scale(${cam.z * sc}) rotate(${rot}deg)`;
      el.style.zIndex = String(p.stop.kind === "card" ? 2 + Math.round(o * 10) : 1);
      const veil = veilRefs.current[i];
      const dim = 0.6 * (1 - o) * zoomedIn;
      if (veil) {
        // framed cards get a dark veil; free-standing paper pieces are dimmed directly
        if (p.stop.kind === "card" && p.stop.item.scrollHint) veil.style.filter = dim > 0.005 ? `brightness(${1 - dim})` : "";
        else veil.style.opacity = String(dim);
      }
      const tag = tagRefs.current[i];
      if (tag) tag.style.opacity = String(1 - o); // the details panel takes over once open
    });

    // The shared logo lifts off one design and lands on the matching spot in the next
    const fl = floaterRef.current;
    if (fl) {
      const a = pair && Lc.placed[pair.k];
      const b = pair && Lc.placed[pair.k + 1];
      const la = a && a.stop.kind === "card" ? a.stop.item.logoAt : undefined;
      const lb = b && b.stop.kind === "card" ? b.stop.item.logoAt : undefined;
      if (pair && a && b && la && lb && pair.f > 0 && pair.f < 1) {
        const rectOf = (p: Placed, r: Rect, st: { sc: number; rot: number }) => {
          const lx = ((r.x + r.w / 2) - 0.5) * p.w * st.sc, ly = ((r.y + r.h / 2) - 0.5) * p.h * st.sc;
          const rad = (st.rot * Math.PI) / 180;
          return {
            x: p.x + lx * Math.cos(rad) - ly * Math.sin(rad),
            y: p.y + lx * Math.sin(rad) + ly * Math.cos(rad),
            w: r.w * p.w * st.sc,
            rot: st.rot,
          };
        };
        const ra = rectOf(a, la, cardState[pair.k]);
        const rb = rectOf(b, lb, cardState[pair.k + 1]);
        const f = pair.f;
        const lift = Math.sin(Math.PI * f);
        const c = toScreen(lerp(ra.x, rb.x, f), lerp(ra.y, rb.y, f));
        const width = lerp(ra.w, rb.w, f) * cam.z * (1 + 0.12 * lift);
        fl.style.width = `${width}px`;
        fl.style.transform = `translate(${c.x}px, ${c.y - lift * 36}px) translate(-50%, -50%) rotate(${lerp(ra.rot, rb.rot, f) + lift * 6}deg)`;
        fl.style.opacity = String(Math.min(1, f / 0.03, (1 - f) / 0.06));
        fl.style.filter = `drop-shadow(0 ${18 * lift}px ${24 * lift}px rgba(0,0,0,${0.55 * lift}))`;
      } else {
        fl.style.opacity = "0";
      }
    }

    const nearStop = Lc.placed[nearest];
    const nearOpen = nearStop.stop.kind === "card" ? cardState[nearest].o : 0;
    const panel = panelRef.current;
    if (panel) {
      panel.style.opacity = String(nearOpen);
      panel.style.transform = Lc.mobile ? `translateY(${(1 - nearOpen) * 24}px)` : `translate(${nearStop.side * (1 - nearOpen) * 32}px, -50%)`;
      panel.style.pointerEvents = nearOpen > 0.5 ? "auto" : "none";
    }
    if (hintBarRef.current) hintBarRef.current.style.transform = `scaleX(${cardProgress[nearest].get()})`;

    // Anything still under the details panel fades back so the panel never sits on top of it
    const pw = Math.min(380, vw * 0.3);
    const panelBox = Lc.mobile
      ? { x0: 0, x1: vw, y0: vh * 0.55, y1: vh }
      : { x0: nearStop.side === 1 ? vw * 0.95 - pw : vw * 0.05, x1: nearStop.side === 1 ? vw * 0.95 : vw * 0.05 + pw, y0: vh / 2 - 270, y1: vh / 2 + 270 };
    Lc.placed.forEach((p, i) => {
      const el = stopRefs.current[i];
      if (!el) return;
      let fade = 0;
      if (i !== nearest && nearOpen > 0) {
        const c = toScreen(p.x, p.y);
        const sc = (p.stop.kind === "card" ? cardState[i].sc : 1) * cam.z;
        const hw = (p.w / 2) * sc, hh = (p.h / 2) * sc;
        if (c.x + hw > panelBox.x0 && c.x - hw < panelBox.x1 && c.y + hh > panelBox.y0 && c.y - hh < panelBox.y1) fade = 0.88 * nearOpen;
      }
      el.style.opacity = String(1 - fade);
    });

    // Same overlay at both ends of the timeline, so jumping from the end back to the start is invisible
    const ov = overlayRef.current;
    if (ov) {
      const last = Lc.placed[Lc.placed.length - 1];
      // shown on the overview and while resting on the first chapter card, gone once you scroll on
      const first = Lc.placed[0];
      const startVis = 1 - clamp01((s - first.sOut) / 0.3);
      const endVis = clamp01((s - last.sOut - OUTRO_MOVE * 0.75) / (OUTRO_MOVE * 0.25));
      const vis = Math.max(startVis, endVis);
      ov.style.opacity = String(vis);
      ov.style.visibility = vis < 0.05 ? "hidden" : "visible";
    }

    const nextActive = nearestD < 0.45 && s > 0.3 && s < Lc.total - OUTRO_HOLD - 0.3 ? nearest : -1;
    if (nextActive !== activeRef.current) {
      activeRef.current = nextActive;
      setActive(nextActive);
    }
  };
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    rendered.current = -1;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (preview) {
        // follow the preview's own animation exactly (no smoothing), so entering ends on the landing frame
        const placed = layoutRef.current.placed;
        const end = placed[Math.min(PREVIEW_DRIFT_STOPS, placed.length - 1)].sOut;
        // starts where the camera leaves the first stop: its resting range looks the same throughout,
        // so the window is moving from the first frame instead of sitting still
        cur.current = lerp(placed[0].sOut, end, previewDrift?.get() ?? 0);
        drawRef.current(cur.current);
      } else {
        const target = window.scrollY / layoutRef.current.unitPx;
        cur.current += (target - cur.current) * (1 - Math.exp(-dt * 7));
        if (Math.abs(target - cur.current) < 0.0004) cur.current = target;
      }
      if (cur.current !== rendered.current) {
        rendered.current = cur.current;
        drawRef.current(cur.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    if (preview) return () => cancelAnimationFrame(raf);

    // Scrolling past the end loops back to the start (both ends show the same overview)
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY >= max - 2) {
        window.scrollTo(0, 0);
        cur.current = 0;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [L]);

  const goToStop = (i: number) => window.scrollTo({ top: L.placed[i].sIn * L.unitPx, behavior: "smooth" });

  const activeStop = active >= 0 ? stops[active] : null;
  const activeCard = activeStop?.kind === "card" ? activeStop : null;
  const sectionNumber = activeStop ? sections.findIndex((x) => x.key === activeStop.section.key) + 1 : 0;

  return (
    <div style={{ height: preview ? viewport.h : L.total * L.unitPx + viewport.h }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          <g ref={groupRef}>
            <path ref={baseRef} d={L.pathD} fill="none" stroke="rgba(255,255,255,0.28)" strokeLinecap="round" />
            <path
              ref={progressRef}
              d={L.pathD}
              fill="none"
              stroke="#ffaa00"
              strokeLinecap="round"
              style={{ strokeDasharray: `${L.totalLen} ${L.totalLen}`, strokeDashoffset: L.totalLen }}
            />
          </g>
        </svg>

        {L.placed.map((p, i) => {
          const stop = p.stop;
          if (stop.kind === "section") {
            return (
              <div
                key={`section-${stop.section.key}`}
                ref={(el) => { stopRefs.current[i] = el; }}
                className="absolute left-0 top-0 pointer-events-none"
                style={{ width: p.w, ...mono }}
              >
                <div className="bg-black border border-[#ffaa00]/40 px-[6%] py-[5%]">
                  <div className="text-[#ffaa00] tracking-[0.25em] uppercase" style={{ fontSize: L.S * 0.04 }}>
                    Chapter {String(stop.number).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                  </div>
                  <div className="text-white font-light italic leading-[1.05] mt-[3%]" style={{ fontSize: L.S * 0.13 }}>
                    {stop.section.label}
                  </div>
                  <p className="text-white/55 leading-relaxed mt-[4%]" style={{ fontSize: L.S * 0.04 }}>{stop.section.intro}</p>
                </div>
              </div>
            );
          }
          const isActive = active === i;
          const media = renderMedia(stop.item as T, { playing: isActive, progress: cardProgress[i], side: p.side });
          return (
            <div
              key={stop.item.id}
              ref={(el) => { stopRefs.current[i] = el; }}
              className="absolute left-0 top-0 cursor-pointer"
              style={{ width: p.w, height: p.h, willChange: "transform" }}
              onClick={() => {
                if (!isActive) goToStop(i);
                else if (!stop.item.scrollHint) onOpen(stop.item.id);
              }}
            >
              {stop.item.scrollHint ? (
                <div ref={(el) => { veilRefs.current[i] = el; }} className="relative w-full h-full">
                  {media}
                </div>
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-sm bg-[#111] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                  {media}
                  <div ref={(el) => { veilRefs.current[i] = el; }} className="absolute inset-0 bg-black pointer-events-none" />
                </div>
              )}
              <div
                ref={(el) => { tagRefs.current[i] = el; }}
                className="absolute left-0 top-full flex items-baseline gap-3 text-white/70 whitespace-nowrap"
                style={{ ...mono, fontSize: L.S * 0.034, marginTop: L.S * 0.03 }}
              >
                <span className="text-[#ffaa00]">{String(stop.number).padStart(2, "0")}</span>
                <span>{stop.item.title}</span>
              </div>
            </div>
          );
        })}

        <div
          ref={floaterRef}
          className="absolute left-0 top-0 pointer-events-none z-30"
          style={{
            aspectRatio: "1.0044",
            opacity: 0,
            backgroundImage: `url(${logo.src})`,
            backgroundSize: `${100 / logo.crop.w}% ${100 / logo.crop.h}%`,
            backgroundPosition: `${(logo.crop.x / (1 - logo.crop.w)) * 100}% ${(logo.crop.y / (1 - logo.crop.h)) * 100}%`,
          }}
        />

        {/* Chapter indicator */}
        <div className="absolute top-[76px] md:top-[100px] left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center" style={mono}>
          <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.25em] whitespace-nowrap">
            {activeStop ? (
              <>
                <span className="text-[#ffaa00]">{String(sectionNumber).padStart(2, "0")}</span> · {activeStop.section.label}
              </>
            ) : (
              "Overview"
            )}
          </p>
        </div>

        {/* Details for the open card */}
        <div
          ref={panelRef}
          className={`absolute z-40 opacity-0 ${
            L.mobile
              ? "left-4 right-4 bottom-4"
              : `${active >= 0 && L.placed[active].side === -1 ? "left-[5vw]" : "right-[5vw]"} top-1/2 w-[min(380px,30vw)]`
          }`}
        >
          {activeCard && (
            <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-7 flex flex-col gap-3 md:gap-4">
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]" style={mono}>
                <span className="text-[#ffaa00]">{String(activeCard.number).padStart(2, "0")}</span> / {String(cardCount).padStart(2, "0")} · {activeCard.section.label}
              </p>
              <h2 className="text-white text-xl md:text-2xl font-medium leading-tight" style={mono}>{activeCard.item.title}</h2>
              <p className="text-white/65 text-sm leading-relaxed">{activeCard.item.blurb}</p>
              <div className="flex flex-wrap gap-1.5" style={mono}>
                {activeCard.item.meta.split("·").map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full border border-white/15 text-white/55 text-[9px] md:text-[10px] uppercase tracking-[0.12em]">
                    {tag.trim()}
                  </span>
                ))}
              </div>
              {activeCard.item.scrollHint ? (
                <div className="mt-1 flex flex-col gap-2" style={mono}>
                  <p className="flex items-center gap-2 text-[#ffaa00] text-[10px] md:text-[11px] uppercase tracking-[0.18em]">
                    <ChevronsDown size={14} className="animate-bounce" /> {activeCard.item.scrollHint}
                  </p>
                  <div className="h-px w-full bg-white/10 overflow-hidden">
                    <div ref={hintBarRef} className="h-full w-full bg-[#ffaa00] origin-left" style={{ transform: "scaleX(0)" }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onOpen(activeCard.item.id)}
                  className="self-start mt-1 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-[11px] uppercase tracking-wider hover:bg-[#ffaa00] transition-colors"
                  style={mono}
                >
                  {activeCard.item.cta} <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Start / end overlay — identical at both ends */}
        <div ref={overlayRef} className="absolute inset-x-0 bottom-8 md:bottom-12 z-40 flex flex-col items-center gap-3 pointer-events-none text-center px-4" style={mono}>
          <p className="text-white text-lg md:text-2xl font-light italic">{cardCount} works, one thread</p>
          <p className="text-white/45 text-[10px] md:text-xs uppercase tracking-[0.25em] flex items-center gap-2">
            Scroll to follow it <ChevronsDown size={14} className="animate-bounce" />
          </p>
          <button onClick={onGrid} className="pointer-events-auto mt-1 text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 transition-colors">
            Or see everything as a grid
          </button>
        </div>
      </div>
    </div>
  );
}
