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
    <div className="bg-black min-h-screen text-[#A7A7A7] font-['IBM_Plex_Mono'] selection:bg-white selection:text-black">
      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        onMouseEnter={() => setHideCursor(true)}
        onMouseLeave={() => setHideCursor(false)}
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
        <ChevronUp size={20} />
      </motion.button>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="max-w-[1190px] mx-auto">
          <div className="flex flex-col gap-8 mb-12">
            <div className="flex justify-between items-start">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent"
                >
                  Arizona Yoga Co. - Website UX Redesign
                </motion.h1>
                <p className="text-xl text-[#A7A7A7] mb-6">UX Research & Website Redesign</p>
                <span className="inline-block border border-white/20 rounded-full px-4 py-1 text-sm">
                  Second Semester Project
                </span>
              </div>
              
              {/* Prev/Next Navigation */}
              <div className="hidden md:flex gap-4">
                <Link to="/works/fintech-dashboard" className="p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors">
                  <ArrowLeft size={20} />
                </Link>
                <Link to="/works/zylker" className="p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors">
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

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

          {/* Project Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 border-b border-white/10 pb-16"
          >
            <div className="col-span-1 space-y-8">
              <div>
                <h3 className="text-[#FF8C42] text-sm font-bold mb-2 uppercase tracking-wider text-[16px]">My Role</h3>
                <p className="font-semibold mb-2 text-xl">UX Designer & Researcher</p>
                <p className="leading-relaxed text-[18px]">Led the complete UX research and redesign process, from heuristic evaluation and user surveys to prototyping and usability testing.</p>
              </div>
              <div>
                <h3 className="text-[#FF8C42] text-sm font-bold mb-2 uppercase tracking-wider text-[16px]">Tools & Methods</h3>
                <p className="leading-relaxed text-[18px]">
                  Heuristic Evaluation, User Surveys, Personas, Usability Testing, Figma Prototyping
                </p>
              </div>
              <div>
                <h3 className="text-[#FF8C42] text-sm font-bold mb-2 uppercase tracking-wider text-[16px]">Platform & Timeline</h3>
                <p className="leading-relaxed mb-3 text-[18px]">
                  <span className="text-white font-semibold text-[20px]">Platform:</span> Desktop Website
                </p>
                <p className="leading-relaxed text-[18px]">
                  <span className="text-white font-semibold text-[20px]">Timeline:</span> Second Semester Project
                </p>
              </div>
            </div>
            <div className="col-span-1">
              <h3 className="text-[#FF8C42] text-sm font-bold mb-4 uppercase tracking-wider text-[16px]">Overview</h3>
              <p className="text-base md:text-lg leading-[1.7] text-[rgb(167,167,167)] text-left">
                Arizona Yoga Co. is a community-focused yoga studio offering in-studio, online, and workshop-based classes through a donation-based pricing model. While the studio has a strong mission centered on accessibility and inclusivity, its website experience did not effectively support users in discovering classes, understanding pricing, or completing key tasks such as booking or contacting the studio. This project focused on identifying usability barriers and translating research-driven insights into practical, user-centered design solutions.
              </p>
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-32">
            
            {/* Section: Context */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Target className="text-white" size={24} />
                <span className="text-sm font-bold tracking-widest text-white">CONTEXT</span>
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-white to-[#A7A7A7] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                The Challenge
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Left Column - Body Text */}
                <div>
                  <p className="leading-relaxed text-[18px] mb-6">
                    Despite offering valuable yoga programs and a unique donation-based pricing model, the Arizona Yoga Co. website created significant friction for users attempting to complete core tasks.
                  </p>
                  <p className="leading-relaxed text-[18px]">
                    Research revealed that users struggled with understanding how to book classes, navigating between different class formats, interpreting the donation-based pricing model, and finding essential information. These issues affected usability, user trust, and conversion—particularly for first-time visitors and beginners.
                  </p>
                </div>

                {/* Right Column - Stacked Cards */}
                <div className="flex flex-col gap-2">
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="flex gap-4 items-start mb-3">
                      <Search size={20} className="text-[#FFA500] shrink-0 mt-1" />
                      <h3 className="text-white text-lg font-bold">Class Discovery Confusion</h3>
                    </div>
                    <p className="leading-relaxed text-[#A7A7A7] ml-9">
                      Users struggled to understand how to book or register for classes across different formats.
                    </p>
                  </div>
                  
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="flex gap-4 items-start mb-3">
                      <Navigation size={20} className="text-[#FFA500] shrink-0 mt-1" />
                      <h3 className="text-white text-lg font-bold">Navigation Complexity</h3>
                    </div>
                    <p className="leading-relaxed text-[#A7A7A7] ml-9">
                      Inconsistent navigation patterns between Studio, Zoom, YouTube, and Workshop formats.
                    </p>
                  </div>
                  
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="flex gap-4 items-start mb-3">
                      <DollarSign size={20} className="text-[#FFA500] shrink-0 mt-1" />
                      <h3 className="text-white text-lg font-bold">Pricing Ambiguity</h3>
                    </div>
                    <p className="leading-relaxed text-[#A7A7A7] ml-9">
                      Users couldn't interpret the donation-based pricing model with confidence.
                    </p>
                  </div>
                  
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="flex gap-4 items-start mb-3">
                      <FileQuestion size={20} className="text-[#FFA500] shrink-0 mt-1" />
                      <h3 className="text-white text-lg font-bold">Information Hierarchy</h3>
                    </div>
                    <p className="leading-relaxed text-[#A7A7A7] ml-9">
                      Difficulty finding essential information like schedules, instructor details, and contact options.
                    </p>
                  </div>
                  
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="flex gap-4 items-start mb-3">
                      <Clock size={20} className="text-[#FFA500] shrink-0 mt-1" />
                      <h3 className="text-white text-lg font-bold">No Online Booking Flow</h3>
                    </div>
                    <p className="leading-relaxed text-[#A7A7A7] ml-9">
                      Absence of online booking flow increased cognitive load and caused frustration.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Highlighted Problem Statement Box */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative bg-gradient-to-br from-[#121217] to-[#0A0A0A] border border-white/5 rounded-2xl p-8 md:p-12 my-12 w-full overflow-hidden group cursor-pointer"
              >
                {/* Animated background glow */}
                <motion.div 
                  className="absolute inset-0 bg-[#FFA500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    background: [
                      "radial-gradient(circle at 0% 0%, rgba(255, 165, 0, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 100%, rgba(255, 165, 0, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 0% 0%, rgba(255, 165, 0, 0.1) 0%, transparent 50%)",
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Icon */}
                <div className="flex justify-center mb-6 relative z-10">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-[#FFA500]/10 border border-[#FFA500] rounded-full flex items-center justify-center"
                  >
                    <Lightbulb size={32} className="text-[#FFA500]" />
                  </motion.div>
                </div>

                {/* Title */}
                <h3 className="text-[#FFA500] text-sm font-bold mb-4 uppercase tracking-widest text-center relative z-10">
                  The Challenge
                </h3>

                {/* Body Text */}
                <h4 className="text-white md:text-2xl font-bold leading-relaxed text-center relative z-10 text-[20px]">
                  How might we redesign the experience to reduce friction in class discovery and booking, clearly communicate pricing, and support both beginner and experienced practitioners?
                </h4>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA500]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFA500]/5 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </motion.section>

            {/* Section: Research */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Lightbulb className="text-white" size={24} />
                <span className="text-sm font-bold tracking-widest text-white">RESEARCH</span>
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-[#A7A7A7] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Project Timeline — 12-Week UX Process
              </motion.h2>
              <motion.p 
                className="leading-relaxed mb-16 text-[18px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                This project followed a structured 12-week UX research and design process, moving from understanding the problem to delivering research-driven solutions.
              </motion.p>

              {/* Week 1-2: Initial Audit */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 1–2</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Project Understanding & Initial Audit</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-4">
                  I began by familiarizing myself with Arizona Yoga Co.'s mission, offerings, and existing website experience. During this phase, I reviewed the site's structure, content, and primary user flows to understand how users currently discover classes, pricing, and contact information.
                </p>
                <p className="leading-relaxed text-[18px]">
                  I identified early signs of usability friction, including unclear navigation labels, inconsistent layouts across class pages, and the absence of a clear booking pathway. This initial audit helped me form hypotheses that guided deeper research in later stages.
                </p>
              </motion.div>
              
              {/* Research Image 1 */}
              <motion.div 
                className="w-full aspect-video bg-[#121217] rounded-lg border border-white/10 overflow-hidden mb-16 relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={image_c85cd79d8db605865c878c0bd8b508284ae400c1}
                  alt="Arizona Yoga Co. existing website"
                  className="w-full h-full object-cover"
                />
                
                {/* Hover overlay text */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm py-3 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-semibold tracking-wide">Existing Design (Old Version)</p>
                </div>
              </motion.div>

              {/* Week 3-4: Heuristic Evaluation */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 3–4</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Heuristic Evaluation (Usability Assessment)</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  I conducted a comprehensive heuristic evaluation using Nielsen's 10 Usability Heuristics to systematically identify usability issues across the website.
                </p>
                
                <div 
                  className="bg-[#121217] p-6 rounded-lg border border-white/5 mb-4 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                  onMouseEnter={() => setHideCursor(true)}
                  onMouseLeave={() => setHideCursor(false)}
                >
                  <h4 className="text-[#FF8C42] font-bold mb-4">Key issues identified included:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Lack of user control and freedom (no clear way to undo actions or navigate back)</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Poor visibility of system status (no feedback on clicks or form interactions)</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Inconsistent standards across similar pages</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Missing or hidden help and documentation</p>
                    </li>
                  </ul>
                </div>
                
                <p className="leading-relaxed text-[18px]">
                  Each issue was severity-rated to prioritize design focus. Several problems were classified as major or catastrophic, particularly around navigation, booking expectations, and clarity of actions. These findings established a strong usability baseline for the redesign.
                </p>
              </motion.div>

              {/* Week 5: User Survey */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 5</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">User Survey & Quantitative Research</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  To better understand user expectations, behaviors, and decision-making patterns, I designed and conducted a user survey with 14 participants.
                </p>
                
                <div 
                  className="bg-[#121217] p-6 rounded-lg border border-white/5 mb-4 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                  onMouseEnter={() => setHideCursor(true)}
                  onMouseLeave={() => setHideCursor(false)}
                >
                  <h4 className="text-[#FF8C42] font-bold mb-4">The survey revealed that:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Many users were beginners or infrequent visitors who needed fast, obvious answers</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Class schedules, booking, pricing, and location information were considered critical</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Most users expected familiar patterns such as online booking and membership options</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Donation-based pricing was unfamiliar and caused uncertainty</p>
                    </li>
                  </ul>
                </div>
                
                <p className="leading-relaxed text-[18px]">
                  These insights helped ground the redesign in real user needs rather than assumptions.
                </p>
              </motion.div>

              {/* Survey Image */}
              <motion.div 
                className="w-full aspect-video bg-[#121217] rounded-lg border border-white/10 overflow-hidden mb-16 flex items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.img
                  src={image_951dd61283abdcb0dee59290acdcf1450ed7ea9e}
                  alt="User survey and feedback collection"
                  className="w-auto h-auto max-w-full max-h-full object-contain cursor-pointer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </motion.div>

              {/* Week 6: Research Synthesis */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 6</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Research Synthesis & Key Insights</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  I synthesized findings from the heuristic evaluation and user survey into clear, actionable insights. This step allowed me to move from individual observations to broader UX problems.
                </p>
                
                <h4 className="text-[#FF8C42] font-bold mb-4">Three core themes emerged:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="text-2xl font-bold text-[#FFA500] mb-2">1</div>
                    <h5 className="text-[#FF8C42] font-bold mb-2">Booking friction</h5>
                    <p className="text-[16px]">Users could not complete their primary goal efficiently</p>
                  </div>
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="text-2xl font-bold text-[#FFA500] mb-2">2</div>
                    <h5 className="text-[#FF8C42] font-bold mb-2">Cognitive overload</h5>
                    <p className="text-[16px]">Inconsistent layouts and hidden information increased effort</p>
                  </div>
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <div className="text-2xl font-bold text-[#FFA500] mb-2">3</div>
                    <h5 className="text-[#FF8C42] font-bold mb-2">Decision anxiety</h5>
                    <p className="text-[16px]">Unclear pricing and expectations reduced user confidence</p>
                  </div>
                </div>
              </motion.div>

              {/* Week 7: Persona Development */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 7</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Persona Development</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  Based on research patterns, I created user personas representing key audience segments, including beginners, experienced practitioners, and tech-savvy planners.
                </p>
                
                <div 
                  className="bg-[#121217] p-6 rounded-lg border border-white/5 mb-4 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                  onMouseEnter={() => setHideCursor(true)}
                  onMouseLeave={() => setHideCursor(false)}
                >
                  <h4 className="text-[#FF8C42] font-bold mb-4">Each persona captured:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Goals and motivations</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Pain points with the existing website</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Behavioral traits affecting booking and decision-making</p>
                    </li>
                  </ul>
                </div>
                
                <p className="leading-relaxed text-[18px]">
                  Personas ensured that design decisions remained user-centered and aligned with real needs throughout the redesign process.
                </p>
              </motion.div>

              {/* Week 8: Usability Test Planning */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 8</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Usability Test Planning</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  I developed a usability testing plan to validate whether users could successfully complete critical tasks such as finding a beginner-friendly class, comparing pricing options, and locating instructor or contact information.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <h5 className="text-[#FF8C42] font-bold mb-2">Clear test objectives</h5>
                    <p className="text-[16px]">Defined what success looks like for each task</p>
                  </div>
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <h5 className="text-[#FF8C42] font-bold mb-2">Realistic user tasks</h5>
                    <p className="text-[16px]">Scenarios based on actual user goals</p>
                  </div>
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <h5 className="text-[#FF8C42] font-bold mb-2">Success metrics</h5>
                    <p className="text-[16px]">Task completion and time on task</p>
                  </div>
                </div>
              </motion.div>

              {/* Week 9: Usability Testing */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 9</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Usability Testing & Observation</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  I conducted moderated usability testing sessions and observed participants as they attempted to complete key tasks on the existing website. Users consistently struggled with booking, navigation, and pricing clarity.
                </p>
                
                <div 
                  className="bg-[#121217] p-6 rounded-lg border border-white/5 mb-4 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                  onMouseEnter={() => setHideCursor(true)}
                  onMouseLeave={() => setHideCursor(false)}
                >
                  <h4 className="text-[#FF8C42] font-bold mb-4">Testing confirmed that:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">The lack of online booking was a blocker for all participants</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Navigation inconsistencies made comparison between class types difficult</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Users felt unsure about what to pay or what was expected in the donation model</p>
                    </li>
                  </ul>
                </div>
                
                <p className="leading-relaxed text-[18px]">
                  These findings validated earlier research and highlighted areas requiring immediate redesign.
                </p>
              </motion.div>

              {/* Usability Testing Table - Scrollable */}
              <motion.div 
                className="w-full h-[600px] bg-[#121217] rounded-lg border border-white/10 overflow-y-auto overflow-x-hidden mb-16 relative scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ImageWithFallback 
                  src={week9TableImage}
                  alt="Usability testing data table"
                  className="w-full h-auto select-none"
                  draggable={false}
                />
                <div className="sticky bottom-4 right-4 float-right mr-4 mb-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
                  Scroll to explore
                </div>
              </motion.div>

              {/* Week 10: Ideation */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 10</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Ideation & UX Solution Design</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  Using insights from testing, I began designing solutions to address the most critical usability issues. I focused on:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <h5 className="text-[#FF8C42] font-bold mb-2">Clear booking flow</h5>
                    <p className="text-[16px]">Step-by-step online booking experience</p>
                  </div>
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <h5 className="text-[#FF8C42] font-bold mb-2">Simplified navigation</h5>
                    <p className="text-[16px]">Improved information architecture</p>
                  </div>
                  <div 
                    className="bg-[#121217] p-6 rounded-lg border border-white/5 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                  >
                    <h5 className="text-[#FF8C42] font-bold mb-2">Clearer pricing</h5>
                    <p className="text-[16px]">Structured donation options</p>
                  </div>
                </div>
                <p className="leading-relaxed text-[18px] mt-6">
                  UX principles such as consistency, recognition over recall, and visibility of system status guided all design decisions.
                </p>
              </motion.div>

              {/* Week 11: High-Fidelity Prototyping */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 11</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">High-Fidelity Prototyping</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  I designed a high-fidelity prototype in Figma that translated research insights into a realistic, testable interface.
                </p>
                
                <div 
                  className="bg-[#121217] p-6 rounded-lg border border-white/5 mb-4 hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                  onMouseEnter={() => setHideCursor(true)}
                  onMouseLeave={() => setHideCursor(false)}
                >
                  <h4 className="text-[#FF8C42] font-bold mb-4">The prototype included:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">A prominent "Book a Class" call-to-action</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">A visual class scheduling and booking flow</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Clear pricing and donation selections</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Consistent layouts across class formats</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Accessibility improvements such as improved contrast and readable text sizes</p>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Prototype Image - Scrollable */}
              <motion.div 
                className="w-full h-[600px] bg-[#121217] rounded-lg border border-white/10 overflow-y-auto overflow-x-hidden mb-16 relative scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ImageWithFallback 
                  src={week11PrototypeImage}
                  alt="High-fidelity Figma prototype"
                  className="w-full h-auto select-none"
                  draggable={false}
                />
                <div className="sticky bottom-4 right-4 float-right mr-4 mb-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
                  Scroll to explore
                </div>
              </motion.div>

              {/* Week 12: Reflection */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#FFA500] text-black font-bold px-3 py-1 rounded text-sm">WEEK 12</div>
                  <h3 className="text-[#FF8C42] font-bold text-[20px]">Reflection & Expected Impact</h3>
                </div>
                <p className="leading-relaxed text-[18px] mb-6">
                  In the final week, I evaluated the redesigned experience against the original research goals. The proposed solution significantly reduced friction in booking, improved navigation clarity, and aligned user expectations with the studio's mission.
                </p>
                
                <div className="bg-gradient-to-br from-[#121217] to-[#0A0A0A] border border-white/5 rounded-2xl p-8">
                  <h4 className="text-[#FF8C42] font-bold mb-4 text-[20px]">Through this project, I strengthened my skills in:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Research synthesis and usability evaluation</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Translating insights into actionable design decisions</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full shrink-0 mt-2"></div>
                      <p className="text-[16px]">Designing for accessibility, clarity, and trust</p>
                    </li>
                  </ul>
                  <p className="leading-relaxed text-[18px] mt-6">
                    This 12-week process reinforced the importance of research-driven design and demonstrated how usability improvements can directly support both user needs and business goals.
                  </p>
                </div>
              </motion.div>
            </motion.section>

            {/* Highlight Insight */}
            <motion.div 
              className="border-l-4 border-white pl-8 py-4 mb-16"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="block text-sm font-bold text-white mb-2 uppercase">Key Insight</span>
              <p className="text-2xl md:text-3xl text-white text-[24px] font-bold">
                Students are 3x more likely to book a class if the schedule is accessible within one click.
              </p>
            </motion.div>

            {/* Section: Solution */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ArrowUpRight className="text-white" size={24} />
                <span className="text-sm font-bold tracking-widest text-white">SOLUTION</span>
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-[#A7A7A7] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                The Final Design
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div>
                  <p className="leading-relaxed text-[18px] mb-6">
                    We designed a mobile-first experience with a streamlined booking flow that takes just 2 clicks from homepage to confirmation. The new visual identity uses warm, earthy tones and soft imagery that reflects the studio's peaceful atmosphere.
                  </p>
                  <p className="leading-relaxed text-[18px]">
                    We also introduced a community feed where members can share their practice journey, studio updates, and connect with fellow yogis.
                  </p>
                </div>
                <div>
                  <h3 className="text-[#FF8C42] font-bold mb-4 text-[18px]">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFA500]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[#FFA500] text-xs">✓</span>
                      </div>
                      <p className="text-[16px]">One-tap class booking from any page</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFA500]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[#FFA500] text-xs">✓</span>
                      </div>
                      <p className="text-[16px]">Real-time class availability and waitlist</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFA500]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[#FFA500] text-xs">✓</span>
                      </div>
                      <p className="text-[16px]">Community feed for member connections</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFA500]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[#FFA500] text-xs">✓</span>
                      </div>
                      <p className="text-[16px]">Personalized class recommendations</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFA500]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[#FFA500] text-xs">✓</span>
                      </div>
                      <p className="text-[16px]">Instructor profiles with teaching styles</p>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Solution Images - Scrollable Carousel */}
              <motion.div 
                className="relative w-full h-[700px] bg-[#121217] rounded-lg border border-white/10 mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
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
                <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none z-20">
                  Scroll to explore
                </div>
                
                {/* Navigation buttons - fixed at bottom */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                  <button
                    onClick={handlePrevImage}
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                    className="bg-white/10 backdrop-blur-md hover:bg-[#282834] border border-white/20 hover:border-transparent text-white p-3 rounded-full transition-all duration-300"
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  <div className="bg-black/70 backdrop-blur-md text-white text-sm px-4 py-3 rounded-full flex items-center gap-2">
                    <span className="font-bold">{currentImageIndex + 1}</span>
                    <span className="text-white/50">/</span>
                    <span className="text-white/70">{solutionImages.length}</span>
                  </div>
                  
                  <button
                    onClick={handleNextImage}
                    onMouseEnter={() => setHideCursor(true)}
                    onMouseLeave={() => setHideCursor(false)}
                    className="bg-white/10 backdrop-blur-md hover:bg-[#282834] border border-white/20 hover:border-transparent text-white p-3 rounded-full transition-all duration-300"
                    aria-label="Next image"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            </motion.section>

            {/* Impact Section */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-white to-[#A7A7A7] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Impact & Results
              </motion.h2>
              
              <div className="mb-16">
                <div className="bg-gradient-to-br from-[#121217] to-[#0A0A0A] border border-white/5 rounded-2xl p-8">
                  <div className="text-5xl font-bold text-[#FFA500] mb-3">
                    <AnimatedCounter value={4.8} decimals={1} />/5
                  </div>
                  <p className="text-white font-bold mb-2">User satisfaction</p>
                  <p className="text-sm">Post-launch surveys showed an average rating of 4.8/5 for the new booking experience.</p>
                </div>
              </div>

              <motion.div 
                className="bg-[#121217] border border-white/5 rounded-2xl p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-[#FF8C42] font-bold mb-4 text-[20px]">Lessons Learned</h3>
                <div className="space-y-4 text-[18px] leading-relaxed">
                  <p>
                    This project reinforced the importance of <span className="text-white font-semibold">mobile-first design</span> for service-based businesses. The data showed that most users make booking decisions spontaneously, often on the go.
                  </p>
                  <p>
                    Additionally, we learned that <span className="text-white font-semibold">visual identity consistency</span> between physical and digital experiences is crucial for building trust. When the website finally matched the studio's warm, welcoming atmosphere, conversion rates improved dramatically.
                  </p>
                  <p>
                    The community features, while initially a "nice to have," became one of the most-used aspects of the platform, driving both engagement and retention.
                  </p>
                </div>
              </motion.div>
            </motion.section>

          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-white/10">
             <Link 
               to="/works/fintech-dashboard" 
               className="p-3 border border-white/10 rounded-full hover:bg-[#282834] hover:border-transparent transition-all duration-300"
               onMouseEnter={() => setHideCursor(true)}
               onMouseLeave={() => setHideCursor(false)}
             >
               <ArrowLeft size={20} />
             </Link>
             <Link 
               to="/works/zylker" 
               className="p-3 border border-white/10 rounded-full hover:bg-[#282834] hover:border-transparent transition-all duration-300"
               onMouseEnter={() => setHideCursor(true)}
               onMouseLeave={() => setHideCursor(false)}
             >
               <ArrowRight size={20} />
             </Link>
          </div>

        </div>
      </section>
    </div>
  );
}