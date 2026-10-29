import { useEffect, useRef, useState } from "react";
import { motion, animate, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { ViewerControls, CloseButton } from "./TrifoldViewer";

// The Halloween Duo piece, told in one continuous camera move as you scroll:
// Duo on his hand truck → the mask drops on and snaps into place → the app icon grows
// around him → the icon tilts back onto a phone's home screen as the camera pulls out.
//
// Everything lives in one "world": the phone mockup's own pixels (3240 square). The icon and
// the owl are placed in it with transforms measured from the artwork, so each hand-off lands
// where the next image already is.

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const phase = (p: number, start: number, length: number) => smoothstep(clamp01((p - start) / length));
const raw = (p: number, start: number, length: number) => clamp01((p - start) / length);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// overshoots a little past 1 and settles back: the mask "snaps" on
const backOut = (t: number) => { const c = 1.9; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; };

type M3 = number[]; // row-major 3×3 projective matrix
const apply = (m: M3, x: number, y: number) => {
  const w = m[6] * x + m[7] * y + m[8];
  return [(m[0] * x + m[1] * y + m[2]) / w, (m[3] * x + m[4] * y + m[5]) / w];
};
const matrix3d = (m: M3) => `matrix3d(${m[0]},${m[3]},0,${m[6]},${m[1]},${m[4]},0,${m[7]},0,0,1,0,${m[2]},${m[5]},0,${m[8]})`;

const PHONE = 3240;
const ICON = 2793;
// Owl + mask crops (1000 × 1120) → icon: measured from the pupils in both images
const ART_W = 1000, ART_H = 1120;
const S = 3.23, TX = -317.2, TY = 28.7;
// Icon → phone: the perspective of the icon on the photographed home screen (fitted to its outline)
const ON_PHONE: M3 = [0.58327, -0.09016, 1763.82, 0.19694, 0.31455, 1219.94, 0.0000810548, 0.0000119943, 1];
// The same icon flat and upright-ish: centre, size and turn of the outline above, without the perspective
const FLAT: M3 = (() => {
  const h = ICON / 2;
  const [cx, cy] = apply(ON_PHONE, h, h);
  const [lx, ly] = apply(ON_PHONE, 0, h), [rx, ry] = apply(ON_PHONE, ICON, h);
  const [tx, ty] = apply(ON_PHONE, h, 0), [bx, by] = apply(ON_PHONE, h, ICON);
  const k = Math.sqrt(Math.hypot(rx - lx, ry - ly) * Math.hypot(bx - tx, by - ty)) / ICON;
  const a = Math.atan2(ry - ly, rx - lx);
  const c = k * Math.cos(a), s = k * Math.sin(a);
  return [c, -s, cx - (c * h - s * h), s, c, cy - (s * h + c * h), 0, 0, 1];
})();
const FLAT_TURN = (Math.atan2(FLAT[3], FLAT[0]) * 180) / Math.PI;
const FLAT_SIZE = Math.hypot(FLAT[0], FLAT[3]) * ICON;
const ICON_CENTER = apply(FLAT, ICON / 2, ICON / 2);

type Cam = { x: number; y: number; w: number; rot: number };
const OWL_VIEW: Cam = (() => { const [x, y] = apply(FLAT, 497 * S + TX, 560 * S + TY); return { x, y, w: (1200 * S * FLAT_SIZE) / ICON, rot: FLAT_TURN }; })();
const ICON_VIEW: Cam = { x: ICON_CENTER[0], y: ICON_CENTER[1], w: FLAT_SIZE * 1.2, rot: FLAT_TURN };
const PHONE_VIEW: Cam = { x: PHONE / 2, y: PHONE / 2, w: PHONE, rot: 0 };
// zoom in log space so the move feels like a steady dolly, not a lurch at one end
const mix = (a: Cam, b: Cam, t: number): Cam => ({
  x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: Math.exp(lerp(Math.log(a.w), Math.log(b.w), t)), rot: lerp(a.rot, b.rot, t),
});

export type DuoArt = { owl: string; mask: string; icon: string; phone: string };

// Resting points of the animation, for stepping through it with buttons instead of scrolling
export const DUO_STAGES = [
  { label: "Duo", at: 0, hint: "Duo, before the mask" },
  { label: "Mask on", at: 0.4, hint: "The mask snaps on" },
  { label: "App icon", at: 0.63, hint: "Built into the app icon" },
  { label: "Mockup", at: 1, hint: "On the home screen" },
];

// Plays the animation to a stage: forwards or backwards through every step in between
export function useDuoStage(initial: number) {
  const progress = useMotionValue(DUO_STAGES[initial].at);
  const [stage, setStage] = useState(initial);
  const go = (i: number) => {
    const next = ((i % DUO_STAGES.length) + DUO_STAGES.length) % DUO_STAGES.length;
    setStage(next);
    const to = DUO_STAGES[next].at;
    animate(progress, to, { duration: 0.5 + 1.8 * Math.abs(to - progress.get()), ease: [0.45, 0, 0.25, 1] });
  };
  return { progress, stage, go };
}

// Full-screen version: a larger stage with the same buttons, plus arrow keys
export function DuoViewer({ art, onClose }: { art: DuoArt; onClose: () => void }) {
  const { progress, stage, go } = useDuoStage(1);
  const stageRef = useRef(stage);
  stageRef.current = stage;
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(stageRef.current + 1);
      if (e.key === "ArrowLeft") go(stageRef.current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 cursor-default" onClick={(e) => e.stopPropagation()}>
      <CloseButton onClose={onClose} />
      <div className="relative cursor-pointer" style={{ width: "min(66vh, 86vw)", aspectRatio: "1" }} onClick={() => go(stage + 1)}>
        <ScrollDuo {...art} progress={progress} />
      </div>
      <ViewerControls steps={DUO_STAGES} step={stage} go={go} />
    </div>
  );
}

export function ScrollDuo({ owl, mask, icon, phone, progress }: DuoArt & { progress: MotionValue<number> }) {
  // the world is laid out in phone pixels; the camera scales it to whatever size the card is
  const boxRef = useRef<HTMLDivElement>(null);
  const boxW = useMotionValue(0);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => boxW.set(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [boxW]);

  // 1. the mask flies in from above, spinning, and snaps onto his face
  const maskT = useTransform(progress, (p) => raw(p, 0.08, 0.22));
  const maskTransform = useTransform(maskT, (t) => {
    const e = backOut(t);
    return `translate(${lerp(14, 0, e)}%, ${lerp(-75, 0, e)}%) rotate(${lerp(-40, 0, e)}deg) scale(${lerp(1.35, 1, e)})`;
  });
  const maskOpacity = useTransform(maskT, (t) => clamp01(t * 4));
  // ...and Duo flinches from the impact: a quick squash, then a wobble that settles
  const artTransform = useTransform(progress, (p) => {
    const u = raw(p, 0.27, 0.12);
    if (u <= 0 || u >= 1) return "none";
    const squash = u < 0.5 ? Math.sin(Math.PI * u * 2) : 0;
    const wobble = Math.sin(u * Math.PI * 3) * (1 - u) * 3;
    return `rotate(${wobble}deg) scale(${1 + 0.04 * squash}, ${1 - 0.06 * squash})`;
  });

  // 2. the app icon grows out from behind him, then everything outside it falls away
  const iconClip = useTransform(progress, (p) => `inset(${lerp(50, 0, phase(p, 0.42, 0.14))}% round 25%)`);
  const artOpacity = useTransform(progress, (p) => 1 - phase(p, 0.54, 0.08));

  // 3. pull back to the phone: the icon tilts back onto the screen and hands over to the photo
  const iconPlacement = useTransform(progress, (p) => {
    const t = phase(p, 0.64, 0.18);
    return matrix3d(FLAT.map((v, i) => lerp(v, ON_PHONE[i], t)));
  });
  const iconOpacity = useTransform(progress, (p) => 1 - phase(p, 0.74, 0.1));
  const phoneOpacity = useTransform(progress, (p) => phase(p, 0.62, 0.08));

  const camera = useTransform([progress, boxW], ([p, B]: number[]) => {
    const toIcon = phase(p, 0.42, 0.2);
    const toPhone = phase(p, 0.64, 0.28);
    const c = toPhone > 0 ? mix(ICON_VIEW, PHONE_VIEW, toPhone) : mix(OWL_VIEW, ICON_VIEW, toIcon);
    return `translate(${B / 2}px, ${B / 2}px) rotate(${-c.rot}deg) scale(${B / c.w}) translate(${-c.x}px, ${-c.y}px)`;
  });

  const fill = "absolute inset-0 w-full h-full max-w-none select-none pointer-events-none";
  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden bg-white rounded-[7%]">
      <motion.div className="absolute left-0 top-0" style={{ width: PHONE, height: PHONE, transformOrigin: "0 0", transform: camera }}>
        <motion.img src={phone} alt="" loading="lazy" draggable={false} className={fill} style={{ opacity: phoneOpacity }} />

        <motion.div className="absolute left-0 top-0" style={{ width: ICON, height: ICON, transformOrigin: "0 0", transform: iconPlacement, opacity: iconOpacity }}>
          <motion.img src={icon} alt="" loading="lazy" draggable={false} className={fill} style={{ clipPath: iconClip }} />

          <motion.div className="absolute" style={{ left: TX, top: TY, width: ART_W * S, height: ART_H * S, opacity: artOpacity }}>
            <motion.div className="absolute inset-0" style={{ transform: artTransform, transformOrigin: "50% 96%" }}>
              <img src={owl} alt="" loading="lazy" draggable={false} className={fill} />
              <motion.img src={mask} alt="" loading="lazy" draggable={false} className={fill} style={{ transform: maskTransform, transformOrigin: "43% 30%", opacity: maskOpacity }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
