import { useState, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, type MotionValue, type MotionStyle } from "motion/react";
import { ArrowLeft, Play, Maximize2, LayoutGrid, Spline } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { Link, useLocation } from "react-router-dom";
import robotImg from "figma:asset/f6768dc39512e7f0508e06a264f0361158314f01.png";
import sketchImg from "figma:asset/eb4fcc9f54db44a00e4be7b26ee721d1e3cc5cc2.png";
import gameLogoImg from "figma:asset/0aa009169e7b91ec3d1c260c0af7f996ec0ec4a2.png";
import futureFabLogo from "../../assets/future_fab_heroes_logo.png";
import trailerVideo from "../../assets/future_fab_heroes_trailer.mp4";
import video1 from "../../assets/video1.mp4";
import video2 from "../../assets/video2.mp4";
import video3 from "../../assets/video3.mp4";
import video4 from "../../assets/video4.mp4";
import video5 from "../../assets/video5.mp4";
import vrTourVideo from "../../assets/vr_tour_1.mp4";
import { AntigravityExperiment } from "../components/AntigravityExperiment";
import futureFabStickers2 from "../../assets/future_fab_stickers_2.jpg";
import futureFabFlyer1 from "../../assets/future_fab_flyer_1.jpg";
import futureFabFlyer2 from "../../assets/future_fab_flyer_2.jpg";

import drStrangeThumb from "../../assets/dr_strange_thumbnail.png";
import { TrifoldViewer, SheetViewer, StackViewer, ScrollTrifold, ScrollFlip, ScrollStack, type SheetPage } from "../components/TrifoldViewer";
import { ThreadView, type Rect, type MediaState } from "../components/ThreadView";
import trifoldOutsideMid from "../../assets/swap_trifold_outside_mid.jpg";
import trifoldInsideMid from "../../assets/swap_trifold_inside_mid.jpg";
import ffhInfographicFrontMid from "../../assets/ffh_infographic_front_mid.jpg";
import ffhInfographicBackMid from "../../assets/ffh_infographic_back_mid.jpg";
import directionsIstb12Mid from "../../assets/directions_istb12_mid.jpg";
import directionsAcicMid from "../../assets/directions_acic_mid.jpg";
import directionsCooleyMid from "../../assets/directions_cooley_mid.jpg";
import trifoldOutside from "../../assets/swap_trifold_outside.jpg";
import trifoldInside from "../../assets/swap_trifold_inside.jpg";
import trifoldOutsideThumb from "../../assets/swap_trifold_outside_thumb.jpg";
import trifoldInsideThumb from "../../assets/swap_trifold_inside_thumb.jpg";
import ffhInfographicFront from "../../assets/ffh_infographic_front.jpg";
import ffhInfographicBack from "../../assets/ffh_infographic_back.jpg";
import ffhInfographicFrontThumb from "../../assets/ffh_infographic_front_thumb.jpg";
import ffhInfographicBackThumb from "../../assets/ffh_infographic_back_thumb.jpg";
import directionsIstb12 from "../../assets/directions_istb12.jpg";
import directionsAcic from "../../assets/directions_acic.jpg";
import directionsCooley from "../../assets/directions_cooley.jpg";
import directionsIstb12Thumb from "../../assets/directions_istb12_thumb.jpg";
import directionsAcicThumb from "../../assets/directions_acic_thumb.jpg";
import directionsCooleyThumb from "../../assets/directions_cooley_thumb.jpg";

interface StudioItem {
  id: number;
  url: string;
  meta: string;
  title: string;
  backgroundColor?: string;
  isVideo?: boolean;
  isExperiment?: boolean;
  // Brochure spreads: thumbs stack in the tile, full-res pair drives the 3D viewer
  trifold?: { outside: string; inside: string; insideThumb: string };
  // Flip-through sheets (2-sided flyer or a set): thumbs sit side by side in the tile, full-res pages flip in the viewer
  // mode "flip" = one sheet turning over (front/back), "stack" = separate sheets in a pile
  sheets?: { pages: SheetPage[]; thumbs: string[]; aspect: number; mode: "flip" | "stack" };
  category: "graphic" | "3d" | "video";
  blurb: string; // what the piece is, shown beside it in the thread view
  aspect: number; // width / height of the tile media (composite tiles included)
  logoAt?: Rect; // where the Future Fab Heroes logo sits in the tile — the thread view flies the logo between these
}

// The logo file's own content box (it has transparent padding)
const LOGO_CROP: Rect = { x: 0.1525, y: 0.0106, w: 0.695, h: 0.9787 };

const sections: { key: StudioItem["category"]; label: string; intro: string }[] = [
  { key: "graphic", label: "Graphic & Print", intro: "Brand identities, illustrations, print, merchandise, and visual systems built across real projects." },
  { key: "3d", label: "3D & Interactive", intro: "Pieces you can play with: hand tracking in the browser, Spline models and game spaces." },
  { key: "video", label: "Motion & Film", intro: "An AI-assisted game trailer, then short films about ordinary moments." },
];

// Order within each section is the display order. Logo → Thumbnail → Infographic stay together:
// the thread view flies the shared logo from one to the next.
const studioItems: StudioItem[] = [
  // Graphic & Print
  { id: 4, category: "graphic", url: futureFabLogo, meta: "Adobe Illustrator · Brand Identity", title: "Future Fab Heroes Logo", backgroundColor: "#000000", aspect: 1024 / 724, logoAt: LOGO_CROP,
    blurb: "Designed the visual identity for Future Fab Heroes, turning Chip-E and semiconductor circuitry into a recognizable game mark." },
  { id: 3, category: "graphic", url: gameLogoImg, meta: "Adobe Illustrator · Key Art", title: "Future Fab Heroes Key Art", backgroundColor: "#E5E5E5", aspect: 5334 / 3000, logoAt: { x: 0.27, y: 0.0893, w: 0.46, h: 0.8125 },
    blurb: "Extended the game identity into illustrated key art, building a Mars-inspired world around Chip-E for promotional use." },
  { id: 18, category: "graphic", url: ffhInfographicFrontThumb, meta: "Print Design · Information Design", title: "Future Fab Heroes Infographic", backgroundColor: "#272A7A", aspect: (2 * 900) / 1164, logoAt: { x: 0.198, y: 0.143, w: 0.62, h: 0.4767 }, // on the front page
    sheets: { pages: [{ src: ffhInfographicFront, label: "Front" }, { src: ffhInfographicBack, label: "Back" }], thumbs: [ffhInfographicFrontThumb, ffhInfographicBackThumb], aspect: 2200 / 2847, mode: "flip" },
    blurb: "Designed a two-sided infographic that introduces the game, its Learn · Build · Defend framework, target audiences, and Steam access." },
  { id: 13, category: "graphic", url: futureFabFlyer1, meta: "Print Design · Collateral", title: "Future Fab Heroes Print Flyer", backgroundColor: "#FFFFFF", aspect: 752 / 1024,
    blurb: "Took the digital game identity into print, creating a physical flyer for outreach, events, and student engagement." },
  { id: 14, category: "graphic", url: futureFabFlyer2, meta: "Print Design · Mockup", title: "Flyer Layout & Mockup", backgroundColor: "#FFFFFF", aspect: 1024 / 571,
    blurb: "Built the front-and-back flyer as one cohesive print system and visualized how the final piece works as a physical handout." },
  { id: 16, category: "graphic", url: futureFabStickers2, meta: "Merchandise · Brand Application", title: "Sticker in the Wild", backgroundColor: "#FFFFFF", aspect: 768 / 1024,
    blurb: "Tested the identity beyond screens through physical vinyl applications, bringing the Future Fab Heroes brand into everyday objects." },
  { id: 2, category: "graphic", url: sketchImg, meta: "After Effects · Motion Design", title: "TalentVault Logo Animation", aspect: 800 / 450,
    blurb: "Brought the TalentVault mark to life through a short motion study exploring how the identity can form, move, and resolve." },
  { id: 17, category: "graphic", url: trifoldOutsideThumb, meta: "Print Design · Information Design · ASU SWAP Hub", title: "Workforce Development Trifold", backgroundColor: "#FFFFFF", aspect: 1200 / (2 * 927),
    trifold: { outside: trifoldOutside, inside: trifoldInside, insideThumb: trifoldInsideThumb },
    blurb: "Designed a workforce development brochure for ASU SWAP Hub, organizing academic pathways, micro-credentials, digital learning, and industry opportunities into a clear print system." },
  { id: 19, category: "graphic", url: directionsIstb12Thumb, meta: "Wayfinding · Information Design · Event Collateral", title: "Campus Wayfinding Sheets", backgroundColor: "#FFFFFF", aspect: (3 * 700) / 905,
    sheets: { pages: [{ src: directionsIstb12, label: "ISTB 12" }, { src: directionsAcic, label: "ACIC" }, { src: directionsCooley, label: "Cooley Ballroom" }], thumbs: [directionsIstb12Thumb, directionsAcicThumb, directionsCooleyThumb], aspect: 2000 / 2588, mode: "stack" },
    blurb: "Created event wayfinding sheets for multiple ASU venues, combining parking, entrances, landmarks, and 3D location visuals to make arrival easier for attendees." },

  // 3D & Interactive
  { id: 12, category: "3d", url: drStrangeThumb, meta: "MediaPipe · WebGL · Creative Coding", title: "Gesture-Controlled Mandala", backgroundColor: "#111111", isExperiment: true, aspect: 1024 / 576,
    blurb: "Built a webcam-based interaction where hand movement controls a Doctor Strange-inspired generative mandala in real time." },
  { id: 1, category: "3d", url: robotImg, meta: "Spline · 3D · Interactive", title: "Interactive 3D Character", aspect: 800 / 502,
    blurb: "Modeled a playful robot in Spline and turned it into an interactive web-based 3D experiment exploring character, lighting, and spatial interaction." },
  { id: 11, category: "3d", url: vrTourVideo, meta: "3D Design · VR Environment", title: "VR Lobby Environment", backgroundColor: "#000000", isVideo: true, aspect: 1920 / 1080,
    blurb: "Designed a lobby environment as an entry space for an experimental VR experience, exploring spatial storytelling and navigation in an immersive setting." },
  { id: 10, category: "3d", url: video5, meta: "Blender · Python · Gemini · Antigravity", title: "Vibe-Coded 3D Environment", backgroundColor: "#000000", isVideo: true, aspect: 1920 / 1080,
    blurb: "Built a 3D semiconductor-inspired environment in Blender through a code-driven workflow using Gemini Antigravity and Python, with the model generated without manual modeling." },

  // Motion & Film
  { id: 5, category: "video", url: trailerVideo, meta: "Higgsfield · Gemini · ElevenLabs · After Effects", title: "Future Fab Heroes Game Trailer", backgroundColor: "#000000", isVideo: true, aspect: 1920 / 1080,
    blurb: "Produced the Future Fab Heroes cinematic trailer using AI-assisted visual workflows, voice, sound, and motion design to turn the game world into a launch-ready story." },
  { id: 6, category: "video", url: video1, meta: "Video · Visual Diary", title: "Boston, in Passing", backgroundColor: "#000000", isVideo: true, aspect: 1920 / 1080,
    blurb: "A visual diary of Boston, cut together from everyday moments." },
  { id: 7, category: "video", url: video2, meta: "Video · Cinematic Study", title: "Somewhere Above Earth", backgroundColor: "#000000", isVideo: true, aspect: 1920 / 1080,
    blurb: "A cinematic study filmed from a plane window, above the clouds." },
  { id: 8, category: "video", url: video3, meta: "Video · Sound + Color Study", title: "Dinner Rush", backgroundColor: "#000000", isVideo: true, aspect: 1080 / 1920,
    blurb: "A short study in sound and colour." },
  { id: 9, category: "video", url: video4, meta: "Video · Observational Short", title: "The Seat Ahead", backgroundColor: "#000000", isVideo: true, aspect: 1912 / 1076,
    blurb: "An observational short about the stranger in the seat ahead." },
];

// Button label for opening each piece full screen
function ctaFor(item: StudioItem) {
  if (item.isExperiment) return "Launch experiment";
  if (item.trifold) return "Fold it open";
  if (item.sheets?.mode === "stack") return "Shuffle the sheets";
  if (item.sheets) return "Flip it over";
  if (item.isVideo) return "Play with sound";
  return "View full size";
}
// In the thread view these print pieces animate in place as you scroll, sized to the real object
const scrollPieces: Record<number, { aspect: number; scrollHint: string; render: (state: { progress: MotionValue<number>; side: 1 | -1 }) => ReactNode }> = {
  17: {
    aspect: 1800 / 1391, // the open spread
    scrollHint: "Keep scrolling to unfold it",
    render: ({ progress }) => <ScrollTrifold outside={trifoldOutsideMid} inside={trifoldInsideMid} progress={progress} />,
  },
  18: {
    aspect: 2200 / 2847,
    scrollHint: "Keep scrolling to flip it over",
    render: ({ progress }) => <ScrollFlip front={ffhInfographicFrontMid} back={ffhInfographicBackMid} progress={progress} />,
  },
  19: {
    aspect: 2000 / 2588,
    scrollHint: "Keep scrolling to go through the sheets",
    render: ({ progress, side }) => <ScrollStack pages={[directionsIstb12Mid, directionsAcicMid, directionsCooleyMid]} progress={progress} side={side} />,
  },
};

const threadItems = studioItems.map((item) => ({
  ...item,
  cta: ctaFor(item),
  aspect: scrollPieces[item.id]?.aspect ?? item.aspect,
  scrollHint: scrollPieces[item.id]?.scrollHint,
}));

const mono = { fontFamily: "'IBM Plex Mono', monospace" };

// Only plays while on screen so a page full of videos doesn't decode all at once
// `playing` overrides the on-screen check (the thread view plays only the open card)
function GalleryVideo({ src, playing }: { src: string; playing?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || playing === undefined) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing]);

  useEffect(() => {
    const video = ref.current;
    if (!video || playing !== undefined) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [playing]);

  return (
    <video
      ref={ref}
      src={`${src}#t=0.1`} // shows a first frame instead of black before it plays
      loop
      muted
      playsInline
      preload="metadata"
      className="block w-full h-auto pointer-events-none select-none"
    />
  );
}

function TileMedia({ item, playing }: { item: StudioItem; playing?: boolean }) {
  if (item.isVideo) return <GalleryVideo src={item.url} playing={playing} />;
  if (item.trifold) {
    return (
      <div className="flex flex-col gap-px bg-black/10">
        <ImageWithFallback src={item.url} alt={`${item.title} — outside`} loading="lazy" draggable={false} className="block w-full h-auto select-none" />
        <ImageWithFallback src={item.trifold.insideThumb} alt={`${item.title} — inside`} loading="lazy" draggable={false} className="block w-full h-auto select-none" />
      </div>
    );
  }
  if (item.sheets) {
    return (
      <div className="grid gap-px bg-black/10" style={{ gridTemplateColumns: `repeat(${item.sheets.thumbs.length}, minmax(0, 1fr))` }}>
        {item.sheets.thumbs.map((thumb, i) => (
          <ImageWithFallback key={thumb} src={thumb} alt={`${item.title} — ${item.sheets!.pages[i].label}`} loading="lazy" draggable={false} className="block w-full h-auto select-none" />
        ))}
      </div>
    );
  }
  return (
    <ImageWithFallback
      src={item.url}
      alt={item.title}
      loading="lazy"
      draggable={false}
      className={`block w-full h-auto select-none transition-opacity duration-300 ${item.isExperiment ? "opacity-60 group-hover:opacity-90" : ""}`}
    />
  );
}

function GalleryTile({ item, index, onExpand, animateIn = true }: { item: StudioItem; index: number; onExpand: () => void; animateIn?: boolean }) {
  return (
    <motion.figure
      initial={animateIn ? { opacity: 0, y: 24 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.05 }}
      className="group mb-3 md:mb-4 break-inside-avoid"
    >
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Open ${item.title}`}
        className="relative block w-full overflow-hidden rounded-sm text-left"
        style={item.backgroundColor ? { backgroundColor: item.backgroundColor } : {}}
      >
        <TileMedia item={item} />

        {/* Hover vignette with caption — always visible on touch devices that can't hover */}
        <figcaption
          className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%),linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.35)_35%,transparent_65%)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={mono}
        >
          <div className="flex flex-col gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-white text-xs md:text-sm font-medium tracking-wide">{item.title}</span>
            <span className="text-white/60 text-[10px] uppercase tracking-[0.18em] leading-relaxed">{item.meta}</span>
          </div>
        </figcaption>

        {item.isExperiment ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-[#ffaa00] text-black font-bold font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg transition-transform group-hover:scale-105">
              Launch
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {item.isVideo ? <Play fill="white" size={14} /> : <Maximize2 size={14} />}
          </div>
        )}
      </button>
    </motion.figure>
  );
}

type StudioView = "thread" | "grid";

// Thread by default; /studio?view=grid links straight to the grid
function initialView(): StudioView {
  return new URLSearchParams(window.location.search).get("view") === "grid" ? "grid" : "thread";
}

function ViewSwitch({ view, onChange }: { view: StudioView; onChange: (v: StudioView) => void }) {
  const options: { key: StudioView; label: string; icon: typeof Spline }[] = [
    { key: "thread", label: "Thread", icon: Spline },
    { key: "grid", label: "Grid", icon: LayoutGrid },
  ];
  // The white pill slides between the buttons using their offsets inside the switch, which don't change
  // with page scroll (a shared-layout animation misreads the scroll jump when switching views)
  const buttonRefs = useRef<Partial<Record<StudioView, HTMLButtonElement | null>>>({});
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = buttonRefs.current[view];
      if (el) setPill({ x: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [view]);

  return (
    <div role="radiogroup" aria-label="Studio layout" className="relative flex items-center p-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20" style={mono}>
      {pill && (
        <motion.span
          aria-hidden
          className="absolute left-0 top-1 bottom-1 rounded-full bg-white"
          initial={false}
          animate={{ x: pill.x, width: pill.width }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      {options.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          ref={(el) => { buttonRefs.current[key] = el; }}
          role="radio"
          aria-checked={view === key}
          onClick={() => onChange(key)}
          className={`relative flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs uppercase tracking-[0.15em] transition-colors ${
            view === key ? "text-black" : "text-white/60 hover:text-white"
          }`}
        >
          <Icon size={14} className="relative" />
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}

// Back button + layout switch, pinned to the top of the page (or of the homepage preview window)
function StudioChrome({ view, onChange, showBack = true, fadeInBack = false }: {
  view: StudioView; onChange: (v: StudioView) => void; showBack?: boolean;
  fadeInBack?: boolean; // the homepage window has no Back button, so ease it in after entering through it
}) {
  return (
    <>
      {showBack && <motion.div
        initial={fadeInBack ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="fixed top-0 left-0 z-[1001] p-4 md:p-8 pointer-events-none"
      >
        <Link to="/" className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 text-sm md:text-base"
            style={mono}
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>}

      {/* Layout switch — level with the Back button */}
      <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[1001]">
        <ViewSwitch view={view} onChange={onChange} />
      </div>
    </>
  );
}

// One masonry block per discipline — each piece keeps its native aspect ratio
function StudioGrid({ onExpand, animateIn, limitSections, style }: {
  onExpand: (id: number) => void;
  animateIn: boolean;
  limitSections?: number;
  style?: MotionStyle;
}) {
  return (
    <motion.main className="mx-auto max-w-[1800px] px-4 md:px-8 pt-20 md:pt-28 pb-24" style={style}>
      <div className="flex flex-col gap-16 md:gap-24">
        {sections.slice(0, limitSections).map((section, sectionIndex) => {
          const items = studioItems.filter((item) => item.category === section.key);
          return (
            <section key={section.key}>
              <div className="flex items-baseline gap-4 mb-4 md:mb-6 border-b border-white/10 pb-3" style={mono}>
                <span className="text-white/30 text-[10px] md:text-xs tracking-[0.2em]">{String(sectionIndex + 1).padStart(2, "0")}</span>
                <h2 className="text-white text-xs md:text-sm uppercase tracking-[0.2em]">{section.label}</h2>
                <span className="ml-auto text-white/30 text-[10px] md:text-xs tracking-[0.2em]">{String(items.length).padStart(2, "0")}</span>
              </div>
              <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-3 md:gap-4">
                {items.map((item, index) => (
                  <GalleryTile key={item.id} item={item} index={index} animateIn={animateIn} onExpand={() => onExpand(item.id)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </motion.main>
  );
}

// Thread-view media for one work. In the homepage preview, videos are dark placeholders (they're
// far off-screen there) so the homepage doesn't download them.
function threadMedia(item: (typeof threadItems)[number], { playing, progress, side }: MediaState, preview = false) {
  if (scrollPieces[item.id]) return scrollPieces[item.id].render({ progress, side });
  return (
    <div className="w-full h-full" style={item.backgroundColor ? { backgroundColor: item.backgroundColor } : {}}>
      {preview && item.isVideo ? null : <TileMedia item={item} playing={playing} />}
      {item.isExperiment && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-[#ffaa00] text-black font-bold font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg">Launch</span>
        </div>
      )}
    </div>
  );
}

// The Studio's thread view, frozen between the whole canvas (0) and the page's landing frame (1).
// The homepage shows this scaled down as a window into the Studio, and runs it to 1 while growing
// the window to full screen, so the hand-off to the real page is seamless.
export function StudioThreadPreview({ introProgress, drift }: { introProgress: MotionValue<number>; drift: MotionValue<number> }) {
  return (
    <div className="w-full h-full bg-black text-white">
      <StudioChrome view="thread" onChange={() => {}} showBack={false} />
      <ThreadView
        items={threadItems}
        sections={sections}
        onOpen={() => {}}
        onGrid={() => {}}
        logo={{ src: futureFabLogo, crop: LOGO_CROP }}
        renderMedia={(item, state) => threadMedia(item, state, true)}
        introProgress={introProgress}
        previewDrift={drift}
      />
    </div>
  );
}

export function StudioDetail() {
  // Arriving through the homepage window: the grid is already on screen, so skip the tile fade-in
  const location = useLocation();
  const arrivedFromPreview = Boolean((location.state as { fromPreview?: boolean } | null)?.fromPreview);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const expandedItem = studioItems.find((item) => item.id === expandedId);
  const [view, setView] = useState<StudioView>(initialView);

  // Always land at the start of the page: the browser shouldn't restore an old scroll position
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (view === "grid") window.scrollTo(0, 0); // the thread view sets its own starting point
    return () => { window.history.scrollRestoration = previous; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow ?view= when it changes without remounting (e.g. Chakku opening the thread from /studio)
  useEffect(() => {
    const fromUrl = new URLSearchParams(location.search).get("view");
    if (fromUrl === "thread" || fromUrl === "grid") setView(fromUrl);
  }, [location.search]);

  const changeView = (next: StudioView) => {
    if (next === view) return;
    setView(next);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (expandedId === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedId(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [expandedId]);

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white">
      <StudioChrome view={view} onChange={changeView} fadeInBack={arrivedFromPreview} />

      {view === "thread" ? (
        <ThreadView
          items={threadItems}
          sections={sections}
          onOpen={setExpandedId}
          onGrid={() => changeView("grid")}
          logo={{ src: futureFabLogo, crop: LOGO_CROP }}
          renderMedia={(item, state) => threadMedia(item, state)}
        />
      ) : (
        <StudioGrid onExpand={setExpandedId} animateIn={!arrivedFromPreview} />
      )}

      {/* Expanded Modal */}
      <AnimatePresence>
        {expandedId !== null && expandedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer"
            onClick={() => setExpandedId(null)}
          >
            {expandedItem.isExperiment ? (
              <AntigravityExperiment onClose={() => setExpandedId(null)} />
            ) : expandedItem.sheets?.mode === "stack" ? (
              <StackViewer
                pages={expandedItem.sheets.pages}
                aspect={expandedItem.sheets.aspect}
                onClose={() => setExpandedId(null)}
              />
            ) : expandedItem.sheets ? (
              <SheetViewer
                pages={expandedItem.sheets.pages}
                aspect={expandedItem.sheets.aspect}
                onClose={() => setExpandedId(null)}
              />
            ) : expandedItem.trifold ? (
              <TrifoldViewer
                outside={expandedItem.trifold.outside}
                inside={expandedItem.trifold.inside}
                onClose={() => setExpandedId(null)}
              />
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-[85vh] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {expandedItem.isVideo ? (
                  <video
                    src={expandedItem.url}
                    autoPlay
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <img
                    src={expandedItem.url}
                    alt={expandedItem.title}
                    className="w-full h-full object-contain"
                  />
                )}
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors z-10"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
