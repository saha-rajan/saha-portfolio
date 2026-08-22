import { motion } from "motion/react";
import { useCursor } from "../contexts/CursorContext";
import { Link } from "react-router-dom";
import threeDGif from "figma:asset/f6768dc39512e7f0508e06a264f0361158314f01.png";
import layoutGif from "figma:asset/eb4fcc9f54db44a00e4be7b26ee721d1e3cc5cc2.png";
import typographyImage from "figma:asset/0aa009169e7b91ec3d1c260c0af7f996ec0ec4a2.png";

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
];

export function Studio() {
  const { setIsTextCursor } = useCursor();

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
            className="text-[#A7A7A7] max-w-xl"
            onMouseEnter={() => setIsTextCursor(true)}
            onMouseLeave={() => setIsTextCursor(false)}
          >
            Photographs, experiments, and works in progress. A space for storytelling, exploration, and creative experimentation with new technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
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
                  transition={
                    item.type === "Game" ? {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : item.type === "Robot" ? {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : {
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }
                />
                
                {/* Title overlay - appears on hover in center */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl px-4 text-center">
                  <span className="text-white text-lg font-bold tracking-widest whitespace-pre-line leading-tight">{item.label}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}