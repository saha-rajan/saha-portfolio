import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowDown, ChevronUp, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCursor } from "../contexts/CursorContext";
import { CaseStudyNav } from "../components/CaseStudyNav";
import { InteractiveDotGrid } from "../components/ui/InteractiveDotGrid";

// Use actual screenshots as requested by the user
import aisleDashboard from "../../assets/aisle_dashboard.png";
import aisleSearch from "../../assets/aisle_search.png";
import aisleResume from "../../assets/aisle_resume.png";
import aisleTrace from "../../assets/aisle_trace.png";
import aisleProblemVideo from "../../assets/aisle_problem.mp4";

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
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProblemVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsEnded(false);
      setHasPlayedOnce(true);
    }
  };

  return (
    <FadeInView delay={0.1} y={30}>
      <motion.div
        onViewportEnter={() => {
          if (!hasPlayedOnce && videoRef.current) {
            videoRef.current.play().catch(() => {});
            setHasPlayedOnce(true);
          }
        }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-center mb-24"
      >
        <div className="w-full rounded-3xl border border-white/10 bg-[#0A0A0C] overflow-hidden">
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            onEnded={() => setIsEnded(true)}
            className="w-full h-auto block"
          />
        </div>

        {/* Small play/replay button below video frame */}
        <div className="mt-4 min-h-[36px] flex items-center justify-center">
          {isEnded && (
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono transition-all duration-300"
            >
              <Play size={12} className="fill-current text-white/90" />
              <span>Replay Video</span>
            </button>
          )}
        </div>
      </motion.div>
    </FadeInView>
  );
}

const AISLE_NAV_SECTIONS = [
  { id: "glance", label: "Overview" },
  { id: "research", label: "Research" },
  { id: "strategy", label: "Strategy" },
  { id: "design", label: "Design" },
  { id: "testing", label: "Testing" },
  { id: "outcome", label: "Outcome" },
];

export function AIsleCaseStudy() {
  const { setHideCursor } = useCursor();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const [scrollTopArrowPosition, setScrollTopArrowPosition] = useState({ x: 0, y: 0 });
  const [prevTopNavPosition, setPrevTopNavPosition] = useState({ x: 0, y: 0 });
  const [nextTopNavPosition, setNextTopNavPosition] = useState({ x: 0, y: 0 });
  const [prevBottomNavPosition, setPrevBottomNavPosition] = useState({ x: 0, y: 0 });
  const [nextBottomNavPosition, setNextBottomNavPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setPrevTopNavPosition({ x: clampedX, y: clampedY });
  };

  const handleNextTopNavMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setNextTopNavPosition({ x: clampedX, y: clampedY });
  };

  const handlePrevBottomNavMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setPrevBottomNavPosition({ x: clampedX, y: clampedY });
  };

  const handleNextBottomNavMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setNextBottomNavPosition({ x: clampedX, y: clampedY });
  };

  const heroParent = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.22 },
    },
  };
  const heroChild = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="min-h-screen font-sans bg-black text-white selection:bg-white selection:text-black">
      <CaseStudyNav sections={AISLE_NAV_SECTIONS} />

      {/* ── SCROLL TO TOP ─────────────── */}
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
          pointerEvents: showScrollTop ? ("auto" as const) : ("none" as const),
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-28 right-8 z-[10000] w-16 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border border-white/15 hover:border-transparent"
        style={{ background: `rgba(20, 20, 25, 0.8)` }}
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

      {/* ══════════════════════════════════════════════════════════════════
          01 — HERO
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <InteractiveDotGrid 
            color="rgba(160, 160, 170, 0.5)"
            dotSize={2.5}
            gap={18}
            interactionRadius={200}
          />
        </div>
        
        <section
          id="hero"
          className="relative z-10 pt-24 md:pt-32 pb-10 md:pb-12 px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto w-full pointer-events-none"
        >
          {/* Make children pointer-events-auto so they can still be interacted with (like buttons) over the canvas */}
          <div className="flex justify-between items-start gap-8 pointer-events-auto">
          <motion.div
            className="flex-1 min-w-0 max-w-[800px]"
            variants={heroParent}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={heroChild} className="mb-6">
              <span
                className="text-[11px] tracking-widest text-white/50 uppercase"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                AIsle — AI knowledge management
              </span>
            </motion.div>

            <motion.h1
              variants={heroChild}
              className="font-sans font-medium mb-8 tracking-tight text-white"
              style={{
                fontSize: "clamp(2.5rem, 4.5vw, 4.2rem)",
                lineHeight: 1.05,
              }}
            >
              Designing the missing layer for multi-agent AI workflows
            </motion.h1>

            <motion.p
              variants={heroChild}
              className="text-[17px] md:text-[19px] leading-relaxed max-w-[640px] text-white/70"
            >
              AIsle is a cross-agent AI file manager that organizes conversations by project, searches knowledge across AI platforms, restores lost context and makes AI contributions traceable.
            </motion.p>

            <motion.div variants={heroChild} className="flex flex-wrap gap-3 mt-10">
              {[
                "PRODUCT DESIGN",
                "2-PERSON TEAM",
                "1 SEMESTER"
              ].map((chip) => (
                <div key={chip} className="px-4 py-1.5 rounded-full border border-white/15 text-[10px] tracking-widest text-white/50 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {chip}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="hidden md:flex gap-3 shrink-0 pt-4">
            <Link
              to="/works/aura"
              data-cursor-hide="true"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-[#282834] hover:border-transparent overflow-hidden"
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
              to="/works/arizona-yoga-studio"
              data-cursor-hide="true"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-[#282834] hover:border-transparent overflow-hidden"
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
    </div>

      {/* ══════════════════════════════════════════════════════════════════
          02 — PROJECT AT A GLANCE
      ══════════════════════════════════════════════════════════════════ */}
      <section id="glance" className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pb-16 md:pb-24">
        <div className="max-w-[1190px] mx-auto border-y border-white/10 py-12 md:py-16">
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
              { label: "ROLE", value: "Product Designer\nConcept & Product Strategy" },
              { label: "TEAM", value: "Saha + Deepika\n2-person team" },
              { label: "TIMELINE", value: "1 semester" },
              { label: "PROJECT", value: "Academic project\nWeb-based prototype" }
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
          03 — THE PROBLEM
      ══════════════════════════════════════════════════════════════════ */}
      <section id="problem" className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pt-24 md:pt-32 pb-16 md:pb-20 bg-[#08080A]">
        <div className="max-w-[1190px] mx-auto">
          <FadeInView>
            <div className="max-w-3xl mb-24">
              <span
                className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-white/40"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                THE PROBLEM
              </span>
              <h2
                className="font-sans font-medium leading-none tracking-tight mb-8 text-white"
                style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
              >
                AI remembers. Workflows don't.
              </h2>
              <p className="text-[18px] md:text-[21px] leading-relaxed font-light text-white/70">
                As work moves between multiple AI tools, conversations remain organized by platform rather than by the project they belong to. The connections between research, decisions and outputs are left for the user to remember.
              </p>
            </div>
          </FadeInView>

          {/* Problem Visualization Video */}
          <ProblemVideoPlayer src={aisleProblemVideo} />

          {/* Three Problem Themes */}
          <div className="border-t border-white/10 pt-16 md:pt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              <FadeInView delay={0.1}>
                <h3 className="text-lg font-medium text-white mb-3">Fragmented work</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Project knowledge is distributed across separate AI platforms.
                </p>
              </FadeInView>
              <FadeInView delay={0.2}>
                <h3 className="text-lg font-medium text-white mb-3">Retrieval friction</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Past reasoning becomes difficult to locate once conversations accumulate.
                </p>
              </FadeInView>
              <FadeInView delay={0.3}>
                <h3 className="text-lg font-medium text-white mb-3">Missing accountability</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  AI-assisted decisions can become difficult to trace back to their source.
                </p>
              </FadeInView>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          05 — RESEARCH
      ══════════════════════════════════════════════════════════════════ */}
      <section id="research" className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pt-24 md:pt-32 pb-16 md:pb-24 border-t border-white/10">
        <div className="max-w-[1190px] mx-auto">
          
          {/* 1. Research intro */}
          <FadeInView>
            <span
              className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-white/40"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              RESEARCH
            </span>
            <h2
              className="font-sans font-medium leading-none tracking-tight mb-4 text-white max-w-4xl"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
            >
              The problem wasn’t using multiple AI tools. It was maintaining continuity between them.
            </h2>
            <p className="text-[12px] text-white/40 font-mono tracking-wide mb-16 md:mb-24 uppercase">
              Research led by Deepika · Product synthesis and direction by Saha · Collaborative evaluation
            </p>
          </FadeInView>

          {/* 2. Research approach */}
          <FadeInView y={20}>
            <div className="mb-16 md:mb-24">
              <span className="block mb-6 text-[10px] tracking-widest uppercase text-[#7FAF9B] font-mono">
                How we investigated the workflow.
              </span>
              <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 border-y border-white/10 py-6 md:py-8 overflow-x-auto">
                {["01 Personas", "02 Interview protocol", "03 External interviews", "04 Affinity mapping", "05 POV / HMW synthesis"].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-3 md:gap-4 shrink-0">
                    <span className="text-[12px] md:text-[13px] text-white/60 font-mono">
                      <span className="text-[#7FAF9B] mr-1.5">{step.split(' ')[0]}</span>
                      {step.substring(3)}
                    </span>
                    {i < arr.length - 1 && <ArrowRight size={14} className="text-white/10" />}
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>

          {/* 3. Who we designed for */}
          <FadeInView y={20}>
            <div className="mb-16 md:mb-24">
              <span className="block mb-6 text-[10px] tracking-widest uppercase text-[#7FAF9B] font-mono">
                WORKFLOW PERSONAS
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-white/10 py-8">
                <div>
                  <h4 className="text-[15px] text-white font-medium mb-1">Marcus</h4>
                  <span className="block text-[11px] font-mono text-[#7FAF9B] uppercase mb-4">UX Researcher</span>
                  <p className="text-[13px] text-white/60 leading-relaxed border-l border-white/10 pl-3">
                    Needs to trace insights generated by AI back to their source files and prompts.
                  </p>
                </div>
                <div>
                  <h4 className="text-[15px] text-white font-medium mb-1">Alex</h4>
                  <span className="block text-[11px] font-mono text-[#7FAF9B] uppercase mb-4">Startup Founder</span>
                  <p className="text-[13px] text-white/60 leading-relaxed border-l border-white/10 pl-3">
                    Uses multiple AI agents for product decisions and requires continuity across conversations.
                  </p>
                </div>
                <div>
                  <h4 className="text-[15px] text-white font-medium mb-1">Priya</h4>
                  <span className="block text-[11px] font-mono text-[#7FAF9B] uppercase mb-4">Graduate Researcher</span>
                  <p className="text-[13px] text-white/60 leading-relaxed border-l border-white/10 pl-3">
                    Struggles to retrieve previous reasoning from long, fragmented AI chat histories.
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 4. Questions & Evidence (Merged) */}
          <FadeInView y={20}>
            <div className="mb-12 md:mb-20">
              <span className="block mb-6 text-[10px] tracking-widest uppercase text-[#7FAF9B] font-mono">
                Evidence mapping
              </span>
              <div className="flex flex-col gap-4 md:gap-6 border-t border-white/10 pt-8">
                
                {/* Evidence 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white/[0.01] border border-white/5 rounded-xl p-5 md:p-6 items-start">
                  <div>
                    <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">Question</span>
                    <p className="text-[14px] md:text-[15px] text-white/80 leading-relaxed font-medium">
                      "Walk us through a complex project using multiple AI tools."
                    </p>
                  </div>
                  <div className="md:border-l border-white/10 md:pl-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase mb-3">Observation · P1 (Startup Founder)</span>
                    <p className="text-[13px] md:text-[14px] text-white/60 leading-relaxed">
                      Described relying on manual workarounds to mentally maintain the relationships between separate platforms.
                    </p>
                  </div>
                </div>

                {/* Evidence 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white/[0.01] border border-white/5 rounded-xl p-5 md:p-6 items-start">
                  <div>
                    <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">Question</span>
                    <p className="text-[14px] md:text-[15px] text-white/80 leading-relaxed font-medium">
                      "How do you retrieve something discussed with AI weeks earlier?"
                    </p>
                  </div>
                  <div className="md:border-l border-white/10 md:pl-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase mb-3">Observation · P2 (Product Manager)</span>
                    <p className="text-[13px] md:text-[14px] text-white/60 leading-relaxed">
                      Noted that re-prompting became necessary when previous AI-generated reasoning became difficult to locate.
                    </p>
                  </div>
                </div>

                {/* Evidence 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white/[0.01] border border-white/5 rounded-xl p-5 md:p-6 items-start">
                  <div>
                    <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">Question</span>
                    <p className="text-[14px] md:text-[15px] text-white/80 leading-relaxed font-medium">
                      "How do you trace back and explain an AI-assisted decision?"
                    </p>
                  </div>
                  <div className="md:border-l border-white/10 md:pl-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase mb-3">Observation · P3 (Student)</span>
                    <p className="text-[13px] md:text-[14px] text-white/60 leading-relaxed">
                      Expressed difficulty tracing AI-assisted work back to the original tool or conversation that contributed to it.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </FadeInView>

          {/* 6. Research Synthesis */}
          <FadeInView y={30} className="flex flex-col items-center mb-12 md:mb-20">
            <div className="w-full md:w-[75%] mb-6">
              <div className="h-48 md:h-64 w-full bg-[#121215] border border-white/10 rounded-xl flex flex-col items-center justify-center overflow-hidden relative group">
                 <img src="aisle_research_artifact.png" alt="Research Synthesis artifact" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                 <div className="z-10 flex flex-col items-center justify-center text-center p-6 bg-black/40 backdrop-blur-sm rounded-lg border border-white/5">
                   <span className="text-white/30 text-[10px] font-mono mb-2 uppercase">Placeholder</span>
                   <span className="text-white/50 font-mono text-xs">aisle_research_artifact.png</span>
                 </div>
              </div>
              <div className="mt-6 flex flex-col items-center text-center">
                <p className="text-[13px] font-mono text-white/50 max-w-md leading-relaxed uppercase">
                  Affinity mapping consolidated recurring workflow tensions into three themes.
                </p>
                <span className="block mt-8 text-[11px] font-mono text-[#7FAF9B] tracking-widest uppercase">
                  SYNTHESIS → THREE RECURRING TENSIONS
                </span>
              </div>
            </div>
          </FadeInView>

          {/* 7. Three Research Insights */}
          <div className="w-full">
            <div className="max-w-3xl mx-auto flex flex-col gap-12 md:gap-20">
              
              {/* Finding 01 */}
              <FadeInView y={20}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-white/10 pt-8">
                  <div className="w-full md:w-1/3">
                    <span className="text-[13px] md:text-[14px] font-mono text-[#7FAF9B] uppercase block">01 / FRAGMENTATION</span>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 leading-tight">
                      Work followed the tool.<br/>People thought in projects.
                    </h3>
                    <p className="text-[16px] text-white/60 leading-relaxed mb-6">
                      AI conversations and project knowledge were distributed across separate platforms, leaving users to mentally maintain the relationships between them.
                    </p>
                    <div className="bg-[#7FAF9B]/10 border border-[#7FAF9B]/20 rounded p-3 inline-block">
                      <span className="text-[11px] font-mono text-[#7FAF9B] tracking-widest">MULTIPLE TOOLS → MANUAL TRACKING → FRAGMENTED CONTEXT</span>
                    </div>
                  </div>
                </div>
              </FadeInView>

              {/* Finding 02 */}
              <FadeInView y={20}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-white/10 pt-8">
                  <div className="w-full md:w-1/3">
                    <span className="text-[13px] md:text-[14px] font-mono text-[#7FAF9B] uppercase block">02 / RETRIEVAL</span>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 leading-tight">
                      Finding previous reasoning became a task of its own.
                    </h3>
                    <p className="text-[16px] text-white/60 leading-relaxed mb-6">
                      Participants described manual workarounds and re-prompting when previous AI-generated information became difficult to locate.
                    </p>
                    <div className="bg-[#7FAF9B]/10 border border-[#7FAF9B]/20 rounded p-3 inline-block">
                      <span className="text-[11px] font-mono text-[#7FAF9B] tracking-widest">SEARCH → SCROLL → CHECK NOTES → RE-PROMPT</span>
                    </div>
                  </div>
                </div>
              </FadeInView>

              {/* Finding 03 */}
              <FadeInView y={20}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-white/10 pt-8">
                  <div className="w-full md:w-1/3">
                    <span className="text-[13px] md:text-[14px] font-mono text-[#7FAF9B] uppercase block">03 / ACCOUNTABILITY</span>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 leading-tight">
                      The output remained.<br/>Its origin became harder to trace.
                    </h3>
                    <p className="text-[16px] text-white/60 leading-relaxed mb-6">
                      Participants expressed difficulty tracing AI-assisted work back to the tool or conversation that contributed to it.
                    </p>
                    <div className="bg-[#7FAF9B]/10 border border-[#7FAF9B]/20 rounded p-3 inline-block">
                      <span className="text-[11px] font-mono text-[#7FAF9B] tracking-widest">OUTPUT ≠ TRACEABLE PROCESS</span>
                    </div>
                  </div>
                </div>
              </FadeInView>
              
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          RESEARCH SYNTHESIS TRANSITION (Opportunity Reframe)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pt-16 md:pt-24 pb-16 md:pb-24 text-center border-t border-white/10">
        <FadeInView>
          <span className="block mb-8 text-[11px] tracking-widest uppercase text-[#7FAF9B] font-mono">
            OPPORTUNITY
          </span>
          <h2 className="font-sans font-medium leading-tight text-white mx-auto max-w-4xl mb-0" style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)", letterSpacing: "-0.02em" }}>
            The problem wasn’t choosing the right AI.<br/>
            <span className="text-white/40">It was reconnecting the work happening between them.</span>
          </h2>
        </FadeInView>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          06 — DESIGN PRINCIPLE
      ══════════════════════════════════════════════════════════════════ */}
      <section id="strategy" className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pt-16 md:pt-24 pb-16 md:pb-24 border-t border-white/10">
        <div className="max-w-[1190px] mx-auto">
          <FadeInView>
            <div className="text-center mb-20">
              <span
                className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-[#7FAF9B] font-mono"
              >
                DESIGN PRINCIPLE
              </span>
              <h2
                className="font-sans font-medium leading-none tracking-tight mb-8 text-white mx-auto max-w-4xl"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.04em" }}
              >
                Don’t build another AI tool.<br/>Build the layer between them.
              </h2>
            </div>
          </FadeInView>

          {/* Conceptual Comparison */}
          <FadeInView delay={0.2} y={30}>
            <div className="w-full rounded-3xl border border-white/10 bg-[#0A0A0C] overflow-hidden flex flex-col lg:flex-row relative">
              
              {/* Left: Platform-centric */}
              <div className="flex-1 p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center">
                <span className="text-[11px] tracking-widest uppercase font-mono text-white/40 mb-12">BEFORE / PLATFORM-CENTRIC</span>
                
                <div className="flex justify-center gap-6 mb-12 w-full">
                  {["ChatGPT", "Claude", "Perplexity"].map((platform) => (
                    <div key={platform} className="flex flex-col items-center gap-4">
                      <div className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/50">{platform}</div>
                      <div className="flex flex-col gap-2 items-center">
                        <div className="w-px h-6 bg-white/10" />
                        <div className="w-8 h-px bg-[#FF6B50]/30" />
                        <div className="w-px h-6 bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex flex-col items-center text-center">
                  <p className="text-[13px] text-white/50 mb-1">Separate platforms</p>
                  <p className="text-[13px] text-white/50 mb-1">Separate histories</p>
                  <p className="text-[13px] text-[#FF6B50]/70">Connections maintained mentally</p>
                </div>
              </div>

              {/* Center: Directional Transition */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#121215] border border-white/10 items-center justify-center z-10">
                <ArrowRight size={16} className="text-white/40" />
              </div>

              {/* Right: Project-centric */}
              <div className="flex-1 p-10 md:p-16 bg-[#7FAF9B]/5 flex flex-col items-center relative">
                <span className="text-[11px] tracking-widest uppercase font-mono text-[#7FAF9B] mb-12">AFTER / PROJECT-CENTRIC</span>
                
                <div className="flex flex-col items-center mb-12 w-full">
                  <div className="flex justify-center gap-10 mb-8 w-full relative">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-[10px] font-mono text-[#7FAF9B]/60">ChatGPT</span>
                      <ArrowRight size={14} className="text-[#7FAF9B]/40 rotate-45 translate-x-2" />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-[10px] font-mono text-[#7FAF9B]/60">Claude</span>
                      <ArrowDown size={14} className="text-[#7FAF9B]/40" />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-[10px] font-mono text-[#7FAF9B]/60">Perplexity</span>
                      <ArrowLeft size={14} className="text-[#7FAF9B]/40 -rotate-45 -translate-x-2" />
                    </div>
                  </div>
                  
                  <div className="px-8 py-3 rounded-xl border border-[#7FAF9B]/30 bg-[#7FAF9B]/10 text-[12px] font-mono text-[#7FAF9B] tracking-widest uppercase shadow-[0_0_20px_rgba(127,175,155,0.1)]">
                    PROJECT
                  </div>
                </div>

                <div className="mt-auto flex flex-col items-center text-center">
                  <p className="text-[13px] text-[#7FAF9B]/80 mb-1">One project layer</p>
                  <p className="text-[13px] text-[#7FAF9B]/80 mb-1">Multiple contributing agents</p>
                  <p className="text-[13px] text-[#7FAF9B]/80">Shared context</p>
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          07 — KEY PRODUCT EXPERIENCES (Linear Walkthrough)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="design" className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pt-20 md:pt-28 pb-16 md:pb-24 border-t border-white/10">
        <div className="max-w-[1190px] mx-auto">
          <FadeInView>
            <span
              className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-white/40"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              KEY PRODUCT EXPERIENCES
            </span>
            <h2
              className="font-sans font-medium leading-none tracking-tight mb-16 md:mb-20 text-white max-w-4xl"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
            >
              Designing continuity across the AI workflow.
            </h2>
          </FadeInView>

          {/* ── 01 / ORGANIZE ─────────────────────────────────────────────── */}
          <FadeInView y={40}>
            <div className="mb-20 md:mb-28">
              {/* Headline & Intro */}
              <div className="max-w-3xl mb-16 md:mb-20">
                <span className="block mb-4 text-[10px] tracking-widest uppercase text-[#7FAF9B] font-mono">
                  01 / ORGANIZE
                </span>
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-6">
                  The project became the primary unit of organization.
                </h3>
                <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed">
                  Instead of organizing work around individual AI platforms, AIsle groups conversations around the project they contribute to — keeping related work visible even when multiple agents are involved.
                </p>
              </div>

              {/* Problem Block */}
              <div className="mb-12 border-l-2 border-white/10 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">PROBLEM</span>
                <p className="text-[15px] md:text-[16px] text-white/80 leading-relaxed mb-4 max-w-2xl">
                  AI conversations lived inside separate platforms, while users mentally organized the work around projects.
                </p>
                <span className="block text-[11px] font-mono text-[#FF6B50]/70 uppercase tracking-widest">
                  PLATFORM-CENTRIC HISTORY → MANUAL CONNECTIONS → FRAGMENTED PROJECT CONTEXT
                </span>
              </div>

              {/* Design Decision Block */}
              <div className="mb-16 md:mb-20 border-l-2 border-[#7FAF9B]/40 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest mb-3">DESIGN DECISION</span>
                <h4 className="text-[18px] md:text-[20px] font-medium text-white mb-3">
                  Make the project the container. Make the AI agent metadata.
                </h4>
                <p className="text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-2xl">
                  Projects define where work belongs. Agent labels show which AI contributed without determining where the work is stored.
                </p>
              </div>

              {/* Full Dashboard Screenshot */}
              <div className="rounded-[16px] overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0C] mb-12 md:-mx-4 lg:-mx-8">
                <img src={aisleDashboard} alt="AIsle Dashboard" className="w-full h-auto object-cover block" />
              </div>

              {/* What the Dashboard Does */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 border-t border-white/10 py-12 md:py-16">
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">01 / PROJECT FIRST</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Projects become the primary organizing object.<br/><br/>Conversations group by the project they contribute to rather than the AI platform that handled them.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">02 / AGENTS AS METADATA</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Agents identify who contributed without fragmenting the project.<br/><br/>ChatGPT, Claude, Perplexity and other agents remain labels — not containers.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">03 / CONTINUITY</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Project state keeps work connected across sessions.<br/><br/>Conversation counts, progress and Resume actions preserve the state of ongoing work.
                  </p>
                </div>
              </div>

              {/* Design Logic */}
              <div className="py-12 border-y border-white/5 mb-16 md:mb-24 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest">
                  DESIGN LOGIC
                </span>
                <p className="text-[16px] md:text-[18px] font-medium text-white/90 leading-snug">
                  One project.<br/>
                  Multiple contributing agents.<br/>
                  One continuous workspace.
                </p>
              </div>

              {/* Transition */}
              <div className="pt-8 md:pt-12">
                <p className="text-[15px] md:text-[16px] text-white/50 leading-relaxed max-w-xl">
                  Organizing work by project solved where information lived.
                  <br />
                  <span className="text-white/80">But how do you find one piece of reasoning across all of it?</span>
                </p>
              </div>
            </div>
          </FadeInView>

          {/* ── 02 / RETRIEVE ─────────────────────────────────────────────── */}
          <FadeInView y={40}>
            <div className="mb-20 md:mb-28">
              {/* Headline & Intro */}
              <div className="max-w-3xl mb-16 md:mb-20">
                <span className="block mb-4 text-[10px] tracking-widest uppercase text-[#7FAF9B] font-mono">
                  02 / RETRIEVE
                </span>
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-6">
                  Search across the work, not the tool.
                </h3>
                <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed">
                  AIsle lets users search across connected AI conversation histories instead of remembering which platform contained the information.
                </p>
              </div>

              {/* Problem Block */}
              <div className="mb-12 border-l-2 border-white/10 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">PROBLEM</span>
                <p className="text-[15px] md:text-[16px] text-white/80 leading-relaxed mb-4 max-w-2xl">
                  Previous reasoning was buried across separate conversations and platforms, forcing users to remember where something was discussed or reconstruct it through re-prompting.
                </p>
                <span className="block text-[11px] font-mono text-[#FF6B50]/70 uppercase tracking-widest">
                  SEARCH → SCROLL → CHECK NOTES → RE-PROMPT
                </span>
              </div>

              {/* Design Decision Block */}
              <div className="mb-12 md:mb-16 border-l-2 border-[#7FAF9B]/40 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest mb-3">DESIGN DECISION</span>
                <h4 className="text-[18px] md:text-[20px] font-medium text-white mb-3">
                  Search across conversations. Preserve where every result came from.
                </h4>
                <p className="text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-2xl">
                  A unified retrieval layer searches connected AI histories while keeping the originating agent and conversation attached to each result.
                </p>
              </div>

              {/* Full Dashboard Screenshot */}
              <div className="rounded-[16px] overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0C] mb-12 md:-mx-4 lg:-mx-8">
                <img src={aisleSearch} alt="AIsle Search" className="w-full h-auto object-cover block" />
              </div>

              {/* What the Dashboard Does */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 border-t border-white/10 py-12 md:py-16">
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">01 / ASK</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Search by intent, not location.<br/><br/>Describe what you are trying to recover instead of remembering which tool or conversation contained it.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">02 / SEARCH ACROSS AGENTS</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    One query across connected histories.<br/><br/>Agent filters narrow the search without forcing users back into separate platform histories.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">03 / RETURN TO SOURCE</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Retrieval should preserve provenance.<br/><br/>Each result reconnects users to the original conversation and contributing agent.
                  </p>
                </div>
              </div>

              {/* Design Logic */}
              <div className="py-12 border-y border-white/5 mb-16 md:mb-24 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest">
                  DESIGN LOGIC
                </span>
                <p className="text-[16px] md:text-[18px] font-medium text-white/90 leading-snug">
                  One query.<br/>
                  Multiple conversation histories.<br/>
                  Every result connected to its source.
                </p>
              </div>

              {/* Transition */}
              <div className="pt-8 md:pt-12">
                <p className="text-[15px] md:text-[16px] text-white/50 leading-relaxed max-w-xl">
                  Finding past work solved retrieval.
                  <br />
                  <span className="text-white/80">But returning after an interruption still meant rebuilding the context.</span>
                </p>
              </div>
            </div>
          </FadeInView>

          {/* ── 03 / RESUME ───────────────────────────────────────────────── */}
          <FadeInView y={40}>
            <div className="mb-20 md:mb-28">
              {/* Headline & Intro */}
              <div className="max-w-3xl mb-16 md:mb-20">
                <span className="block mb-4 text-[10px] tracking-widest uppercase text-[#7FAF9B] font-mono">
                  03 / RESUME
                </span>
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-6">
                  Returning to work shouldn’t mean rebuilding the context.
                </h3>
                <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed">
                  AIsle restores the project state around previous conversations, decisions and notes so users can continue from where the work stopped instead of reconstructing it manually.
                </p>
              </div>

              {/* Problem Block */}
              <div className="mb-12 border-l-2 border-white/10 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">PROBLEM</span>
                <p className="text-[15px] md:text-[16px] text-white/80 leading-relaxed mb-4 max-w-2xl">
                  After time away from a project, users had to reconstruct what happened, which conversations mattered and where the work had stopped.
                </p>
                <span className="block text-[11px] font-mono text-[#FF6B50]/70 uppercase tracking-widest">
                  LEAVE PROJECT → TIME PASSES → RECALL → REBUILD CONTEXT
                </span>
              </div>

              {/* Design Decision Block */}
              <div className="mb-12 md:mb-16 border-l-2 border-[#7FAF9B]/40 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest mb-3">DESIGN DECISION</span>
                <h4 className="text-[18px] md:text-[20px] font-medium text-white mb-3">
                  Restore the working context, not just the conversation history.
                </h4>
                <p className="text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-2xl">
                  Resume Project brings the relevant project state, conversations, decisions and working memory back together for re-entry.
                </p>
              </div>

              {/* Full Dashboard Screenshot */}
              <div className="rounded-[16px] overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0C] mb-12 md:-mx-4 lg:-mx-8">
                <img src={aisleResume} alt="AIsle Context Recovery" className="w-full h-auto object-cover block" />
              </div>

              {/* What the Dashboard Does */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 border-t border-white/10 py-12 md:py-16">
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">01 / PROJECT STATE</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Know where the work stopped.<br/><br/>Last-active information and progress establish the current state of the project.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">02 / ACTIVE CONVERSATIONS</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Bring the relevant conversations forward.<br/><br/>Conversations remain attached to the project rather than requiring users to relocate them across individual AI platforms.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">03 / DECISION CHAIN</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Reconnect the sequence of previous work.<br/><br/>Past work is presented as a connected progression rather than isolated conversation histories.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">04 / WORKING MEMORY</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Preserve what supports re-entry.<br/><br/>Notes, highlighted insights and recent activity provide additional context for continuing the project.
                  </p>
                </div>
              </div>

              {/* Design Logic */}
              <div className="py-12 border-y border-white/5 mb-16 md:mb-24 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest">
                  DESIGN LOGIC
                </span>
                <p className="text-[16px] md:text-[18px] font-medium text-white/90 leading-snug">
                  One project state.<br/>
                  Relevant work brought forward.<br/>
                  A clear point to continue from.
                </p>
              </div>

              {/* Transition */}
              <div className="pt-8 md:pt-12">
                <p className="text-[15px] md:text-[16px] text-white/50 leading-relaxed max-w-xl">
                  Context Recovery preserved what happened.
                  <br />
                  <span className="text-white/80">The remaining question was where the work came from.</span>
                </p>
              </div>
            </div>
          </FadeInView>

          {/* ── 04 / TRACE ────────────────────────────────────────────────── */}
          <FadeInView y={40}>
            <div>
              {/* Headline & Intro */}
              <div className="max-w-3xl mb-16 md:mb-20">
                <span className="block mb-4 text-[10px] tracking-widest uppercase text-[#7FAF9B] font-mono">
                  04 / TRACE
                </span>
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-6">
                  Make AI contribution visible.
                </h3>
                <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed">
                  AIsle keeps AI contributions connected to project outputs so users can inspect which agents contributed to the work and trace those contributions back through the project.
                </p>
              </div>

              {/* Problem Block */}
              <div className="mb-12 border-l-2 border-white/10 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">PROBLEM</span>
                <p className="text-[15px] md:text-[16px] text-white/80 leading-relaxed mb-4 max-w-2xl">
                  As outputs moved through multiple AI conversations, the final work could remain visible while the source of individual contributions became harder to trace.
                </p>
                <span className="block text-[11px] font-mono text-[#FF6B50]/70 uppercase tracking-widest">
                  MULTIPLE AGENTS → CONTRIBUTIONS → PROJECT OUTPUT → LOST PROVENANCE
                </span>
              </div>

              {/* Design Decision Block */}
              <div className="mb-12 md:mb-16 border-l-2 border-[#7FAF9B]/40 pl-6 md:pl-8 py-2">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest mb-3">DESIGN DECISION</span>
                <h4 className="text-[18px] md:text-[20px] font-medium text-white mb-3">
                  Keep contribution history attached to the work.
                </h4>
                <p className="text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-2xl">
                  The Audit Trail connects project outputs with their contributing AI agents so provenance remains visible after the work has been synthesized.
                </p>
              </div>

              {/* Full Dashboard Screenshot */}
              <div className="rounded-[16px] overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0C] mb-12 md:-mx-4 lg:-mx-8">
                <img src={aisleTrace} alt="AIsle Audit Trail" className="w-full h-auto object-cover block" />
              </div>

              {/* What the Dashboard Does */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 border-t border-white/10 py-12 md:py-16">
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">01 / CONTRIBUTION DISTRIBUTION</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    See participation across the project.<br/><br/>The interface surfaces which connected AI agents contributed to the selected project.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">02 / AUDIT RECORD</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Reconnect outputs to their contribution history.<br/><br/>Contribution records retain the agent, topic and associated project output for later inspection.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-white/30 uppercase mb-3">03 / REPORT</span>
                  <p className="text-[14px] text-white/60 leading-relaxed">
                    Carry provenance beyond the interface.<br/><br/>Contribution records can be exported into a structured report. PDF, APA citation and CSV formats are prototype capabilities only.
                  </p>
                </div>
              </div>

              {/* Design Logic */}
              <div className="py-12 border-y border-white/5 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                <span className="block text-[10px] font-mono text-[#7FAF9B] uppercase tracking-widest">
                  DESIGN LOGIC
                </span>
                <p className="text-[16px] md:text-[18px] font-medium text-white/90 leading-snug">
                  One project output.<br/>
                  Visible contributing agents.<br/>
                  A traceable record of the work.
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

{/* ══════════════════════════════════════════════════════════════════
          09 — TESTING & ITERATION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="testing" className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto py-16 md:py-24 bg-[#08080A]">
        <div className="max-w-[1190px] mx-auto">
          <FadeInView>
            <div className="max-w-3xl mb-20">
              <span
                className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-[#FF6B50]/70"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                TESTING & ITERATION
              </span>
              <h2
                className="font-sans font-medium leading-none tracking-tight text-white"
                style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
              >
                When minimalism started hurting usability.
              </h2>
            </div>
          </FadeInView>

          <div className="flex flex-col gap-16 md:gap-24 border-t border-white/10 pt-16">
            {[
              {
                num: "01",
                insight: "Platform treatments were too visually similar.",
                principle: "Recognition should not depend on color alone.",
                change: "Use differentiated platform color, icon and text labels together."
              },
              {
                num: "02",
                insight: "Resume Project introduced an unfamiliar system action.",
                principle: "Novel interactions require stronger visibility of system status.",
                change: "Add immediate button feedback, restoration progress and completion confirmation."
              },
              {
                num: "03",
                insight: "Search results required too much interpretation.",
                principle: "Retrieval interfaces should explain relevance at a glance.",
                change: "Introduce highlighted matches, relevance indicators and persistent filter states."
              },
              {
                num: "04",
                insight: "Conversation detail behaved like a panel but lacked an obvious escape path.",
                principle: "Navigation should match familiar interaction expectations.",
                change: "Add explicit Back to Project behavior, breadcrumb context and click-outside support."
              }
            ].map((story, idx) => (
              <FadeInView key={idx} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border border-white/10 rounded-2xl bg-white/[0.02] p-8 md:p-12">
                  <div className="md:col-span-12 mb-4">
                    <span className="text-[11px] font-mono text-white/30 tracking-widest">TESTING INSIGHT {story.num}</span>
                  </div>
                  
                  <div className="md:col-span-4">
                    <span className="block text-[10px] tracking-widest uppercase text-white/40 font-mono mb-2">Insight</span>
                    <p className="text-white/80">{story.insight}</p>
                  </div>
                  <div className="md:col-span-4">
                    <span className="block text-[10px] tracking-widest uppercase text-[#FF6B50]/70 font-mono mb-2">Design Principle</span>
                    <p className="text-white/80">{story.principle}</p>
                  </div>
                  <div className="md:col-span-4">
                    <span className="block text-[10px] tracking-widest uppercase text-white/40 font-mono mb-2">Design Change</span>
                    <p className="text-[#FF6B50]">{story.change}</p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          11 — OUTCOME
      ══════════════════════════════════════════════════════════════════ */}
      <section id="outcome" className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto py-16 md:py-24 border-t border-white/10">
        <div className="max-w-[1190px] mx-auto">
          <FadeInView>
            <div className="max-w-3xl mb-20 md:mb-24">
              <span
                className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-white/40"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                OUTCOME
              </span>
              <h2
                className="font-sans font-medium leading-none tracking-tight mb-8 text-white"
                style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
              >
                The concept was validated.<br />The larger questions remain open.
              </h2>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <FadeInView>
              <h3 className="text-xl font-medium text-white mb-6">What the prototype established</h3>
              <ul className="flex flex-col gap-4 text-white/60">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] mt-2 shrink-0" />
                  <span>Comprehension of the project-centric organization model</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] mt-2 shrink-0" />
                  <span>Perceived value of cross-agent search</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] mt-2 shrink-0" />
                  <span>Perceived value of Context Recovery</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] mt-2 shrink-0" />
                  <span>The need for clearer system feedback and platform recognition</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] mt-2 shrink-0" />
                  <span>The importance of traceability and accountability in AI-assisted workflows</span>
                </li>
              </ul>
            </FadeInView>

            <FadeInView delay={0.2}>
              <div className="p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">What still needs validation</h3>
                <p className="text-white/60 mb-6 text-sm leading-relaxed">
                  A larger 24-participant mixed-methods study has been proposed to evaluate the following future research hypotheses:
                </p>
                <ul className="flex flex-col gap-3 text-white/50 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-white/30" />
                    <span>Retrieval performance over large datasets</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-white/30" />
                    <span>Impact on re-prompting behavior</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-white/30" />
                    <span>Changes in cognitive load during task switching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-white/30" />
                    <span>User trust in AI contribution reports</span>
                  </li>
                </ul>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          12 — REFLECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto py-16 md:py-24 border-t border-white/10 bg-[#08080A]">
        <div className="max-w-[1190px] mx-auto">
          <FadeInView>
            <div className="max-w-4xl mb-24">
              <span
                className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase text-white/40"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                REFLECTION
              </span>
              <h2
                className="font-sans font-medium leading-none tracking-tight text-white"
                style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)", letterSpacing: "-0.04em" }}
              >
                The interface wasn’t the hardest part. Designing the layer between tools was.
              </h2>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24">
            <FadeInView delay={0.1}>
              <h3 className="text-lg font-medium text-white mb-4">Enhance, don’t replace</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                The meta-layer approach preserves familiar AI workflows. Rather than asking users to migrate to a new ecosystem, the design enhances the tools they already trust.
              </p>
            </FadeInView>
            <FadeInView delay={0.2}>
              <h3 className="text-lg font-medium text-white mb-4">Functional clarity over aesthetic restraint</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                A minimal visual treatment only works when users can still quickly distinguish agents, states, and actions. We learned that aggressive minimalism can obscure necessary system feedback.
              </p>
            </FadeInView>
            <FadeInView delay={0.3}>
              <h3 className="text-lg font-medium text-white mb-4">Novel interactions need explicit feedback</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Actions like restoring project context do not yet have universally understood interaction conventions. This makes explicit system-status feedback especially critical.
              </p>
            </FadeInView>
          </div>

          <FadeInView delay={0.4}>
            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <span className="block mb-4 text-[10px] tracking-widest uppercase text-white/40 font-mono">
                Limitations & Future Direction
              </span>
              <div className="flex flex-wrap gap-3">
                {["Dependency on platform/API availability", "Broader synchronization support", "Collaboration possibilities", "Automatic conversation linking", "Additional workflow integrations"].map((tag, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/50 bg-black">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          13 — BOTTOM NAVIGATION (Footer System)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pb-12 px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto">
        <div className="max-w-[1190px] mx-auto">
          <div
            className="flex justify-end gap-4 mt-8 pt-6"
            style={{ borderTop: `1px solid rgba(255, 255, 255, 0.1)` }}
          >
            <Link
              to="/works/aura"
              data-cursor-hide="true"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-[#282834] hover:border-transparent overflow-hidden"
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
              to="/works/arizona-yoga-studio"
              data-cursor-hide="true"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-[#282834] hover:border-transparent overflow-hidden"
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
