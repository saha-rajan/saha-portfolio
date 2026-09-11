import { motion } from "motion/react";
import { useCursor } from "../contexts/CursorContext";
import { Link } from "react-router-dom";
import video1 from "../../assets/video1.mp4";
import video2 from "../../assets/video2.mp4";
import video3 from "../../assets/video3.mp4";
import video4 from "../../assets/video4.mp4";
import video5 from "../../assets/video5.mp4";

const experiments = [
  {
    type: "video1",
    label: "🎬 VIDEO · VISUAL DIARY\nBoston, in Passing",
    video: video1,
    size: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    type: "video2",
    label: "🎬 VIDEO · CINEMATIC STUDY\nSomewhere Above Earth",
    video: video2,
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    type: "video3",
    label: "🎬 VIDEO · SOUND + COLOR STUDY\nDinner Rush",
    video: video3,
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    type: "video4",
    label: "🎬 VIDEO · OBSERVATIONAL SHORT\nThe Seat Ahead",
    video: video4,
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    type: "video5",
    label: "Google Antigravity + BLENDER EXPERIMENT\nGame Design · 3D Environment",
    video: video5,
    size: "col-span-1 md:col-span-2 row-span-1",
  },
];

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
            A space for storytelling, exploration and creative experimentation with new technologies.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 auto-rows-[160px] sm:auto-rows-[300px]">
          {experiments.map((item, index) => (
            <Link to="/studio" key={index} className={`block ${item.size}`}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative group overflow-hidden bg-[#111] cursor-pointer h-full rounded-xl"
              >
                <video
                  src={item.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full transition-transform duration-700 opacity-80 group-hover:opacity-100 object-cover group-hover:scale-105"
                  style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                />
                
                {/* Title overlay - appears on hover in center */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium">{item.label.split('\n')[0]}</span>
                    <span className="text-white text-sm sm:text-lg font-bold tracking-wide leading-tight">{item.label.split('\n')[1] || ''}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}