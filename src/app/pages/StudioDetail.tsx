import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, Maximize2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { Link } from "react-router-dom";
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
import futureFabStickers1 from "../../assets/future_fab_stickers_1.jpg";
import futureFabStickers2 from "../../assets/future_fab_stickers_2.jpg";
import futureFabFlyer1 from "../../assets/future_fab_flyer_1.jpg";
import futureFabFlyer2 from "../../assets/future_fab_flyer_2.jpg";

import drStrangeThumb from "../../assets/dr_strange_thumbnail.png";
import { TrifoldViewer, SheetViewer, StackViewer, type SheetPage } from "../components/TrifoldViewer";
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
}

const sections: { key: StudioItem["category"]; label: string }[] = [
  { key: "graphic", label: "Graphic & Print" },
  { key: "3d", label: "3D & Interactive" },
  { key: "video", label: "Motion & Film" },
];

// Order within each section is the display order
const studioItems: StudioItem[] = [
  // Graphic & Print
  { id: 17, category: "graphic", url: trifoldOutsideThumb, meta: "Print · Trifold Brochure · ASU SWAP Hub", title: "Workforce Development Trifold", backgroundColor: "#FFFFFF", trifold: { outside: trifoldOutside, inside: trifoldInside, insideThumb: trifoldInsideThumb } },
  { id: 18, category: "graphic", url: ffhInfographicFrontThumb, meta: "Print · Double-Sided Infographic", title: "Future Fab Heroes Infographic", backgroundColor: "#272A7A", sheets: { pages: [{ src: ffhInfographicFront, label: "Front" }, { src: ffhInfographicBack, label: "Back" }], thumbs: [ffhInfographicFrontThumb, ffhInfographicBackThumb], aspect: 2200 / 2847, mode: "flip" } },
  { id: 19, category: "graphic", url: directionsIstb12Thumb, meta: "Wayfinding · Event Signage · ASU SWAP Hub", title: "Campus Direction Sheets", backgroundColor: "#FFFFFF", sheets: { pages: [{ src: directionsIstb12, label: "ISTB 12" }, { src: directionsAcic, label: "ACIC" }, { src: directionsCooley, label: "Cooley Ballroom" }], thumbs: [directionsIstb12Thumb, directionsAcicThumb, directionsCooleyThumb], aspect: 2000 / 2588, mode: "stack" } },
  { id: 13, category: "graphic", url: futureFabFlyer1, meta: "Print · Merch", title: "Game Flyer Design", backgroundColor: "#FFFFFF" },
  { id: 4, category: "graphic", url: futureFabLogo, meta: "Adobe Illustrator", title: "Logo Design", backgroundColor: "#000000" },
  { id: 15, category: "graphic", url: futureFabStickers1, meta: "Merchandise", title: "Chip-E Character Stickers", backgroundColor: "#FFFFFF" },
  { id: 14, category: "graphic", url: futureFabFlyer2, meta: "Promo Material", title: "Game Flyer Layouts", backgroundColor: "#FFFFFF" },
  { id: 3, category: "graphic", url: gameLogoImg, meta: "Adobe Illustrator", title: "Thumbnail Design", backgroundColor: "#E5E5E5" },
  { id: 16, category: "graphic", url: futureFabStickers2, meta: "Merchandise", title: "Die-Cut Vinyl Stickers", backgroundColor: "#FFFFFF" },
  { id: 2, category: "graphic", url: sketchImg, meta: "After Effects", title: "Logo Animation" },

  // 3D & Interactive
  { id: 12, category: "3d", url: drStrangeThumb, meta: "MediaPipe · WebGL", title: "Tao Mandala - Doctor Strange", backgroundColor: "#111111", isExperiment: true },
  { id: 1, category: "3d", url: robotImg, meta: "Spline 3D", title: "Interactive 3D Model" },
  { id: 11, category: "3d", url: vrTourVideo, meta: "3D Model · VR Game Environment", title: "Lobby Space Design", backgroundColor: "#000000", isVideo: true },
  { id: 10, category: "3d", url: video5, meta: "Google Antigravity + Blender Experiment", title: "Game Design · 3D Environment", backgroundColor: "#000000", isVideo: true },

  // Motion & Film
  { id: 5, category: "video", url: trailerVideo, meta: "Higgsfield · Gemini · ElevenLabs · ChatGPT · After Effects", title: "AI-Crafted Game Trailer", backgroundColor: "#000000", isVideo: true },
  { id: 6, category: "video", url: video1, meta: "Video · Visual Diary", title: "Boston, in Passing", backgroundColor: "#000000", isVideo: true },
  { id: 7, category: "video", url: video2, meta: "Video · Cinematic Study", title: "Somewhere Above Earth", backgroundColor: "#000000", isVideo: true },
  { id: 8, category: "video", url: video3, meta: "Video · Sound + Color Study", title: "Dinner Rush", backgroundColor: "#000000", isVideo: true },
  { id: 9, category: "video", url: video4, meta: "Video · Observational Short", title: "The Seat Ahead", backgroundColor: "#000000", isVideo: true },
];

const mono = { fontFamily: "'IBM Plex Mono', monospace" };

// Only plays while on screen so a page full of videos doesn't decode all at once
function GalleryVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      className="block w-full h-auto pointer-events-none select-none"
    />
  );
}

function GalleryTile({ item, index, onExpand }: { item: StudioItem; index: number; onExpand: () => void }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
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
        {item.isVideo ? (
          <GalleryVideo src={item.url} />
        ) : item.trifold ? (
          <div className="flex flex-col gap-px bg-black/10">
            <ImageWithFallback src={item.url} alt={`${item.title} — outside`} loading="lazy" draggable={false} className="block w-full h-auto select-none" />
            <ImageWithFallback src={item.trifold.insideThumb} alt={`${item.title} — inside`} loading="lazy" draggable={false} className="block w-full h-auto select-none" />
          </div>
        ) : item.sheets ? (
          <div className="grid gap-px bg-black/10" style={{ gridTemplateColumns: `repeat(${item.sheets.thumbs.length}, minmax(0, 1fr))` }}>
            {item.sheets.thumbs.map((thumb, i) => (
              <ImageWithFallback key={thumb} src={thumb} alt={`${item.title} — ${item.sheets!.pages[i].label}`} loading="lazy" draggable={false} className="block w-full h-auto select-none" />
            ))}
          </div>
        ) : (
          <ImageWithFallback
            src={item.url}
            alt={item.title}
            loading="lazy"
            draggable={false}
            className={`block w-full h-auto select-none transition-opacity duration-300 ${item.isExperiment ? "opacity-60 group-hover:opacity-90" : ""}`}
          />
        )}

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

export function StudioDetail() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const expandedItem = studioItems.find((item) => item.id === expandedId);

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
      {/* Header with Back Button */}
      <div className="fixed top-0 left-0 z-[1001] p-4 md:p-8 pointer-events-none">
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
      </div>

      <main className="mx-auto max-w-[1800px] px-4 md:px-8 pt-4 md:pt-8 pb-24">
        {/* Top bar — sits level with the fixed Back button */}
        <header className="flex items-center justify-end h-10 md:h-[50px] mb-6 md:mb-8">
          <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.2em] text-right" style={mono}>
            Studio · {String(studioItems.length).padStart(2, "0")} works
            <br />
            Print · 3D · Motion
          </p>
        </header>

        {/* One masonry block per discipline — each piece keeps its native aspect ratio */}
        <div className="flex flex-col gap-16 md:gap-24">
          {sections.map((section, sectionIndex) => {
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
                    <GalleryTile key={item.id} item={item} index={index} onExpand={() => setExpandedId(item.id)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

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
