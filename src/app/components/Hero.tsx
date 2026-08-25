import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useCursor } from "../contexts/CursorContext";

import image_9eba4ef78c719ff307dfa84e927ac719277023fb from 'figma:asset/9eba4ef78c719ff307dfa84e927ac719277023fb.png';
import chemoVideo from '../../assets/Chemo thumbnail.mp4';
import arizonaYogaVideo from '../../assets/Arizona yoga.mp4';
import auraVideo from '../../assets/Aura thumbnail.mp4';
import aisleVideo from '../../assets/AIsle.mp4';

const projects = [
  {
    id: "fintech-dashboard",
    title: "Chemotherapy education platform",
    category: "UX Case Study",
    video: chemoVideo,
    size: "col-span-1 md:col-span-1 md:row-span-1",
  },
  {
    id: "aura",
    title: "Aura - Feel the room",
    category: "UX Case Study",
    video: auraVideo,
    size: "col-span-1 md:col-span-1 md:row-span-1",
  },
  {
    id: "aisle",
    title: "Aisle",
    category: "Product Design",
    video: aisleVideo,
    size: "col-span-1 md:col-span-1 md:row-span-1",
  },
  {
    id: "arizona-yoga-studio",
    title: "Arizona Yoga Studio",
    category: "Coming Soon",
    video: arizonaYogaVideo,
    size: "col-span-1 md:col-span-1 md:row-span-1",
  },
];

export function Hero() {
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const { setHideCursor, setIsTextCursor, setCursorText } = useCursor();

  const greetings = [
    "Hello",
    "Hola", 
    "Bonjour",
    "Ciao",
    "こんにちは",
    "안녕하세요",
    "你好",
    "Привет",
    "नमस्ते",
    "வணக்கம்"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Enhanced magnetic effect - more responsive movement
    const maxMove = 12;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setTextPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setTextPosition({ x: 0, y: 0 });
  };



  return (
    <section className="relative min-h-screen bg-black overflow-hidden pb-16">
      {/* 6-Column Grid Background - Center Aligned with Large Margins - Double Lines */}
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

      {/* Content Container - Aligned to Grid */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 md:px-16 lg:px-24 py-8">
        {/* Main Text Content - Left Aligned to Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col mt-24 mb-16"
        >
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter mb-8 sm:mb-10 md:mb-12 max-w-5xl font-normal"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <div className="h-[1.2em] overflow-hidden relative mb-1 sm:mb-2 min-w-[300px] sm:min-w-[400px] md:min-w-[500px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentGreeting}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="block absolute top-0 left-0 whitespace-nowrap"
                >
                  {greetings[currentGreeting]}
                </motion.span>
              </AnimatePresence>
              {/* Invisible placeholder to maintain height/width */}
              <span className="invisible whitespace-nowrap">안녕하세요</span>
            </div>
            <span className="inline-block mb-1 sm:mb-2">i'm</span> <br />
            <span className="text-[#A7A7A7]">thiruvenkata saha.</span>
          </h1>
          <p 
            className="text-[#A7A7A7] text-base md:text-xl max-w-[95%] lg:max-w-[90%] leading-relaxed text-left mb-8"
            style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}
            onMouseEnter={() => setIsTextCursor(true)}
            onMouseLeave={() => setIsTextCursor(false)}
          >
            I’m a founding designer who loves the 0→1. I turn fuzzy ideas into products used by 3,000+ people, experiment with AI from research to media production and occasionally wonder, “What if we tried it this way?”
          </p>
          
          {/* Say Hi Button */}
          <Link to="/contact">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="group flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full text-white hover:bg-[#282834] hover:border-transparent transition-all duration-300"
              style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.02em' }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHideCursor(true)}
              onMouseLeave={() => {
                setHideCursor(false);
                setTextPosition({ x: 0, y: 0 });
              }}
            >
              <motion.div
                className="flex items-center gap-2"
                animate={{ x: textPosition.x, y: textPosition.y }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  mass: 0.5
                }}
              >
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                <span>say hi</span>
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>

        {/* Works Grid */}
        <div id="works" className="grid grid-cols-1 md:grid-cols-4 gap-2 auto-rows-[400px] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          {projects.map((project, index) => {
            const cardContent = (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                className={`relative group cursor-pointer overflow-hidden h-full w-full ${
                  project.id === 'arizona-yoga-studio' ? 'bg-white' : 
                  index === 2 ? 'bg-gradient-to-b from-[#0A0A0A] to-black' : 'bg-[#111]'
                } ${index === 0 ? 'rounded-tl-lg rounded-bl-lg' : index === 3 ? 'rounded-tr-lg rounded-br-lg' : ''}`}
              >
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full transition-transform duration-700 ${
                      project.id === 'arizona-yoga-studio' ? 'object-contain scale-125 group-hover:scale-[1.30]' : 'object-cover group-hover:scale-105'
                    }`}
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full transition-transform duration-700 object-cover group-hover:scale-105"
                  />
                )}
                
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xl bg-black/60 ${index === 0 ? 'rounded-tl-lg rounded-bl-lg' : index === 3 ? 'rounded-tr-lg rounded-br-lg' : ''}`}>
                  <h3 className="text-xl font-medium mb-1 text-white text-center">{project.title}</h3>
                  {index === 0 && (
                    <motion.div 
                      className="flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 via-yellow-400/20 to-yellow-500/20 border border-yellow-400/30"
                      animate={{ 
                        boxShadow: [
                          '0 0 10px rgba(250, 204, 21, 0.3)',
                          '0 0 20px rgba(250, 204, 21, 0.5)',
                          '0 0 10px rgba(250, 204, 21, 0.3)'
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Trophy size={16} className="text-yellow-400" />
                      </motion.div>
                      <p 
                        className="text-xs font-medium relative overflow-hidden"
                        style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.02em' }}
                      >
                        <span className="relative inline-block bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                          Mayo Clinic Observership Awardee
                        </span>
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );

            return (
              <Link to={`/works/${project.id}`} key={index} className={`${project.size} block`}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}