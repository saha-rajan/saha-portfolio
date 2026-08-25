import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface NavSection {
  id: string;
  label: string;
}

export interface CaseStudyNavProps {
  metaText?: string;
  sections: NavSection[];
  activeColorClass?: string;
  activeBgClass?: string;
  progressBarColor?: string;
  progressBarGradient?: string;
  progressBarStyle?: React.CSSProperties;
  headGlowColor?: string;
  contentId?: string;
  containerMaxWidth?: string;
}

export function CaseStudyNav({
  metaText = "CASE STUDY",
  sections,
  activeColorClass = "text-white",
  activeBgClass = "bg-white/5",
  progressBarColor = "bg-white",
  progressBarGradient,
  progressBarStyle,
  headGlowColor,
  contentId = "case-study-content",
  containerMaxWidth = "max-w-[1440px]",
}: CaseStudyNavProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "overview");
  const [progress, setProgress] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [globalNavVisible, setGlobalNavVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Match global header visibility logic
          if (currentScrollY < lastScrollY || currentScrollY < 10) {
            setGlobalNavVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setGlobalNavVisible(false);
          }
          lastScrollY = currentScrollY;

          // Only show nav when reaching content (past hero)
          const firstElement = document.getElementById(sections[0]?.id || "overview");
          if (firstElement) {
            setIsPastHero(currentScrollY > firstElement.offsetTop - window.innerHeight / 2);
          }

          // Progress calculation
          const container = document.getElementById(contentId);
          if (container) {
            const rect = container.getBoundingClientRect();
            const totalHeight = container.offsetHeight - window.innerHeight;
            const currentScroll = -rect.top;

            if (currentScroll < 0) setProgress(0);
            else if (currentScroll > totalHeight) setProgress(100);
            else setProgress((currentScroll / totalHeight) * 100);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, contentId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    setIsMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const activeLabel = sections[activeIndex]?.label || sections[0]?.label || "Overview";
  const totalSections = sections.length;
  const formattedIndex = activeIndex >= 0 ? (activeIndex + 1).toString().padStart(2, "0") : "01";
  const formattedTotal = totalSections.toString().padStart(2, "0");
  const indexDisplay = `${formattedIndex}/${formattedTotal}`;

  const offsetY = globalNavVisible ? 98 : 0;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{
        opacity: isPastHero ? 1 : 0,
        y: isPastHero ? offsetY : -100,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-40 w-full bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between px-6 md:px-12 pointer-events-auto ${
        !isPastHero ? "pointer-events-none" : ""
      }`}
    >
      <div className={`flex items-center gap-12 w-full ${containerMaxWidth} mx-auto relative`}>
        <span className="case-meta text-[10px] text-white/50 tracking-widest hidden md:block">
          {metaText}
        </span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={`text-sm font-sans transition-colors ${
                activeSection === section.id ? activeColorClass : "text-[#A7A7A7] hover:text-white"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center justify-between w-full relative">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex items-center gap-2 text-sm text-[#A7A7A7]"
          >
            <span className="text-white transition-colors">{activeLabel}</span>
            <span className="opacity-50">· {indexDisplay}</span>
            {isMobileOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-10 left-0 w-48 bg-[#121217] border border-white/10 rounded-lg shadow-2xl py-2 flex flex-col z-50"
              >
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleClick(section.id)}
                    className={`text-left px-4 py-2 text-sm font-sans transition-colors ${
                      activeSection === section.id
                        ? `${activeColorClass} ${activeBgClass}`
                        : "text-[#A7A7A7] hover:bg-white/[0.02] hover:text-white"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5 pointer-events-none">
        <motion.div
          className="h-full relative overflow-visible"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        >
          {progressBarGradient ? (
            <div className="h-full w-full overflow-hidden relative">
              <div
                className={`h-full absolute top-0 left-0 ${progressBarGradient}`}
                style={{ width: "100vw" }}
              />
            </div>
          ) : (
            <div className={`h-full w-full ${progressBarColor}`} style={progressBarStyle} />
          )}
          {headGlowColor && (
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-[8px] blur-[4px] rounded-full z-10" style={{ backgroundColor: headGlowColor }} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
