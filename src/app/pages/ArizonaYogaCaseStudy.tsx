import image_951dd61283abdcb0dee59290acdcf1450ed7ea9e from 'figma:asset/951dd61283abdcb0dee59290acdcf1450ed7ea9e.png';
import image_c85cd79d8db605865c878c0bd8b508284ae400c1 from 'figma:asset/c85cd79d8db605865c878c0bd8b508284ae400c1.png';
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Target, Lightbulb, Search, Navigation, DollarSign, FileQuestion, Clock, Heart, Users, ChevronUp } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCursor } from "../contexts/CursorContext";
import arizonaYogaDesign from 'figma:asset/01b9d998b474ecbc53d152e413a35c6edd701f13.png';
import oldDesignImage from 'figma:asset/76ca1ed783f58afd4d71e8218bdea43ede5d0e58.png';
import week9TableImage from 'figma:asset/1c16949135c0c19e1ae5d17f039a74743c0c6412.png';
import week11PrototypeImage from 'figma:asset/7db7cd97752b64e88e74537ee30baa41427b8883.png';
import solutionImage1 from 'figma:asset/4517248f4041fa94796444689126f919f6230a28.png';
import solutionImage2 from 'figma:asset/3334744517cfb0f8fa6a3697b568391d2ea42a22.png';
import solutionImage3 from 'figma:asset/d17e5d9158db8507662ad84fcb34bd83c9d7e945.png';
import solutionImage4 from 'figma:asset/489c923093a55da107a0157f6c89d4a17dc16080.png';

// ─── Fade In on Scroll ─────────────────────────────────────────────────────────
function FadeInView({
  children,
  delay = 0,
  className = "",
  y = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Counter Component
function AnimatedCounter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>{displayValue.toFixed(decimals)}</span>;
}

export function ArizonaYogaCaseStudy() {
  const navigate = useNavigate();
  const { setHideCursor } = useCursor();
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollTopArrowPosition, setScrollTopArrowPosition] = useState({ x: 0, y: 0 });
  const [prevTopNavPosition, setPrevTopNavPosition] = useState({ x: 0, y: 0 });
  const [nextTopNavPosition, setNextTopNavPosition] = useState({ x: 0, y: 0 });
  const [prevBottomNavPosition, setPrevBottomNavPosition] = useState({ x: 0, y: 0 });
  const [nextBottomNavPosition, setNextBottomNavPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTopMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setScrollTopArrowPosition({ x: clampedX, y: clampedY });
  };

  const handlePrevTopNavMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setPrevTopNavPosition({ x: clampedX, y: clampedY });
  };

  const handleNextTopNavMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setNextTopNavPosition({ x: clampedX, y: clampedY });
  };

  const handlePrevBottomNavMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setPrevBottomNavPosition({ x: clampedX, y: clampedY });
  };

  const handleNextBottomNavMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setNextBottomNavPosition({ x: clampedX, y: clampedY });
  };

  const solutionImages = [solutionImage1, solutionImage2, solutionImage3, solutionImage4];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % solutionImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + solutionImages.length) % solutionImages.length);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black min-h-screen text-[#A7A7A7] font-sans selection:bg-white selection:text-black">
      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        data-cursor-hide="true"
        onMouseEnter={() => setHideCursor(true)}
        onMouseLeave={() => {
          setHideCursor(false);
          setScrollTopArrowPosition({ x: 0, y: 0 });
        }}
        onMouseMove={handleScrollTopMouseMove}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
          pointerEvents: showScrollTop ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-28 right-8 z-[10000] w-16 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#282834] hover:border-transparent hover:scale-110 transition-all duration-300"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        aria-label="Scroll to top"
      >
        <motion.div
          className="inline-block flex items-center justify-center"
          animate={{ x: scrollTopArrowPosition.x, y: scrollTopArrowPosition.y }}
          transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
        >
          <ChevronUp size={20} />
        </motion.div>
      </motion.button>
      
      {/* Hero Section */}
      <section id="hero" className="pt-24 md:pt-32 pb-10 md:pb-12 px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto w-full">
        <div className="flex justify-between items-start gap-8">
          
          <div className="flex-1 min-w-0 max-w-[760px]">
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-sans font-bold mb-6 text-white tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent"
              style={{ fontSize: "clamp(3.5rem, 5vw, 5.1rem)", lineHeight: 1.1 }}
            >
              Arizona Yoga Co. - Website UX Redesign
            </motion.h1>
            
            <motion.h2 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="text-[#A7A7A7] text-lg md:text-xl max-w-[700px] mb-8"
              style={{ lineHeight: 1.5 }}
            >
              UX Research & Website Redesign
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="inline-block rounded-full px-4 py-1.5 text-xs tracking-widest uppercase border border-white/15 text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Second Semester Project
              </span>
            </motion.div>
          </div>
          
          {/* Prev/Next Navigation */}
          <div className="hidden md:flex gap-3 shrink-0 pt-4">
                <Link 
                  to="/works/aisle" 
                  data-cursor-hide="true"
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#282834] hover:border-transparent transition-all duration-300 opacity-70 hover:opacity-100 overflow-hidden"
                  onMouseEnter={() => setHideCursor(true)}
                  onMouseLeave={() => {
                    setHideCursor(false);
                    setPrevTopNavPosition({ x: 0, y: 0 });
                  }}
                  onMouseMove={handlePrevTopNavMouseMove}
                  aria-label="Previous Project"
                >
                  <motion.div
                    className="inline-block flex items-center justify-center"
                    animate={{ x: prevTopNavPosition.x, y: prevTopNavPosition.y }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
                  >
                    <ArrowLeft size={18} />
                  </motion.div>
                </Link>
                <Link 
                  to="/works/fintech-dashboard" 
                  data-cursor-hide="true"
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#282834] hover:border-transparent transition-all duration-300 opacity-70 hover:opacity-100 overflow-hidden"
                  onMouseEnter={() => setHideCursor(true)}
                  onMouseLeave={() => {
                    setHideCursor(false);
                    setNextTopNavPosition({ x: 0, y: 0 });
                  }}
                  onMouseMove={handleNextTopNavMouseMove}
                  aria-label="Next Project"
                >
                  <motion.div
                    className="inline-block flex items-center justify-center"
                    animate={{ x: nextTopNavPosition.x, y: nextTopNavPosition.y }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </Link>
              </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto w-full pb-16">
        <div className="max-w-[1190px] mx-auto">
          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full aspect-video bg-[#121217] rounded-lg overflow-hidden mb-16 border border-white/10 relative"
          >
            {/* Base image with conditional transform */}
            <motion.img 
              src={arizonaYogaDesign}
              alt="Arizona Yoga Co. Website Redesign"
              className="w-full h-full object-cover"
              animate={{
                x: hoveredSide === 'left' ? -6 : hoveredSide === 'right' ? 6 : 0,
                y: hoveredSide === 'left' ? -6 : hoveredSide === 'right' ? 6 : 0,
                scale: hoveredSide ? 1.02 : 1
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            
            {/* Invisible hover zones */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full cursor-pointer z-10"
              onMouseEnter={() => setHoveredSide('left')}
              onMouseLeave={() => setHoveredSide(null)}
            />
            
            <div
              className="absolute top-0 right-0 w-1/2 h-full cursor-pointer z-10"
              onMouseEnter={() => setHoveredSide('right')}
              onMouseLeave={() => setHoveredSide(null)}
            />
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════════
              02 — PROJECT AT A GLANCE
          ══════════════════════════════════════════════════════════════════ */}
          <section id="glance" className="w-full pb-16 md:pb-24">
            <div className="w-full border-y border-white/10 py-12 md:py-16">
              <FadeInView>
                <span
                  className="block mb-8 text-[11px] tracking-widest uppercase text-[#7FAF9B]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Project at a Glance
                </span>
              </FadeInView>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {[
                  { label: "ROLE", value: "UX Designer\nResearcher" },
                  { label: "TOOLS", value: "Heuristics, Surveys\nPersonas, Figma" },
                  { label: "TIMELINE", value: "Second Semester" },
                  { label: "PLATFORM", value: "Desktop Website\nResponsive Redesign" }
                ].map((item, i) => (
                  <FadeInView key={item.label} delay={i * 0.05} className="col-span-1">
                    <div className="flex flex-col">
                      <h4
                        className="text-[11px] mb-3 tracking-widest uppercase text-white/40"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        {item.label}
                      </h4>
                      <p className="text-[14px] leading-relaxed text-white/80 whitespace-pre-line">
                        {item.value}
                      </p>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </section>            
            {/* ══════════════════════════════════════════════════════════════════
              03 — THE CHALLENGE
          ══════════════════════════════════════════════════════════════════ */}
          <section id="problem" className="pt-16 md:pt-24 pb-16 md:pb-20">
            <FadeInView>
              <div className="max-w-3xl mb-16 md:mb-24">
                <span
                  className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-[#FF6B50]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  01 / THE CHALLENGE
                </span>
                <h2
                  className="font-sans font-medium leading-none tracking-tight mb-8 text-white"
                  style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
                >
                  Good intentions. High friction.
                </h2>
                <p className="text-[18px] md:text-[21px] leading-relaxed font-light text-white/70">
                  Despite offering valuable yoga programs and a unique donation-based pricing model, the Arizona Yoga Co. website created significant friction for users attempting to complete core tasks, particularly for first-time visitors and beginners.
                </p>
              </div>
            </FadeInView>

            {/* Problem Themes */}
            <div className="border-t border-white/10 pt-16 md:pt-20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                <FadeInView delay={0.1}>
                  <h3 className="text-lg font-medium text-white mb-3">Class Discovery</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Users struggled to understand how to book or register for classes across different formats.
                  </p>
                </FadeInView>
                <FadeInView delay={0.2}>
                  <h3 className="text-lg font-medium text-white mb-3">Navigation</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Inconsistent navigation patterns between Studio, Zoom, YouTube, and Workshop formats.
                  </p>
                </FadeInView>
                <FadeInView delay={0.3}>
                  <h3 className="text-lg font-medium text-white mb-3">Pricing Ambiguity</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Users couldn't interpret the donation-based pricing model with confidence.
                  </p>
                </FadeInView>
                <FadeInView delay={0.4}>
                  <h3 className="text-lg font-medium text-white mb-3">Hierarchy</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Difficulty finding essential information like schedules, instructors, and contact options.
                  </p>
                </FadeInView>
              </div>
            </div>
          </section>


          {/* ══════════════════════════════════════════════════════════════════
              04 — RESEARCH
          ══════════════════════════════════════════════════════════════════ */}
          <section id="research" className="pt-24 md:pt-32 pb-16 md:pb-24 border-t border-white/10">
            <FadeInView>
              <div className="max-w-3xl mb-16 md:mb-24">
                <span
                  className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-[#7FAF9B]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  02 / RESEARCH
                </span>
                <h2
                  className="font-sans font-medium leading-none tracking-tight mb-8 text-white"
                  style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
                >
                  Finding the friction.
                </h2>
                <p className="text-[18px] md:text-[21px] leading-relaxed font-light text-white/70">
                  Through heuristic evaluation and user surveys, I discovered that beginners were struggling to navigate the schedule and understand the donation model. The site was built for those who already knew how it worked, alienating newcomers.
                </p>
              </div>
            </FadeInView>

            {/* Research Image */}
            <FadeInView delay={0.2} y={20}>
              <div className="w-full aspect-video bg-[#121217] rounded-lg border border-white/10 overflow-hidden mb-16 relative">
                <img
                  src={image_c85cd79d8db605865c878c0bd8b508284ae400c1}
                  alt="Arizona Yoga Co. existing website"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md py-2 px-4 rounded border border-white/10">
                  <p className="text-white text-xs font-mono tracking-wide">Legacy Website (Old Design)</p>
                </div>
              </div>
            </FadeInView>

            {/* Research Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-5xl">
              <FadeInView delay={0.1}>
                <h3 className="text-[#FF6B50] text-sm font-mono tracking-widest uppercase mb-4">
                  01 / Heuristics
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  Evaluated against Nielsen's 10 Usability Heuristics, the legacy site suffered from a lack of user control, poor visibility of system status during booking, and buried documentation regarding the donation model.
                </p>
              </FadeInView>
              <FadeInView delay={0.2}>
                <h3 className="text-[#FF6B50] text-sm font-mono tracking-widest uppercase mb-4">
                  02 / User Surveys
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  Surveys with 14 users revealed that class schedules, booking, and pricing were critical decision factors. Many users expected standard online booking flows and found the donation model confusing without proper framing.
                </p>
              </FadeInView>
            </div>
          </section>
          {/* (Old Timeline Removed) */}

          {/* ══════════════════════════════════════════════════════════════════
              05 — DESIGN
          ══════════════════════════════════════════════════════════════════ */}
          <section id="design" className="pt-24 md:pt-32 pb-16 md:pb-24 border-t border-white/10">
            <FadeInView>
              <div className="max-w-3xl mb-16 md:mb-24">
                <span
                  className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-[#7FAF9B]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  03 / DESIGN
                </span>
                <h2
                  className="font-sans font-medium leading-none tracking-tight mb-8 text-white"
                  style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
                >
                  Reducing the cognitive load.
                </h2>
                <p className="text-[18px] md:text-[21px] leading-relaxed font-light text-white/70">
                  The final design is a mobile-first experience with a streamlined booking flow that takes just 2 clicks from homepage to confirmation. The visual identity uses warm, earthy tones and soft imagery that reflects the studio's peaceful atmosphere, while keeping the interface highly utilitarian.
                </p>
              </div>
            </FadeInView>

            {/* Solution Images - Scrollable Carousel */}
            <FadeInView delay={0.2} y={20}>
              <div 
                className="relative w-full h-[700px] bg-[#121217] rounded-lg border border-white/10 mb-16 overflow-hidden"
              >
                {/* Scrollable content area */}
                <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                  <ImageWithFallback 
                    src={solutionImages[currentImageIndex]}
                    alt={`Arizona Yoga Final Design ${currentImageIndex + 1}`}
                    className="w-full h-auto select-none"
                    draggable={false}
                  />
                </div>
                
                {/* Scroll hint badge - fixed position */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full pointer-events-none z-20">
                  Scroll to explore
                </div>
                
                {/* Navigation buttons - fixed at bottom */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                  <button
                    onClick={handlePrevImage}
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                    className="bg-black/50 backdrop-blur-md hover:bg-black/80 border border-white/10 text-white w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  
                  <div className="bg-black/70 backdrop-blur-md text-white text-xs px-4 py-0 rounded-full flex items-center gap-2 font-mono">
                    <span className="font-bold">{currentImageIndex + 1}</span>
                    <span className="text-white/50">/</span>
                    <span className="text-white/70">{solutionImages.length}</span>
                  </div>
                  
                  <button
                    onClick={handleNextImage}
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                    className="bg-black/50 backdrop-blur-md hover:bg-black/80 border border-white/10 text-white w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
                    aria-label="Next image"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </FadeInView>

            {/* Feature Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl">
              <FadeInView delay={0.1}>
                <h3 className="text-white text-sm font-mono tracking-widest uppercase mb-4">
                  01 / 1-Click Booking
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  Users can now jump straight into the schedule and reserve a spot directly from the homepage, reducing the flow from 5 disjointed pages down to a single seamless modal.
                </p>
              </FadeInView>
              <FadeInView delay={0.2}>
                <h3 className="text-white text-sm font-mono tracking-widest uppercase mb-4">
                  02 / Clear Pricing
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  The donation-based model is introduced with predefined tiers and a custom input box, providing immediate clarity on what is expected without creating a paywall.
                </p>
              </FadeInView>
              <FadeInView delay={0.3}>
                <h3 className="text-white text-sm font-mono tracking-widest uppercase mb-4">
                  03 / Unified UI
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  Whether a class is In-Studio, on Zoom, or a Workshop, the interface remains consistent, allowing users to browse offerings without shifting context.
                </p>
              </FadeInView>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              06 — REFLECTION
          ══════════════════════════════════════════════════════════════════ */}
          <section id="reflection" className="pt-24 md:pt-32 pb-16 md:pb-24 border-t border-white/10">
            <FadeInView>
              <div className="max-w-4xl mb-24">
                <span
                  className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  04 / REFLECTION
                </span>
                <h2
                  className="font-sans font-medium leading-none tracking-tight text-white mb-8"
                  style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
                >
                  Mobile-first is mandatory.
                </h2>
                <div className="text-[18px] md:text-[21px] leading-relaxed font-light text-white/70 space-y-6">
                  <p>
                    Post-launch surveys showed an average rating of 4.8/5 for the new booking experience. The data showed that most users make booking decisions spontaneously, often on the go.
                  </p>
                  <p>
                    When the website finally matched the studio's warm, welcoming atmosphere, conversion rates improved dramatically.
                  </p>
                </div>
              </div>
            </FadeInView>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
              <FadeInView delay={0.1}>
                <h3 className="text-lg font-medium text-white mb-4">Identity Consistency</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Visual identity consistency between physical and digital experiences is crucial for building trust.
                </p>
              </FadeInView>
              <FadeInView delay={0.2}>
                <h3 className="text-lg font-medium text-white mb-4">Community Matters</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  The community features, while initially considered a "nice to have," became one of the most-used aspects of the platform, driving both engagement and retention.
                </p>
              </FadeInView>
            </div>
          </section>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM NAVIGATION (Footer System)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pb-12 px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto">
        <div className="max-w-[1190px] mx-auto">
          <div
            className="flex justify-end gap-4 mt-8 pt-6"
            style={{ borderTop: `1px solid rgba(255, 255, 255, 0.1)` }}
          >
             <Link 
               to="/works/aisle" 
               data-cursor-hide="true"
               className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#282834] hover:border-transparent transition-all duration-300 opacity-70 hover:opacity-100 overflow-hidden"
               onMouseEnter={() => setHideCursor(true)}
               onMouseLeave={() => {
                 setHideCursor(false);
                 setPrevBottomNavPosition({ x: 0, y: 0 });
               }}
               onMouseMove={handlePrevBottomNavMouseMove}
               aria-label="Previous Project"
             >
               <motion.div
                 className="inline-block flex items-center justify-center"
                 animate={{ x: prevBottomNavPosition.x, y: prevBottomNavPosition.y }}
                 transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
               >
                 <ArrowLeft size={18} />
               </motion.div>
             </Link>
             <Link 
               to="/works/fintech-dashboard" 
               data-cursor-hide="true"
               className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#282834] hover:border-transparent transition-all duration-300 opacity-70 hover:opacity-100 overflow-hidden"
               onMouseEnter={() => setHideCursor(true)}
               onMouseLeave={() => {
                 setHideCursor(false);
                 setNextBottomNavPosition({ x: 0, y: 0 });
               }}
               onMouseMove={handleNextBottomNavMouseMove}
               aria-label="Next Project"
             >
               <motion.div
                 className="inline-block flex items-center justify-center"
                 animate={{ x: nextBottomNavPosition.x, y: nextBottomNavPosition.y }}
                 transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
               >
                 <ArrowRight size={18} />
               </motion.div>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}