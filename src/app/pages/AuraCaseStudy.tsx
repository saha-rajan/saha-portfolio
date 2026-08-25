import { useEffect, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronUp, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCursor } from "../contexts/CursorContext";
import { CaseStudyNav } from "../components/CaseStudyNav";
import { AuraStateObject } from "../components/AuraStateObject";

const Aura3DEmotionObject = lazy(() => import("../components/Aura3DEmotionObject"));
import emotionPinkUrl from "../../assets/aura_emotion_pink_v2.glb?url";
import emotionGreenUrl from "../../assets/emotion 2aura.glb?url";
import emotionOrangeUrl from "../../assets/emotion 3 aura.glb?url";
import emotionPurpleUrl from "../../assets/aura emotion 4.glb?url";
import auraStateStressed from "../../assets/aura_state_stressed.png";
import auraStateInFlow from "../../assets/aura_state_inflow.png";
import auraStateOpen from "../../assets/aura_state_open.png";
import auraStateRecharging from "../../assets/recharging_knot_final.png";
import radarAura from "../../assets/Convert to GIF project - August 11, 2026 at 19.06.17.gif";
import radarStaticAura from "../../assets/aura_radar_static.png";
import auraIconStressed from "../../assets/aura_icon_stressed.png";
import auraIconRecharging from "../../assets/aura_icon_recharging.png";
import auraIconInFlow from "../../assets/aura_icon_inflow.png";
import auraIconDraining from "../../assets/aura_icon_draining.png";
import auraIconOpen from "../../assets/aura_icon_open.png";
import auraIconInvisible from "../../assets/aura_icon_invisible.png";
import auraIconTransitioning from "../../assets/aura_icon_transitioning.png";
import auraDetailLauren from "../../assets/aura_detail_lauren.png";
import auraDetailAnnice from "../../assets/aura_detail_annice.png";
import auraDetailCameron from "../../assets/aura_detail_cameron.png";
import auraDetailPriya from "../../assets/aura_detail_priya.png";
import auraDetailRakesh from "../../assets/aura_detail_rakesh.png";
import auraDetailJey from "../../assets/aura_detail_jey.png";
import auraScenario1Panel1 from "../../assets/aura_scenario1_panel1.jpg";
import auraScenario1Panel2 from "../../assets/aura_scenario1_panel2.jpg";
import auraScenario1Panel3 from "../../assets/aura_scenario1_panel3.jpg";
import auraScenario2Panel1 from "../../assets/aura_scenario_02_panel_01.jpg";
import auraScenario2Panel2 from "../../assets/aura_scenario_02_panel_02.jpg";
import auraScenario2Panel3 from "../../assets/aura_scenario_02_panel_03.jpg";
import auraScenario3Panel1 from "../../assets/aura_scenario_03_panel_01.jpg";
import auraScenario3Panel2 from "../../assets/aura_scenario_03_panel_02.jpg";
import auraScenario3Panel3 from "../../assets/aura_scenario_03_panel_03.jpg";
import auraActionStateContext from "../../assets/aura_action_state_context.png";
import auraActionStateResult from "../../assets/aura_action_state_result.png";
import auraPrivacyContainer from "../../assets/Container.png";
import auraOnboardingStates from "../../assets/aura_onboarding_states.png";
import auraOnboardingAudience from "../../assets/aura_onboarding_audience.png";
import auraOnboardingSignals from "../../assets/aura_onboarding_signals.png";
import auraMyDayOverview from "../../assets/aura_my_day_overview.png";
import auraMyDayPatterns from "../../assets/aura_my_day_patterns.png";
import auraPresenceControls from "../../assets/aura_presence_controls.png";
import auraPresenceSelectedPeople from "../../assets/aura_presence_selected_people.png";

// New Standardized Closing Gallery Assets
import auraGallery01 from "../../assets/aura_gallery_01.png";
import auraGallery02 from "../../assets/aura_gallery_02.png";
import auraGallery03 from "../../assets/aura_gallery_03.png";
import auraGallery04 from "../../assets/aura_gallery_04.png";
import auraGallery05 from "../../assets/aura_gallery_05.png";
import auraGallery06 from "../../assets/aura_gallery_06.png";
import auraGallery07 from "../../assets/aura_gallery_07.png";
import auraGallery08 from "../../assets/aura_gallery_08.png";
import auraGallery09 from "../../assets/aura_gallery_09.png";
import auraGallery10 from "../../assets/aura_gallery_10.png";
import auraGallery11 from "../../assets/aura_gallery_11.png";
import auraGallery12 from "../../assets/aura_gallery_12.png";
import auraGallery13 from "../../assets/aura_gallery_13.png";
import auraGallery14 from "../../assets/aura_gallery_14.png";

// ─── Presence State Item Component ──────────────────────────────────────────────
function PresenceStateItem({
  label,
  img,
}: {
  label: string;
  img: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-2.5 shrink-0 cursor-default">
      <motion.img
        src={img}
        alt={label}
        className="w-8 h-8 md:w-[34px] md:h-[34px] object-contain block shrink-0"
        initial={{ scale: 1 }}
        whileHover={
          !prefersReducedMotion
            ? {
                scale: 1.16,
              }
            : {}
        }
        transition={{
          duration: 0.25,
          ease: [0.25, 1, 0.5, 1],
        }}
      />
      <span
        className="text-[10px] md:text-[11px] tracking-wider uppercase text-white/60 whitespace-nowrap"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {label}
      </span>
    </div>
  );
}

function VocabularyRail() {
  const states = [
    { label: "STRESSED", img: auraIconStressed },
    { label: "RECHARGING", img: auraIconRecharging },
    { label: "IN FLOW", img: auraIconInFlow },
    { label: "DRAINING", img: auraIconDraining },
    { label: "OPEN", img: auraIconOpen },
    { label: "INVISIBLE", img: auraIconInvisible },
    { label: "TRANSITIONING", img: auraIconTransitioning },
  ];

  return (
    <div className="pt-6 border-t border-white/10 w-full max-w-xl">
      <div 
        className="grid gap-y-4 gap-x-3 sm:gap-x-4 md:gap-x-5 items-center justify-start"
        style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
      >
        {states.map((state) => (
          <PresenceStateItem key={state.label} label={state.label} img={state.img} />
        ))}
      </div>
    </div>
  );
}

// ─── Experience 02 Colleague Context Carousel ───────────────────────────────────
const CONTEXT_SCREENS = [
  {
    person: "LAUREN R.",
    state: "STRESSED",
    stateColor: "#FF6B50",
    img: auraDetailLauren,
  },
  {
    person: "ANNICE L.",
    state: "IN FLOW",
    stateColor: "#A78BFA",
    img: auraDetailAnnice,
  },
  {
    person: "CAMERON R.",
    state: "OPEN",
    stateColor: "#F97316",
    img: auraDetailCameron,
  },
  {
    person: "PRIYA K.",
    state: "RECHARGING",
    stateColor: "#34D399",
    img: auraDetailPriya,
  },
  {
    person: "RAKESH K.",
    state: "TRANSITIONING",
    stateColor: "#C084FC",
    img: auraDetailRakesh,
  },
  {
    person: "JEY K.",
    state: "DRAINING",
    stateColor: "#F59E0B",
    img: auraDetailJey,
  },
];

function Experience02Showcase() {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isHovered, setIsHovered] = useState(false);
  const [isControlsFocused, setIsControlsFocused] = useState(false);

  const shouldAutoplay = isPlaying && !isHovered && !isControlsFocused && !prefersReducedMotion;

  useEffect(() => {
    if (!shouldAutoplay) return;

    const timer = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prev) => (prev + 1) % CONTEXT_SCREENS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [shouldAutoplay]);

  const handleNext = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % CONTEXT_SCREENS.length);
  };

  const handlePrev = () => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + CONTEXT_SCREENS.length) % CONTEXT_SCREENS.length);
  };

  const currentScreen = CONTEXT_SCREENS[currentIndex];

  return (
    <div className="mb-16 md:mb-20">
      {/* Primary Row: Phone Stage (Left) & Right Narrative Group vertically centered against Phone Stage ONLY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Phone Stage ONLY */}
        <div className="lg:col-span-6 order-1 lg:order-1">
          <FadeInView y={16}>
            <div className="flex flex-col items-center w-full max-w-[360px] md:max-w-[420px] lg:max-w-[440px] mx-auto lg:ml-auto lg:mr-0">
              {/* Fixed Stage (Exact 584x1024 phone image ratio) */}
              <div
                className="relative w-full aspect-[584/1024] overflow-hidden rounded-[32px] md:rounded-[42px]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={{
                      enter: (dir: "next" | "prev") => ({
                        x: prefersReducedMotion ? 0 : dir === "next" ? 24 : -24,
                        scale: prefersReducedMotion ? 1 : 0.985,
                        opacity: 0,
                      }),
                      center: {
                        x: 0,
                        scale: 1,
                        opacity: 1,
                      },
                      exit: (dir: "next" | "prev") => ({
                        x: prefersReducedMotion ? 0 : dir === "next" ? -24 : 24,
                        scale: prefersReducedMotion ? 1 : 0.985,
                        opacity: 0,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.85,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={currentScreen.img}
                      alt={`${currentScreen.person} ${currentScreen.state}`}
                      className="w-full h-full object-contain block transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeInView>
        </div>

        {/* Right Column: 02 Narrative Group (optically shifted up to equalize top/bottom visual gap against phone stage) */}
        <div className="lg:col-span-6 order-2 lg:order-2 lg:-mt-9">
          <FadeInView delay={0.08} y={16}>
            <span
              className="block mb-6 text-[10px] tracking-widest uppercase text-white/40"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              02 / UNDERSTAND THE MOMENT
            </span>
            <h3 className="text-3xl md:text-4xl font-light text-white leading-tight mb-12">
              Understand the moment, not the person.
            </h3>

            {/* Annotated Product Anatomy List */}
            <div className="flex flex-col gap-10">
              <div>
                <p className="text-[11px] tracking-widest uppercase text-white font-mono mb-2">01 / CONFIDENCE</p>
                <p className="text-[15px] leading-relaxed text-white/60">Communicating uncertainty rather than presenting inference as fact.</p>
              </div>
              <div>
                <p className="text-[11px] tracking-widest uppercase text-white font-mono mb-2">02 / SIGNAL SOURCES</p>
                <p className="text-[15px] leading-relaxed text-white/60">Making the signals behind the state visible.</p>
              </div>
              <div>
                <p className="text-[11px] tracking-widest uppercase text-white font-mono mb-2">03 / RECEPTIVITY</p>
                <p className="text-[15px] leading-relaxed text-white/60">Translating shared context into approachability.</p>
              </div>
              <div>
                <p className="text-[11px] tracking-widest uppercase text-white font-mono mb-2">04 / USER-PROVIDED CONTEXT</p>
                <p className="text-[15px] leading-relaxed text-white/60">Keeping the person's own communication visible alongside inferred signals.</p>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      {/* Secondary Row: Carousel Footer pulled up close to Phone Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 -mt-16 md:-mt-20">
        <div className="lg:col-span-6">
          <div className="flex flex-col items-center w-full max-w-[360px] md:max-w-[420px] lg:max-w-[440px] mx-auto lg:ml-auto lg:mr-0">
            <div
              className="flex flex-col items-center justify-center text-center w-full"
              onMouseEnter={() => setIsControlsFocused(true)}
              onMouseLeave={() => setIsControlsFocused(false)}
            >
              {/* ROW 1: PERSON */}
              <span
                className="text-[11px] md:text-[12px] tracking-widest text-white/75 font-mono uppercase text-center block w-full"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {currentScreen.person}
              </span>

              {/* ROW 2: PRESENCE STATE */}
              <div
                className="flex items-center justify-center gap-1.5 text-[9.5px] md:text-[10px] tracking-widest font-mono uppercase mt-1 w-full text-center"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: currentScreen.stateColor }}
                />
                <span
                  className="transition-colors duration-300"
                  style={{ color: currentScreen.stateColor }}
                >
                  {currentScreen.state}
                </span>
              </div>

              {/* ROW 3: POSITION / INDEX */}
              <span
                className="text-[10px] md:text-[11px] tracking-widest text-white/40 font-mono mt-1.5 md:mt-2 text-center block w-full"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                0{currentIndex + 1} / 0{CONTEXT_SCREENS.length}
              </span>

              {/* ROW 4: CONTROLS */}
              <div className="flex items-center justify-between w-[100px] md:w-[110px] mt-1.5 md:mt-2 mx-auto">
                <button
                  onClick={handlePrev}
                  aria-label="Previous colleague screen"
                  className="text-white/40 hover:text-white transition-colors duration-200 p-1 flex items-center justify-center"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                  className="text-white/40 hover:text-white transition-colors duration-200 p-1 flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Next colleague screen"
                  className="text-white/40 hover:text-white transition-colors duration-200 p-1 flex items-center justify-center"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Aura Color Tokens ─────────────────────────────────────────────────────────
// Dark portfolio shell canvas with warm Aura accents (#FF6B50)
const AURA = {
  bg: "#000000",
  bgAlt: "#0d0d11",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.85)",
  textSubtle: "#a7a7a7",
  meta: "rgba(255, 255, 255, 0.5)",
  border: "rgba(255, 255, 255, 0.1)",
  borderLight: "rgba(255, 255, 255, 0.15)",
  accent: "#ff6b50",
};

// ─── Image Placeholder Component ──────────────────────────────────────────────
function ImagePlaceholder({
  label,
  className = "",
  style = {},
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: `1px solid rgba(255, 255, 255, 0.12)`,
        ...style,
      }}
    >
      {/* Crosshair lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center opacity-50 border border-white/40"
        >
          <div className="w-2 h-2 rounded-full bg-white/40" />
        </div>
        <p
          className="text-[10px] tracking-widest uppercase leading-relaxed text-white/50"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

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

// ─── Main Component ────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    title: "SCENARIO 01 / THE INTERRUPTED MOMENT",
    panels: [
      {
        label: "01 / APPROACH",
        src: auraScenario1Panel1,
        alt: "Priya approaches Jey to discuss the deadline",
      },
      {
        label: "02 / INVISIBLE CONTEXT",
        src: auraScenario1Panel2,
        alt: "Jey is swamped with back-to-back meetings and hasn't eaten",
      },
      {
        label: "03 / CONSEQUENCE",
        src: auraScenario1Panel3,
        alt: "The interaction lands poorly and Priya walks away questioning the reaction",
      },
    ],
  },
  {
    title: "SCENARIO 02 / THE MISSED CONNECTION",
    panels: [
      {
        label: "01 / HESITATION",
        src: auraScenario2Panel1,
        alt: "Hesitation before interrupting",
      },
      {
        label: "02 / WITHDRAWAL",
        src: auraScenario2Panel2,
        alt: "Deciding not to reach out",
      },
      {
        label: "03 / EXCLUSION",
        src: auraScenario2Panel3,
        alt: "A missed opportunity for connection",
      },
    ],
  },
  {
    title: "SCENARIO 03 / THE INVISIBLE BUILDUP",
    panels: [
      {
        label: "01 / ACCUMULATION",
        src: auraScenario3Panel1,
        alt: "Accumulating stress and workload",
      },
      {
        label: "02 / BREAKING POINT",
        src: auraScenario3Panel2,
        alt: "Reaching a breaking point",
      },
      {
        label: "03 / LATE RECOGNITION",
        src: auraScenario3Panel3,
        alt: "Late recognition by the team",
      },
    ],
  },
];

const AURA_NAV_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "aura", label: "Aura" },
  { id: "experience", label: "Experience" },
  { id: "consent", label: "Consent" },
  { id: "beyond", label: "Beyond" },
];

const auraGalleryImages = [
  auraGallery01,
  auraGallery02,
  auraGallery03,
  auraGallery04,
  auraGallery05,
  auraGallery06,
  auraGallery07,
  auraGallery08,
  auraGallery09,
  auraGallery10,
  auraGallery11,
  auraGallery12,
  auraGallery13,
  auraGallery14,
];

function AuraMarqueeReel() {
  const shouldReduceMotion = useReducedMotion();

  // Consistent editorial spacing
  const trackGap = "gap-[clamp(32px,4vw,72px)]";

  // Enforce uniform height with room for scale expansion without clipping
  const itemClass = "flex-none shrink-0 py-4";
  const imgClass = "h-[clamp(360px,58vh,720px)] w-auto block object-contain drop-shadow-2xl transition-transform duration-500 ease-out md:hover:scale-[1.02] relative md:hover:z-10 origin-center";

  const renderItem = (src: string, index: number, keyPrefix: string) => (
    <div key={`${keyPrefix}-${index}`} className={itemClass}>
      <img src={src} alt={`Aura Gallery ${index + 1}`} className={imgClass} />
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden py-16 md:py-24 marquee-container">
      <style>{`
        @keyframes aura-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-aura-marquee {
          /* Slow motion: ~60s for 14 frames */
          animation: aura-marquee 60s linear infinite;
        }
      `}</style>

      {shouldReduceMotion ? (
        <div className={`flex ${trackGap} overflow-x-auto scrollbar-none px-6 md:px-12 py-8`}>
          {auraGalleryImages.map((src, idx) => renderItem(src, idx, "static"))}
        </div>
      ) : (
        <div className="flex overflow-hidden select-none py-6">
          <div
            className={`flex shrink-0 items-center ${trackGap} py-6 pr-[clamp(32px,4vw,72px)] animate-aura-marquee`}
          >
            {/* Track A */}
            {auraGalleryImages.map((src, idx) => renderItem(src, idx, "track1"))}
            {/* Track B */}
            {auraGalleryImages.map((src, idx) => renderItem(src, idx, "track2"))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AuraCaseStudy() {
  const { setHideCursor } = useCursor();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioDirection, setScenarioDirection] = useState(1);
  const [prevArrowPosition, setPrevArrowPosition] = useState({ x: 0, y: 0 });
  const [nextArrowPosition, setNextArrowPosition] = useState({ x: 0, y: 0 });
  const [scrollTopArrowPosition, setScrollTopArrowPosition] = useState({ x: 0, y: 0 });
  const [prevTopNavPosition, setPrevTopNavPosition] = useState({ x: 0, y: 0 });
  const [nextTopNavPosition, setNextTopNavPosition] = useState({ x: 0, y: 0 });
  const [prevBottomNavPosition, setPrevBottomNavPosition] = useState({ x: 0, y: 0 });
  const [nextBottomNavPosition, setNextBottomNavPosition] = useState({ x: 0, y: 0 });
  const currentScenario = SCENARIOS[scenarioIndex];

  const handleNextScenario = () => {
    if (scenarioIndex < SCENARIOS.length - 1) {
      setScenarioDirection(1);
      setScenarioIndex((prev) => prev + 1);
    }
  };

  const handlePrevScenario = () => {
    if (scenarioIndex > 0) {
      setScenarioDirection(-1);
      setScenarioIndex((prev) => prev - 1);
    }
  };

  const handlePrevArrowMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (scenarioIndex === 0) return;
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setPrevArrowPosition({ x: clampedX, y: clampedY });
  };

  const handleNextArrowMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (scenarioIndex === SCENARIOS.length - 1) return;
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 6;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setNextArrowPosition({ x: clampedX, y: clampedY });
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

  // ── Hero sequential animation variants ──
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
  const heroVisual = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] },
    },
  };
  const heroObjects = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.88 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.3, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="min-h-screen font-sans bg-black text-white selection:bg-white selection:text-black">
      {/* ── SCROLL TO TOP — matches ChemoBuddy placement ─────────────── */}
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
        style={{
          background: `rgba(20, 20, 25, 0.8)`,
          color: "#FFFFFF",
        }}
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
          01 — HERO (Dark Portfolio Shell Chassis)
          Chassis matches ChemoBuddy & Portfolio shell: bg-black background,
          pt-24 md:pt-32, px-6 md:px-12, max-w-[1440px] mx-auto.
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="pt-24 md:pt-32 pb-10 md:pb-12 px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto w-full"
      >
        {/* Top bar: flex layout matching ChemoBuddy hero */}
        <div className="flex justify-between items-start gap-8">
          {/* Left: identity + headline */}
          <motion.div
            className="flex-1 min-w-0 max-w-[760px]"
            variants={heroParent}
            initial="hidden"
            animate="visible"
          >
            {/* Personal favorite marker — coral accent */}
            <motion.div variants={heroChild} className="mb-4">
              <span
                className="text-[10px] tracking-widest text-[#FF6B50]"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                ♥ PERSONAL FAVORITE
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={heroChild}
              className="font-sans font-bold mb-6 tracking-tight text-white"
              style={{
                fontSize: "clamp(3.5rem, 5vw, 5.1rem)",
                lineHeight: 1.1,
              }}
            >
              Aura
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={heroChild}
              className="text-lg md:text-xl max-w-[700px] mb-8 text-white/90"
              style={{ lineHeight: 1.5 }}
            >
              Feel the room{" "}
              <em className="text-white/70" style={{ fontStyle: "italic" }}>
                before you approach.
              </em>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={heroChild}
              className="text-[15px] leading-relaxed max-w-[560px] mb-8 text-[#A7A7A7]"
            >
              A speculative workplace presence experience exploring how
              technology might restore the social cues we lose behind screens,
              headphones and busy calendars.
            </motion.p>

            {/* Metadata pills — dark portfolio style */}
            <motion.div variants={heroChild} className="flex flex-wrap items-center gap-3">
              {["Figma Hackathon", "48 Hours", "Speculative Product Design"].map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full px-4 py-1.5 text-xs tracking-widest uppercase border border-white/15 text-[#A7A7A7]"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Prev/Next nav — dark portfolio style */}
          <div className="hidden md:flex gap-3 shrink-0 pt-4">
            <Link
              to="/works/fintech-dashboard"
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
              to="/works/aisle"
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

      {/* ── Hero Visual — Breakout area for Radar + state objects ───── */}
      <section className="w-full mb-16 px-2 md:px-6">
        <motion.div
          className="relative max-w-[1600px] mx-auto flex items-center justify-center py-12 md:py-20"
          variants={heroParent}
          initial="hidden"
          animate="visible"
        >
          {/* Subtle dark ambient radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 65%)",
            }}
          />

          {/* Floating emotional-state objects — Asymmetric spatial field */}
          {/* Upper-left: In Flow 3D Model */}
          <motion.div
            variants={heroObjects}
            className="absolute top-8 left-8 md:top-14 md:left-20 lg:left-40"
            style={{ zIndex: 2 }}
          >
            <Suspense
              fallback={
                <AuraStateObject
                  src={auraStateInFlow}
                  alt="Aura State Object — In Flow"
                  size="min(104px, 22vw)"
                  maxTilt={6}
                  idleDuration={14}
                  idleY={5}
                  idleRotate={6}
                />
              }
            >
              <Aura3DEmotionObject
                modelUrl={emotionGreenUrl}
                fallbackSrc={auraStateInFlow}
                alt="Aura 3D Emotion Object — In Flow"
                size="min(104px, 22vw)"
                desiredScale={2.1}
                idleDuration={14}
                idleY={5}
                idleRotate={6}
              />
            </Suspense>
          </motion.div>

          {/* Upper-right: Stressed 3D Model */}
          <motion.div
            variants={heroObjects}
            className="absolute top-4 right-8 md:top-10 md:right-20 lg:right-40"
            style={{ zIndex: 2 }}
          >
            <Suspense
              fallback={
                <AuraStateObject
                  src={auraStateStressed}
                  alt="Aura State Object — Stressed"
                  size="min(92px, 20vw)"
                  maxTilt={7}
                  idleDuration={12}
                  idleY={6}
                  idleRotate={5}
                />
              }
            >
              <Aura3DEmotionObject
                modelUrl={emotionPinkUrl}
                fallbackSrc={auraStateStressed}
                alt="Aura 3D Emotion Object — Stressed"
                size="min(92px, 20vw)"
                desiredScale={2.35}
                idleDuration={12}
                idleY={6}
                idleRotate={5}
              />
            </Suspense>
          </motion.div>

          {/* Lower-left: Open 3D Model */}
          <motion.div
            variants={heroObjects}
            className="absolute bottom-12 left-10 md:left-24 lg:left-48"
            style={{ zIndex: 2 }}
          >
            <Suspense
              fallback={
                <AuraStateObject
                  src={auraStateOpen}
                  alt="Aura State Object — Open"
                  size="min(100px, 21vw)"
                  maxTilt={8}
                  idleDuration={16}
                  idleY={7}
                  idleRotate={4}
                />
              }
            >
              <Aura3DEmotionObject
                modelUrl={emotionOrangeUrl}
                fallbackSrc={auraStateOpen}
                alt="Aura 3D Emotion Object — Open"
                size="min(100px, 21vw)"
                desiredScale={1.75}
                idleDuration={16}
                idleY={7}
                idleRotate={4}
              />
            </Suspense>
          </motion.div>

          {/* Lower-right: Recharging 3D Model */}
          <motion.div
            variants={heroObjects}
            className="absolute bottom-8 right-10 md:bottom-14 md:right-24 lg:right-48"
            style={{ zIndex: 2 }}
          >
            <Suspense
              fallback={
                <AuraStateObject
                  src={auraStateRecharging}
                  alt="Aura State Object — Recharging"
                  size="min(76px, 16vw)"
                  maxTilt={6}
                  idleDuration={10}
                  idleY={4}
                  idleRotate={7}
                />
              }
            >
              <Aura3DEmotionObject
                modelUrl={emotionPurpleUrl}
                fallbackSrc={auraStateRecharging}
                alt="Aura 3D Emotion Object — Recharging"
                size="min(76px, 16vw)"
                desiredScale={1.75}
                idleDuration={10}
                idleY={4}
                idleRotate={7}
              />
            </Suspense>
          </motion.div>

          {/* Central phone visual - Perfectly framed 16:9 video crop showing complete phone top-to-bottom */}
          <motion.div
            variants={heroVisual}
            className="relative z-10 overflow-hidden flex justify-center items-center"
            style={{
              width: "min(320px, 80vw)",
              height: "min(640px, 70vh)",
            }}
          >
            <img
              src={radarAura}
              alt="Aura Radar / Nearby Screen"
              className="h-full w-auto max-w-none object-cover pointer-events-none select-none"
              style={{
                objectPosition: "center",
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Secondary Sticky Navigation */}
      <CaseStudyNav
        metaText="AURA"
        sections={AURA_NAV_SECTIONS}
        activeColorClass="text-white"
        progressBarGradient="bg-gradient-to-r from-[#34D399] via-[#F59E0B] via-[#FF6B50] via-[#E11D48] to-[#A78BFA]"
        containerMaxWidth="max-w-[1190px]"
      />
      <div id="case-study-content">

      {/* ══════════════════════════════════════════════════════════════════
          02 — PROJECT AT A GLANCE
          Seamless dark portfolio canvas continuation.
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="overview"
        className="pb-16 md:pb-24 px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto scroll-mt-[140px]"
      >
        <div className="max-w-[1190px] mx-auto">
          <FadeInView>
            <span
              className="block mb-6 text-xs tracking-widest uppercase"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: AURA.accent,
              }}
            >
              Project at a Glance
            </span>
          </FadeInView>

          <div
            className="pb-12 mb-12"
            style={{ borderBottom: `1px solid ${AURA.border}` }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Primary summary */}
              <FadeInView className="col-span-1 lg:col-span-8">
                <p
                  className="text-[22px] md:text-[28px] lg:text-[32px] font-light leading-relaxed max-w-3xl"
                  style={{
                    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    letterSpacing: "-0.015em",
                    color: AURA.text,
                  }}
                >
                  "Aura explores whether digital products can restore the subtle
                  social awareness we use before approaching another person —
                  while keeping emotional presence{" "}
                  <em style={{ fontStyle: "italic", color: AURA.meta }}>
                    consensual and user-controlled.
                  </em>
                  "
                </p>
              </FadeInView>

              {/* Compact metadata — matches ChemoBuddy 4-col sidebar */}
              <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
                {[
                  { label: "Context", value: "Figma Hackathon" },
                  { label: "Timeline", value: "48 hours" },
                  { label: "Project Type", value: "Speculative product design" },
                  {
                    label: "Focus",
                    value: "Workplace social awareness & emotional presence",
                  },
                ].map((item, i) => (
                  <FadeInView key={item.label} delay={i * 0.06}>
                    <div>
                      <h4
                        className="text-xs mb-1 tracking-widest uppercase"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: AURA.meta,
                        }}
                      >
                        {item.label}
                      </h4>
                      <p className="text-[16px] leading-relaxed" style={{ color: AURA.text }}>
                        {item.value}
                      </p>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          03 — OPENING PROBLEM STORY
          On portfolio rails with Aura's warm alt background.
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="problem"
        className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pb-16 md:pb-20"
      >
        <div className="max-w-[1190px] mx-auto">
          {/* Eyebrow */}
          <FadeInView>
            <span
              className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: AURA.accent,
              }}
            >
              The Problem
            </span>
          </FadeInView>

          {/* Large editorial statement */}
          <FadeInView y={24}>
            <h2
              className="font-sans font-bold leading-none tracking-tighter mb-8"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: AURA.text,
                letterSpacing: "-0.04em",
              }}
            >
              Every approach
              <br />
              is a guess.
            </h2>
          </FadeInView>

          <FadeInView delay={0.1} y={16}>
            <p
              className="text-[18px] md:text-[21px] font-light leading-relaxed max-w-3xl mb-16 md:mb-24"
              style={{ color: AURA.textMuted }}
            >
              You can't always see how someone is feeling. They can't always
              signal that they need a moment. So you interrupt — and the
              interaction changes.
            </p>
          </FadeInView>

          {/* Editorial Storyboard Container */}
          <FadeInView y={24} className="mb-16 md:mb-20">
            <div
              className="w-full rounded-2xl md:rounded-3xl p-4 md:p-5 border border-white/10"
              style={{ background: "#0B0B0E" }}
            >
              {/* Storyboard Header Meta */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div className="grid overflow-hidden mr-4">
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={currentScenario.title}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: scenarioDirection * 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: scenarioDirection * -16 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-[10px] md:text-[11px] tracking-widest uppercase text-white/50 col-start-1 row-start-1"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {currentScenario.title}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 md:gap-4 shrink-0 z-10 pl-2">
                  <span
                    className="text-[10px] tracking-widest uppercase text-white/50"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    0{scenarioIndex + 1} / 0{SCENARIOS.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        handlePrevScenario();
                        if (scenarioIndex > 1) {
                          setTimeout(() => setHideCursor(true), 10);
                        } else {
                          setHideCursor(false);
                          setPrevArrowPosition({ x: 0, y: 0 });
                        }
                      }}
                      data-cursor-hide={scenarioIndex !== 0 ? "true" : undefined}
                      onMouseEnter={() => setHideCursor(true)}
                      onMouseLeave={() => {
                        setHideCursor(false);
                        setPrevArrowPosition({ x: 0, y: 0 });
                      }}
                      onMouseMove={handlePrevArrowMouseMove}
                      disabled={scenarioIndex === 0}
                      aria-label="Previous scenario"
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all duration-300 ease-out overflow-hidden ${
                        scenarioIndex === 0 
                          ? "border-white/10 opacity-30 cursor-not-allowed" 
                          : "border-white/10 opacity-60 hover:border-transparent hover:opacity-100 hover:scale-[1.05] active:scale-[0.97] cursor-pointer hover:bg-[#282834]"
                      }`}
                    >
                      <motion.div
                        className="inline-block flex items-center justify-center"
                        animate={{ x: prevArrowPosition.x, y: prevArrowPosition.y }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
                      >
                        <ArrowLeft size={14} />
                      </motion.div>
                    </button>
                    <button
                      onClick={(e) => {
                        handleNextScenario();
                        if (scenarioIndex < SCENARIOS.length - 2) {
                          setTimeout(() => setHideCursor(true), 10);
                        } else {
                          setHideCursor(false);
                          setNextArrowPosition({ x: 0, y: 0 });
                        }
                      }}
                      data-cursor-hide={scenarioIndex !== SCENARIOS.length - 1 ? "true" : undefined}
                      onMouseEnter={() => setHideCursor(true)}
                      onMouseLeave={() => {
                        setHideCursor(false);
                        setNextArrowPosition({ x: 0, y: 0 });
                      }}
                      onMouseMove={handleNextArrowMouseMove}
                      disabled={scenarioIndex === SCENARIOS.length - 1}
                      aria-label="Next scenario"
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all duration-300 ease-out overflow-hidden ${
                        scenarioIndex === SCENARIOS.length - 1 
                          ? "border-white/10 opacity-30 cursor-not-allowed" 
                          : "border-white/10 opacity-60 hover:border-transparent hover:opacity-100 hover:scale-[1.05] active:scale-[0.97] cursor-pointer hover:bg-[#282834]"
                      }`}
                    >
                      <motion.div
                        className="inline-block flex items-center justify-center"
                        animate={{ x: nextArrowPosition.x, y: nextArrowPosition.y }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
                      >
                        <ArrowRight size={14} />
                      </motion.div>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3-Bay Grid */}
              <div className="grid overflow-hidden relative">
                <AnimatePresence initial={false}>
                  <motion.div 
                    key={currentScenario.title}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: scenarioDirection * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: scenarioDirection * -24 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="col-start-1 row-start-1 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5"
                  >
                    {currentScenario.panels.map((item) => (
                      <div key={item.label} className="flex flex-col gap-2.5 group">
                        {/* Bay Metadata Label */}
                        <div className="px-1">
                          <span
                            className="text-[11px] tracking-widest uppercase text-white/60"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                          >
                            {item.label}
                          </span>
                        </div>

                        {/* Image Bay */}
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full aspect-[43/64] object-cover rounded-xl block transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeInView>

          {/* Missing cues beat — Editorial bridge to the design question */}
          <div className="pt-6 pb-8">
            <FadeInView y={16}>
              <span
                className="block mb-4 text-[11px] tracking-widest uppercase text-[#FF6B50]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                WHAT WE'VE LOST
              </span>
            </FadeInView>

            <FadeInView delay={0.08} y={18}>
              <h3 className="text-2xl md:text-3xl lg:text-[32px] font-light text-white leading-snug max-w-2xl mb-7">
                Modern work can make the cues we rely on harder to read.
              </h3>
            </FadeInView>

            <FadeInView delay={0.14} y={16}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-0 max-w-4xl border-t border-white/10">
                {[
                  { cue: "Headphones", observation: "Voice tone disappears." },
                  { cue: "Screens", observation: "Body language disappears." },
                  { cue: "Hybrid work", observation: "Proximity disappears." },
                  {
                    cue: "Calendars",
                    observation: "Show availability, not receptivity.",
                  },
                ].map((item) => (
                  <div
                    key={item.cue}
                    className="flex items-baseline gap-4 py-5 border-b border-white/10"
                  >
                    <span
                      className="text-[10px] tracking-widest uppercase shrink-0 w-24 md:w-28 text-white/40"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {item.cue}
                    </span>
                    <span className="text-[16px] md:text-[17px] leading-snug text-white/90 font-light whitespace-normal md:whitespace-nowrap">
                      {item.observation}
                    </span>
                  </div>
                ))}
              </div>
            </FadeInView>
          </div>

          {/* Narrative pause — the big question */}
          <div className="pt-20 md:pt-32 pb-4 md:pb-8 flex flex-col items-center text-center gap-4 md:gap-6">
            <FadeInView y={12}>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: AURA.meta }}
              >
                So we asked —
              </p>
            </FadeInView>
            <FadeInView delay={0.15} y={20}>
              <p
                className="font-sans font-light leading-tight mx-auto"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3.75rem)",
                  color: AURA.text,
                  letterSpacing: "-0.025em",
                  maxWidth: "22ch",
                }}
              >
                What if we could restore
                <br />
                <em style={{ fontStyle: "italic", color: AURA.meta }}>
                  that sense digitally?
                </em>
              </p>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          04 — INTRODUCING AURA (PRODUCT REVEAL)
          On portfolio rails.
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="aura"
        className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pb-16 md:pb-20 scroll-mt-[140px]"
        style={{ borderTop: `1px solid ${AURA.border}` }}
      >
        <div className="max-w-[1190px] mx-auto pt-16 md:pt-24">
          
          {/* A. PRODUCT INTRODUCTION */}
          <div className="mb-8 md:mb-10 max-w-4xl">
            <FadeInView>
              <div className="text-left">
                <span
                  className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: "#FF6B50",
                  }}
                >
                  INTRODUCING AURA
                </span>
                <h2
                  className="font-sans font-medium leading-none tracking-tight mb-8"
                  style={{
                    fontSize: "clamp(2rem, 4.5vw, 4rem)",
                    color: "white",
                    letterSpacing: "-0.04em",
                    maxWidth: "18ch",
                  }}
                >
                  A consensual presence layer for the workplace.
                </h2>
              </div>
            </FadeInView>

            <FadeInView delay={0.08} y={16}>
              <div className="flex flex-col gap-1.5 mb-4 md:mb-6 max-w-md">
                <p className="text-[19px] md:text-[22px] leading-snug font-light text-white/60">
                  Not a mood tracker.
                </p>
                <p className="text-[19px] md:text-[22px] leading-snug font-light text-white/60">
                  Not a status message.
                </p>
                <p className="text-[19px] md:text-[22px] leading-snug font-normal text-white">
                  A way to feel the room before you approach.
                </p>
              </div>
            </FadeInView>

            {/* Conceptual Micro-Rail */}
            <FadeInView delay={0.16} y={16}>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                {[
                  "SENSE THE ROOM",
                  "UNDERSTAND THE MOMENT",
                  "DECIDE HOW TO APPROACH",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 md:gap-4">
                    <span
                      className="text-[10px] tracking-widest uppercase"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {step}
                    </span>
                    {i < 2 && (
                      <span className="text-white/60 hidden md:block text-[10px] font-mono">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </FadeInView>
          </div>

          {/* B. EXPERIENCE 01 — SENSE THE ROOM */}
          <div id="experience" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center scroll-mt-[140px]">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <FadeInView y={16}>
                <span
                  className="block mb-6 text-[10px] tracking-widest uppercase text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  01 / SENSE THE ROOM
                </span>
                <h3 className="text-3xl md:text-4xl font-light text-white leading-tight mb-6">
                  Read the room before you approach.
                </h3>
                <p className="text-[17px] leading-relaxed text-white/70 max-w-md mb-8">
                  Radar gives you a peripheral view of nearby colleagues and the presence states they choose to share — giving you context before you approach.
                </p>

                {/* Compact Presence-State Vocabulary Rail */}
                <VocabularyRail />
              </FadeInView>
            </div>
            
            <div className="lg:col-span-6 order-1 lg:order-2">
              <FadeInView delay={0.12} y={24}>
                <div className="relative w-full mx-auto max-w-[340px] md:max-w-[400px] lg:max-w-[430px]">
                  <img
                    src={radarStaticAura}
                    alt="Aura Radar Interface"
                    className="w-full h-auto block mx-auto transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                </div>
              </FadeInView>
            </div>
          </div>

          {/* EDITORIAL TRANSITION */}
          <div className="pt-8 pb-12 md:pt-12 md:pb-20 flex flex-col items-center text-center">
            <FadeInView y={16}>
              <h3 className="text-3xl md:text-5xl font-light text-white leading-tight mb-6 md:mb-8 tracking-tight">
                But a state alone isn't enough.
              </h3>
              <p className="text-[18px] md:text-[20px] leading-relaxed text-white/60 max-w-2xl mx-auto">
                Aura should not claim to tell you how someone feels. It should help communicate the context they choose to share.
              </p>
            </FadeInView>
          </div>

          {/* C. EXPERIENCE 02 — UNDERSTAND THE MOMENT */}
          <Experience02Showcase />

          {/* D. EXPERIENCE 03 — DECIDE HOW TO APPROACH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-16 md:mb-24">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <FadeInView y={16}>
                <span
                  className="block mb-6 text-[10px] tracking-widest uppercase text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  03 / DECIDE HOW TO APPROACH
                </span>
                <h3 className="text-3xl md:text-[2.5rem] font-light text-white leading-tight mb-6">
                  Context becomes a gentler next move.
                </h3>
                <p className="text-[17px] leading-relaxed text-white/70 max-w-md">
                  Aura translates the shared moment into a considerate next step — approach now, give them space, or connect another way.
                </p>
              </FadeInView>
            </div>
            
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
                <FadeInView delay={0.1} y={24} className="w-full max-w-[280px] md:max-w-[320px]">
                  <img
                    src={auraActionStateContext}
                    alt="Aura Action State Context"
                    className="w-full h-auto block drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                </FadeInView>
                
                <FadeInView delay={0.3} className="hidden sm:block">
                  <ArrowRight size={24} style={{ color: "rgba(255,255,255,0.35)" }} />
                </FadeInView>
                
                <FadeInView delay={0.5} y={24} className="w-full max-w-[280px] md:max-w-[320px]">
                  <img
                    src={auraActionStateResult}
                    alt="Aura Action State Result"
                    className="w-full h-auto block drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                </FadeInView>
              </div>
            </div>
          </div>

          {/* E. USER CONTROL / CONSENT */}
          <div id="consent" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-6 md:mb-8 scroll-mt-[140px]">
            <div className="lg:col-span-7 order-1 lg:order-1">
              <FadeInView y={24}>
                <div className="relative w-full max-w-[340px] lg:max-w-[420px] mx-auto">
                  <img
                    src={auraPrivacyContainer}
                    alt="Aura Privacy Settings"
                    className="w-full h-auto block drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                </div>
              </FadeInView>
            </div>
            
            <div className="lg:col-span-5 order-2 lg:order-2">
              <FadeInView delay={0.12} y={16}>
                <span
                  className="block mb-6 text-[10px] tracking-widest uppercase text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  ETHICS & CONSENT
                </span>
                <h3 className="text-3xl md:text-4xl font-light text-white leading-tight mb-6">
                  Presence only works when people stay in control.
                </h3>
                <p className="text-[17px] leading-relaxed text-white/70 max-w-md mb-8">
                  Aura can suggest. The person decides what becomes visible.
                </p>
                <div className="pl-4 border-l border-white/10">
                  <p className="text-[13px] leading-relaxed text-white/40 max-w-sm italic">
                    Ghost Mode, Confirm / Override, broadcasting scope, and Selected People ensure autonomy.
                  </p>
                </div>
              </FadeInView>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          05 — BEYOND THE MOMENT (PRODUCT SYSTEM)
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="beyond"
        className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pb-16 md:pb-24 scroll-mt-[140px]"
        style={{ borderTop: `1px solid ${AURA.border}` }}
      >
        <div className="max-w-[1190px] mx-auto pt-16 md:pt-24">
          
          {/* CHAPTER TITLE */}
          <div className="mb-16 md:mb-24 max-w-3xl mx-auto text-center">
            <FadeInView y={16}>
              <span
                className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: "#FF6B50",
                }}
              >
                BEYOND THE MOMENT
              </span>
              <h2
                className="font-sans font-medium leading-tight tracking-tight mb-8"
                style={{
                  fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                  color: "white",
                  letterSpacing: "-0.04em",
                }}
              >
                A system, not just a state.
              </h2>
              <p className="text-[19px] md:text-[22px] leading-snug font-light text-white/60 mx-auto max-w-xl">
                Aura extends the same ideas of awareness and agency across setup, self-reflection and visibility.
              </p>
            </FadeInView>
          </div>

          {/* 01 / SETUP */}
          <div className="mb-12 md:mb-16 pb-5 md:pb-6">
            <FadeInView y={16}>
              <div className="mb-10">
                <span
                  className="block mb-4 text-[10px] tracking-widest uppercase text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  01 / SETUP
                </span>
                <h3 className="text-3xl md:text-4xl font-light text-white leading-tight">
                  Consent starts before Aura does.
                </h3>
              </div>
            </FadeInView>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3 lg:gap-5">
              <FadeInView delay={0.1} y={24}>
                <div className="flex flex-col items-center">
                  <img src={auraOnboardingStates} alt="Aura Onboarding States" className="w-full max-w-[320px] lg:max-w-[340px] h-auto drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center" />
                  <span className="text-[10px] tracking-widest uppercase text-white/40 font-mono -mt-5 md:-mt-6">UNDERSTAND</span>
                </div>
              </FadeInView>
              <FadeInView delay={0.2} y={24}>
                <div className="flex flex-col items-center">
                  <img src={auraOnboardingAudience} alt="Aura Onboarding Audience" className="w-full max-w-[320px] lg:max-w-[340px] h-auto drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center" />
                  <span className="text-[10px] tracking-widest uppercase text-white/40 font-mono -mt-5 md:-mt-6">CHOOSE</span>
                </div>
              </FadeInView>
              <FadeInView delay={0.3} y={24}>
                <div className="flex flex-col items-center">
                  <img src={auraOnboardingSignals} alt="Aura Onboarding Signals" className="w-full max-w-[320px] lg:max-w-[340px] h-auto drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center" />
                  <span className="text-[10px] tracking-widest uppercase text-white/40 font-mono -mt-5 md:-mt-6">ENABLE</span>
                </div>
              </FadeInView>
            </div>
          </div>

          {/* 02 / SELF-AWARENESS */}
          <div className="mb-24 md:mb-32 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            <div className="lg:col-span-4 lg:col-start-2 order-1 lg:order-1">
              <FadeInView y={16}>
                <span
                  className="block mb-6 text-[10px] tracking-widest uppercase text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  02 / SELF-AWARENESS
                </span>
                <h3 className="text-3xl md:text-[2.5rem] font-light text-white leading-tight mb-6">
                  A mirror for your own workday.
                </h3>
              </FadeInView>
            </div>
            
            <div className="lg:col-span-7 order-2 lg:order-2">
              <FadeInView delay={0.1} y={24}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-4">
                  <img
                    src={auraMyDayOverview}
                    alt="Aura My Day Overview"
                    className="w-full max-w-[320px] lg:max-w-[400px] xl:max-w-[420px] h-auto block drop-shadow-2xl md:-mt-8 transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                  <img
                    src={auraMyDayPatterns}
                    alt="Aura My Day Patterns"
                    className="w-full max-w-[320px] lg:max-w-[400px] xl:max-w-[420px] h-auto block drop-shadow-2xl md:mt-8 transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                </div>
              </FadeInView>
            </div>
          </div>

          {/* 03 / CONTROL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            <div className="lg:col-span-4 lg:col-start-2 order-1 lg:order-1">
              <FadeInView y={16}>
                <span
                  className="block mb-6 text-[10px] tracking-widest uppercase text-white/40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  03 / CONTROL
                </span>
                <h3 className="text-3xl md:text-4xl font-light text-white leading-tight mb-6">
                  Visibility stays in your hands.
                </h3>
                <p className="text-[17px] leading-relaxed text-white/70 max-w-sm mb-6">
                  From broad visibility to specific people, the person decides exactly where their presence appears.
                </p>
              </FadeInView>
            </div>
            
            <div className="lg:col-span-7 order-2 lg:order-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 md:gap-6">
                <FadeInView delay={0.1} y={24} className="w-full max-w-[340px] sm:max-w-[300px] md:max-w-[420px]">
                  <img
                    src={auraPresenceControls}
                    alt="Aura Presence Controls"
                    className="w-full h-auto block drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                </FadeInView>
                
                <FadeInView delay={0.3} className="hidden sm:block z-20 relative">
                  <ArrowRight size={24} style={{ color: "rgba(255,255,255,0.6)" }} />
                </FadeInView>
                
                <FadeInView delay={0.5} y={24} className="w-full max-w-[340px] sm:max-w-[300px] md:max-w-[420px]">
                  <img
                    src={auraPresenceSelectedPeople}
                    alt="Aura Presence Selected People"
                    className="w-full h-auto block drop-shadow-2xl transition-transform duration-500 ease-out md:hover:duration-300 md:hover:scale-[1.03] md:hover:-translate-y-1 relative md:hover:z-10 origin-center"
                  />
                </FadeInView>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CLOSING THOUGHT & FINAL PRODUCT GALLERY
          Quiet, cinematic editorial conclusion.
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pt-16 md:pt-24 pb-0"
        style={{ borderTop: `1px solid ${AURA.border}` }}
      >
        <div className="max-w-[1190px] mx-auto">
          
          {/* 1. CLOSING THOUGHT */}
          <div className="max-w-3xl mb-16 md:mb-24">
            <FadeInView y={16}>
              <span
                className="block mb-6 md:mb-8 text-[11px] tracking-widest uppercase"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: "#FF6B50",
                }}
              >
                CLOSING THOUGHT
              </span>
              <h2
                className="font-sans font-medium leading-none tracking-tight mb-8 text-white"
                style={{
                  fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                Presence should create context, not certainty.
              </h2>
              <div className="space-y-4 max-w-2xl text-[18px] md:text-[21px] leading-relaxed font-light text-white/70">
                <p>
                  Aura began with a simple question: could technology restore some of the social context we lose at work without deciding how people feel for them?
                </p>
                <p className="text-white/60">
                  The resulting concept treats presence as something people can understand, shape and selectively share — not something a system owns.
                </p>
              </div>
            </FadeInView>
          </div>

          {/* 2. THREE-COLUMN REFLECTION ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 py-12 md:py-16 border-t border-b border-white/10">
            <FadeInView delay={0.1} y={16}>
              <span
                className="block mb-4 text-[10px] tracking-widest uppercase text-white/40"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                01 / CONTEXT
              </span>
              <h3 className="text-lg md:text-xl font-normal text-white leading-snug mb-3">
                Make invisible cues more legible.
              </h3>
              <p className="text-sm leading-relaxed text-white/60">
                Give people lightweight context before deciding whether and how to approach.
              </p>
            </FadeInView>

            <FadeInView delay={0.2} y={16} className="md:border-l md:border-white/10 md:pl-8">
              <span
                className="block mb-4 text-[10px] tracking-widest uppercase text-white/40"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                02 / UNCERTAINTY
              </span>
              <h3 className="text-lg md:text-xl font-normal text-white leading-snug mb-3">
                Show signals without pretending they are facts.
              </h3>
              <p className="text-sm leading-relaxed text-white/60">
                Confidence, signal sources and user-provided context keep interpretation visible.
              </p>
            </FadeInView>

            <FadeInView delay={0.3} y={16} className="md:border-l md:border-white/10 md:pl-8">
              <span
                className="block mb-4 text-[10px] tracking-widest uppercase text-white/40"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                03 / AGENCY
              </span>
              <h3 className="text-lg md:text-xl font-normal text-white leading-snug mb-3">
                Keep the person represented in control.
              </h3>
              <p className="text-sm leading-relaxed text-white/60">
                Confirmation, overrides, Ghost Mode and audience controls keep presence consensual.
              </p>
            </FadeInView>
          </div>

        </div>
      </section>

      {/* 3. CONTINUOUS CINEMATIC UI REEL */}
      <AuraMarqueeReel />

      <section className="px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto pb-12 md:pb-16">
        <div className="max-w-[1190px] mx-auto">
          {/* 4. FINAL CLOSING STATEMENT */}
          <div className="pt-6 md:pt-10 w-full flex justify-center">
            <FadeInView y={16}>
              <div className="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-5xl font-light text-white leading-tight tracking-tight mb-3">
                  Feel the room.
                </h3>
                <h3 className="text-3xl md:text-5xl font-light text-white/60 leading-tight tracking-tight mb-12">
                  Keep the person in control.
                </h3>
                <span
                  className="inline-block text-[10px] md:text-[11px] tracking-widest uppercase text-white/35 font-mono text-center"
                >
                  AURA / 48-HOUR SPECULATIVE PRODUCT DESIGN EXPLORATION
                </span>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM NAVIGATION — matches ChemoBuddy pattern
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pb-12 px-6 md:px-12 lg:px-24 min-[1440px]:px-12 max-w-[1440px] mx-auto">
        <div className="max-w-[1190px] mx-auto">
          <div
            className="flex justify-end gap-4 mt-8 pt-6"
            style={{ borderTop: `1px solid ${AURA.border}` }}
          >
            <Link
              to="/works/fintech-dashboard"
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
              to="/works/aisle"
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
