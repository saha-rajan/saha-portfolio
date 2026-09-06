import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCursor } from "../contexts/CursorContext";
import { Link } from "react-router-dom";
import threeDGif from "figma:asset/f6768dc39512e7f0508e06a264f0361158314f01.png";
import layoutGif from "figma:asset/eb4fcc9f54db44a00e4be7b26ee721d1e3cc5cc2.png";
import typographyImage from "figma:asset/0aa009169e7b91ec3d1c260c0af7f996ec0ec4a2.png";
import trailerVideo from "../../assets/future_fab_heroes_trailer.mp4";

const experiments = [
  {
    type: "Robot",
    label: "Spline 3D\nInteractive 3D Model",
    image: threeDGif,
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    type: "Game",
    label: "Adobe Illustrator\nThumbnail Design",
    image: typographyImage,
    size: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    type: "After Effects",
    label: "After Effects\nLogo Animation",
    image: layoutGif,
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    type: "Trailer",
    label: "HIGGSFIELD · GEMINI · ELEVENLABS · CHATGPT · AFTER EFFECTS\nAI-Crafted Game Trailer",
    video: trailerVideo,
    size: "col-span-1 md:col-span-3 row-span-2",
  },
];

export function Studio() {
  const { setIsTextCursor } = useCursor();
  const [expandedVideo, setExpandedVideo] = useState(false);

  return (
    <section id="studio" className="relative py-24 bg-black overflow-hidden">
      {/* 6-Column Grid Background - Center Aligned - Double Lines */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-full max-w-[1200px] h-full flex justify-between px-8 md:px-16 lg:px-24">
          {/* Desktop: 7 columns - double lines for middle, single for first/last */}
          <div className="hidden lg:flex w-full h-full justify-between">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex gap-[16px]">
                {i === 0 || i === 6 ? (
                  <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                ) : (
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
                  <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                ) : (
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
            className="text-[#A7A7A7] max-w-xl"
            onMouseEnter={() => setIsTextCursor(true)}
            onMouseLeave={() => setIsTextCursor(false)}
          >
            Photographs, experiments, and works in progress. A space for storytelling, exploration, and creative experimentation with new technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {experiments.map((item, index) => {
            const isVideo = !!item.video;
            
            const cardContent = (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative group overflow-hidden bg-[#111] cursor-pointer h-full rounded-xl"
              >
                {isVideo ? (
                  <motion.video
                    layoutId={`studio-video-${index}`}
                    src={item.video}
                    autoPlay
                    loop
                    muted
                    defaultMuted
                    playsInline
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                ) : (
                  <motion.img
                    src={item.image}
                    alt={item.type}
                    className={`w-full h-full transition-transform duration-700 opacity-80 group-hover:opacity-100 object-cover scale-125 ${
                      item.type === "Game" 
                        ? "group-hover:scale-120" 
                        : "group-hover:scale-130"
                    }`}
                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                    animate={
                      item.type === "Game" ? {
                        y: [0, -15, 0],
                        x: [0, 8, 0],
                      } : item.type === "Robot" ? {
                        y: [0, -8, 0],
                        rotate: [0, 2, 0],
                      } : {
                        x: [0, -10, 0],
                        y: [0, 5, 0],
                      }
                    }
                    transition={{
                      duration: item.type === "Game" ? 5 : item.type === "Robot" ? 6 : 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                {/* Title overlay - appears on hover in center */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">{item.label.split('\n')[0]}</span>
                    <span className="text-white text-lg font-bold tracking-wide leading-tight">{item.label.split('\n')[1] || ''}</span>
                  </div>
                </div>
              </motion.div>
            );

            return isVideo ? (
              <div 
                key={index} 
                className={`block ${item.size}`}
                onClick={() => setExpandedVideo(true)}
              >
                {cardContent}
              </div>
            ) : (
              <Link to="/studio" key={index} className={`block ${item.size}`}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Expanded Video Modal */}
      <AnimatePresence>
        {expandedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer"
            onClick={() => setExpandedVideo(false)}
          >
            <motion.div
              layoutId="studio-video-3" // The index of the trailer
              className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()} // Prevent clicks on video from closing modal
            >
              <video
                src={trailerVideo}
                autoPlay
                controls
                className="w-full h-full object-contain"
              />
              <button 
                onClick={() => setExpandedVideo(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors z-10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}