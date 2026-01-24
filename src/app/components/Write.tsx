import { motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useCursor } from "../contexts/CursorContext";
import { useState, useRef } from "react";
import minimalistCover from "figma:asset/2745671b0867568c6fa6904d8ca09dc73163df17.png";
import aiEmotionsImage from "figma:asset/535b1972fed172db8df35f3d647873612c7ef384.png";

const articles = [
  {
    date: "JAN 2026",
    title: "AI Is the Kitchen. You're the Chef.",
    readTime: "3 MIN READ",
    image: minimalistCover,
    size: "col-span-1 md:col-span-2 md:row-span-2",
    link: "#",
    externalLink: "https://saharajan.medium.com/ai-is-the-kitchen-youre-the-chef-82fab343618f",
  },
  {
    date: "JUL 11, 2025",
    title: "I used to think people chatting with AI about their emotions were doing it all wrong.",
    readTime: "2 MIN READ",
    image: aiEmotionsImage,
    size: "col-span-1 md:col-span-2 md:row-span-2",
    link: "#",
  },
];

export function Write() {
  const { setIsTextCursor, setHideCursor } = useCursor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [magneticPosition, setMagneticPosition] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [imagePosition, setImagePosition] = useState<{ [key: number]: { x: number; y: number } }>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleArticleClick = (e: React.MouseEvent, article: typeof articles[0]) => {
    if (article.link === "#") {
      e.preventDefault();
      setSelectedArticle(article);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Magnetic effect - subtle movement
    const maxMove = 8;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.08));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.08));

    setMagneticPosition(prev => ({
      ...prev,
      [index]: { x: clampedX, y: clampedY }
    }));
  };

  const handleCardMouseLeave = (index: number) => {
    setMagneticPosition(prev => ({
      ...prev,
      [index]: { x: 0, y: 0 }
    }));
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const image = imageRefs.current[index];
    if (!image) return;

    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Magnetic effect - subtle movement
    const maxMove = 8;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.08));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.08));

    setImagePosition(prev => ({
      ...prev,
      [index]: { x: clampedX, y: clampedY }
    }));
    setHideCursor(true);
  };

  const handleImageMouseLeave = (index: number) => {
    setImagePosition(prev => ({
      ...prev,
      [index]: { x: 0, y: 0 }
    }));
    setHideCursor(false);
  };

  return (
    <section id="write" className="relative py-24 bg-black overflow-hidden">
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
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-4 gap-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">WRITE</h2>
          </div>
          <p 
            className="text-[#A7A7A7] max-w-xl"
            onMouseEnter={() => setIsTextCursor(true)}
            onMouseLeave={() => setIsTextCursor(false)}
          >
            I write to connect through words that shape experiences and stories. From microcopy in interfaces that guide users with clarity, to film captions that evoke emotion, and long-form reflections on Medium that unpack design and creativity, writing is how I think, design, and express.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <a 
              href={article.link} 
              key={index} 
              className="block group"
              target={article.link !== "#" ? "_blank" : undefined}
              rel={article.link !== "#" ? "noopener noreferrer" : undefined}
              onClick={(e) => handleArticleClick(e, article)}
            >
              <motion.div
                ref={(el) => (cardRefs.current[index] = el)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-4"
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                style={{
                  transform: magneticPosition[index] 
                    ? `translate(${magneticPosition[index].x}px, ${magneticPosition[index].y}px)` 
                    : 'translate(0px, 0px)',
                  transition: magneticPosition[index]?.x === 0 && magneticPosition[index]?.y === 0 
                    ? 'transform 0.3s ease-out' 
                    : 'none'
                }}
              >
                {/* Image Card */}
                <div 
                  ref={(el) => (imageRefs.current[index] = el)}
                  className={`relative cursor-pointer overflow-hidden h-[400px] w-full rounded-xl group-hover:-translate-y-1 transition-transform duration-300 ${
                    article.title === "AI Is the Kitchen. You're the Chef." 
                      ? "bg-[#1A1A1A]" 
                      : "bg-[#111]"
                  }`}
                  onMouseMove={(e) => handleImageMouseMove(e, index)}
                  onMouseLeave={() => handleImageMouseLeave(index)}
                  onMouseEnter={() => setHideCursor(true)}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className={`w-full h-full transition-transform duration-200 group-hover:scale-105 opacity-80 group-hover:opacity-100 object-cover`}
                    style={{
                      transform: imagePosition[index] && imagePosition[index].x !== undefined
                        ? `translate(${imagePosition[index].x}px, ${imagePosition[index].y}px) scale(1.05)` 
                        : 'translate(0px, 0px)',
                      transition: imagePosition[index] && imagePosition[index].x === 0 && imagePosition[index].y === 0 
                        ? 'transform 0.3s ease-out' 
                        : 'none'
                    }}
                  />
                </div>

                {/* Title below card - using body text properties */}
                <h3 
                  className="text-lg font-normal leading-[1.7] tracking-[0] text-white"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  onMouseEnter={() => setIsTextCursor(true)}
                  onMouseLeave={() => setIsTextCursor(false)}
                >
                  {article.title}
                </h3>
              </motion.div>
            </a>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedArticle && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4 md:p-8"
          onClick={closeModal}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl max-w-5xl w-full max-h-[85vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {/* Article Header */}
              <div className="p-8 md:p-12 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  {/* Medium Logo */}
                  <svg width="40" height="40" viewBox="0 0 195 195" className="flex-shrink-0">
                    <path fill="#FFFFFF" d="M46.5340803,65.2157554 C46.6968378,63.6076572 46.0836,62.018231 44.8828198,60.93592 L32.6512605,46.2010582 L32.6512605,44 L70.6302521,44 L99.9859944,108.380952 L125.794585,44 L162,44 L162,46.2010582 L151.542017,56.2281011 C150.640424,56.9153477 150.193188,58.0448862 151.542017,59.1628454 L151.542017,132.837155 C150.193188,133.955114 150.640424,135.084652 151.542017,135.771899 L161.755369,145.798942 L161.755369,148 L110.38282,148 L110.38282,145.798942 L120.963119,135.527337 C122.002801,134.487948 122.002801,134.182246 122.002801,132.592593 L122.002801,73.0417402 L92.585901,147.755438 L88.6106443,147.755438 L54.3622782,73.0417402 L54.3622782,123.115814 C54.0767278,125.221069 54.7759199,127.3406 56.2581699,128.863022 L70.0186741,145.55438 L70.0186741,147.755438 L31,147.755438 L31,145.55438 L44.7605042,128.863022 C46.2319621,127.338076 46.8903838,125.204485 46.5340803,123.115814 L46.5340803,65.2157554 Z"/>
                  </svg>
                  <div className="flex-1">
                    <div className="flex gap-2 text-[#A7A7A7] text-sm uppercase tracking-[0.02em]">
                      <span>{selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.readTime}</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Article Content */}
              <div className="p-8 md:p-12">
                {selectedArticle.title === "AI Is the Kitchen. You're the Chef." ? (
                  <article 
                    className="prose prose-invert max-w-none"
                    onMouseEnter={() => setIsTextCursor(true)}
                    onMouseLeave={() => setIsTextCursor(false)}
                  >
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Think of AI tools as spices and masalas in your kitchen.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      ChatGPT.<br/>
                      Higgsfield.<br/>
                      Gemini (Nano Banana 😄).<br/>
                      Image, video, music, and code generators.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Each tool has its own flavor. On their own, they're powerful, but without the right blend, timing, and intention, the output feels bland, noisy, or half-baked.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      The real skill isn't knowing what tools exist.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      It's knowing how to juggle them instinctively, the same way we cook meals quickly without measuring every ingredient, because we've trained our taste.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      That training doesn't come from shortcuts.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      It comes from getting your hands and brain dirty.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      My Mindset as a Designer: Upskill in Every Direction
                    </h3>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      As a designer, I've always believed in pushing myself beyond a single skill. I try to learn a little bit of everything, design, motion, storytelling, tech, and now AI.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      That mindset led me to an opportunity at my workplace:<br/>
                      creating a game trailer for "Future Fab Heroes."
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      The requirement was simple:
                    </p>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-6 ml-8">
                      <li className="mb-2">Record gameplay clips</li>
                      <li className="mb-2">Edit them together</li>
                      <li className="mb-2">Add music on top</li>
                    </ul>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Done, right?
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      But I'm not wired that way.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      For me, simple doesn't mean careless.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Simple should still feel intentional, cinematic, and impactful.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      Cooking a Cinematic Game Trailer with AI
                    </h3>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Instead of treating it like a basic edit, I treated it like a recipe.
                    </p>

                    <h4 className="text-2xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-12">
                      The Ingredients (AI Tools)
                    </h4>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-12 ml-0">
                      <li className="mb-3"><strong className="text-white">Higgsfield</strong> — for cinematic motion and visuals</li>
                      <li className="mb-3"><strong className="text-white">ChatGPT</strong> — for ideation, structure, pacing, and narrative flow</li>
                      <li className="mb-3"><strong className="text-white">Gemini (Nano Banana)</strong> — for rapid experimentation and variations</li>
                      <li className="mb-3"><strong className="text-white">Traditional editing tools</strong>, for timing, rhythm, and polish</li>
                    </ul>

                    <h4 className="text-2xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-12">
                      The Process (The Real Learning)
                    </h4>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      I didn't magically get a cinematic trailer in one shot.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      I:
                    </p>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-6 ml-8">
                      <li className="mb-2">Experimented</li>
                      <li className="mb-2">Failed</li>
                      <li className="mb-2">Adjusted prompts</li>
                      <li className="mb-2">Refined visuals</li>
                      <li className="mb-2">Mixed and mastered like music production</li>
                    </ul>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      As a newbie to this level of AI blending, it took depth, patience, and iteration. And honestly?
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      I'm proud of that process more than the final output.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Because the real win wasn't the trailer, it was learning how to think with AI, not just use it.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      Prompting Is the New Language
                    </h3>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      When I built my portfolio website, the experience reinforced this belief even more.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      What once took:
                    </p>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-6 ml-8">
                      <li className="mb-2">Hours of designing</li>
                      <li className="mb-2">Developing</li>
                      <li className="mb-2">Debugging</li>
                      <li className="mb-2">Reworking</li>
                    </ul>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Now starts with a conversation.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Not because AI replaces thinking, but because prompting is becoming a language.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Just like:
                    </p>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-6 ml-8">
                      <li className="mb-2">Learning English</li>
                      <li className="mb-2">Learning any spoken language</li>
                    </ul>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      You don't memorize words, you learn how to express intent clearly.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Prompting is the same.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      The more fluent you become, the more naturally ideas flow from your mind into reality.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Instead of telling a developer or designer what to build, you're speaking directly to the system, guiding it, correcting it, shaping it.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      And the better you speak, the better it listens.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      Speed Comes After Taste
                    </h3>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      People often talk about AI in terms of speed.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      "Yes, it's faster."<br/>
                      "Yes, it saves time."
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      But speed without taste gives average results.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      The real professionals:
                    </p>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-6 ml-8">
                      <li className="mb-2">Train their eye</li>
                      <li className="mb-2">Train their taste</li>
                      <li className="mb-2">Train their intuition</li>
                    </ul>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      So they know:
                    </p>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-6 ml-8">
                      <li className="mb-2">When to push AI</li>
                      <li className="mb-2">When to pull back</li>
                      <li className="mb-2">When to keep things clean and simple</li>
                    </ul>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Just like cooking , you don't add every spice just because it's available.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      Final Thought
                    </h3>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      AI isn't here to make us lazy.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      It's here to challenge us to become better thinkers, better communicators, and better creators.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      If you treat AI like a microwave, you'll get fast but forgettable results.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      If you treat it like a kitchen, and yourself like a chef, you'll create work that actually hits.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      And just like cooking, the only way to get better is to keep experimenting, tasting, and refining.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-16">
                      That's how you really use AI like a pro. 🍳✨
                    </p>

                    <div className="mt-16 pt-8 border-t border-white/10 text-center">
                      <a
                        href={'externalLink' in selectedArticle ? selectedArticle.externalLink : selectedArticle.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium tracking-[0.02em] hover:-translate-y-1 transition-transform"
                      >
                        Read on Medium
                        <ArrowUpRight size={20} />
                      </a>
                    </div>
                  </article>
                ) : selectedArticle.title === "I used to think people chatting with AI about their emotions were doing it all wrong." ? (
                  <article 
                    className="prose prose-invert max-w-none"
                    onMouseEnter={() => setIsTextCursor(true)}
                    onMouseLeave={() => setIsTextCursor(false)}
                  >
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Now? I'm one of them.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      When I first heard folks were using ChatGPT like a therapist or digital best friend, my UX-trained brain cringed a little.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      "Seriously? Isn't this supposed to be a tool, not a diary?"
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      I thought of AI as an extension of my productivity stack, like Notion, Figma, or Google on steroids.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      But then something changed.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Out of curiosity (and let's be honest, burnout), I tried using it during a rough day.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Not for brainstorming. Not for code. Not for user flows.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Just to think out loud with a chatbot.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      But what started as an experiment turned into a habit, a surprisingly healthy one.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      Here's what I found:
                    </h3>
                    <ul className="list-none text-[#A7A7A7] text-lg leading-[1.7] mb-12 ml-0">
                      <li className="mb-3">🔹 When my thoughts spiraled, AI helped me reframe them.</li>
                      <li className="mb-3">🔹 When I overthought, it helped me simplify.</li>
                      <li className="mb-3">🔹 When I felt unsure, it didn't judge; it mirrored.</li>
                    </ul>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      It became a thinking partner, not because it's perfect, but because it slowed me down just enough to think clearly.
                    </p>

                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      I didn't replace human conversations. I just created space for self-conversation.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      And that made me wonder:
                    </h3>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Is this the next layer of UX?
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Not just designing interfaces, but designing how we think with interfaces?
                    </p>

                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      At a recent UX conference, Kate Moran said something brilliant:
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      "Treat AI like your UX intern, not your mentor."
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      That stuck with me.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-6">
                      Because AI should support our process, not dictate it.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      We, as humans, still hold the compass.
                    </p>

                    <h3 className="text-3xl font-semibold text-white tracking-[-0.02em] leading-[1.3] mb-6 mt-16">
                      So here's the point of view shift:
                    </h3>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      AI isn't just automating work; it's quietly reshaping how we process life.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      As UX designers, we need to be just as curious about how AI interacts with emotions, ethics, privacy, and reflection as we are about clicks and conversions.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      And maybe that's what the next chapter of UX is:
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      Not just solving problems, but understanding how people use tools to solve themselves.
                    </p>

                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-12">
                      If you've ever used AI to untangle thoughts, find perspective, or sanity-check your logic, you know what I'm talking about.
                    </p>
                    <p className="text-[#A7A7A7] text-lg leading-[1.7] mb-16">
                      If not, try it. You might end up learning something surprising.
                    </p>

                    <div className="mt-16 pt-8 border-t border-white/10 text-center">
                      <a
                        href="https://saharajan.medium.com/i-used-to-think-people-chatting-with-ai-about-their-emotions-were-doing-it-all-wrong-10a2e37b3e8b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium tracking-[0.02em] hover:-translate-y-1 transition-transform"
                      >
                        Read on Medium
                        <ArrowUpRight size={20} />
                      </a>
                    </div>
                  </article>
                ) : (
                  <iframe
                    src={selectedArticle.link}
                    className="w-full h-[600px] border-0 rounded-lg"
                    title={selectedArticle.title}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}