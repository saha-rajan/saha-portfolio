import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Move, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import robotImg from "figma:asset/f6768dc39512e7f0508e06a264f0361158314f01.png";
import sketchImg from "figma:asset/eb4fcc9f54db44a00e4be7b26ee721d1e3cc5cc2.png";
import gameLogoImg from "figma:asset/0aa009169e7b91ec3d1c260c0af7f996ec0ec4a2.png";
import futureFabLogo from "../../assets/future_fab_heroes_logo.png";
import trailerVideo from "../../assets/future_fab_heroes_trailer.mp4";
import video1 from "../../assets/video1.mp4";
import video2 from "../../assets/video2.mp4";
import video3 from "../../assets/video3.mp4";
import video4 from "../../assets/video4.mp4";
import video5 from "../../assets/video5.mp4";

// Studio images with rotation and closer positioning
const studioImages = [
  {
    id: 1,
    url: robotImg,
    label: "Spline 3D\nInteractive 3D Model",
    initialX: 200,
    initialY: 300,
    rotation: 3,
  },
  {
    id: 2,
    url: sketchImg,
    label: "After Effects\nLogo Animation",
    initialX: -350,
    initialY: -200,
    rotation: -6,
  },
  {
    id: 3,
    url: gameLogoImg,
    label: "Adobe Illustrator\nThumbnail Design",
    initialX: 850,
    initialY: -100,
    rotation: -5,
    backgroundColor: "#E5E5E5",
    size: "wide",
  },
  {
    id: 4,
    url: futureFabLogo,
    label: "Adobe Illustrator\nLogo Design",
    initialX: -800,
    initialY: 350,
    rotation: 6,
    backgroundColor: "#000000",
    size: "wide",
  },
  {
    id: 5,
    url: trailerVideo,
    label: "HIGGSFIELD · GEMINI · ELEVENLABS · CHATGPT · AFTER EFFECTS\nAI-Crafted Game Trailer",
    initialX: 100,
    initialY: -750,
    rotation: -3,
    backgroundColor: "#000000",
    size: "wide",
    isVideo: true,
  },
  {
    id: 6,
    url: video1,
    label: "🎬 VIDEO · VISUAL DIARY\nBoston, in Passing",
    initialX: -1100,
    initialY: -550,
    rotation: -4,
    backgroundColor: "#000000",
    size: "wide",
    isVideo: true,
  },
  {
    id: 7,
    url: video2,
    label: "🎬 VIDEO · CINEMATIC STUDY\nSomewhere Above Earth",
    initialX: 1300,
    initialY: 400,
    rotation: 5,
    backgroundColor: "#000000",
    size: "wide",
    isVideo: true,
  },
  {
    id: 8,
    url: video3,
    label: "🎬 VIDEO · SOUND + COLOR STUDY\nDinner Rush",
    initialX: -300,
    initialY: 850,
    rotation: -2,
    backgroundColor: "#000000",
    size: "wide",
    isVideo: true,
  },
  {
    id: 9,
    url: video4,
    label: "🎬 VIDEO · OBSERVATIONAL SHORT\nThe Seat Ahead",
    initialX: -1300,
    initialY: 50,
    rotation: 6,
    backgroundColor: "#000000",
    size: "wide",
    isVideo: true,
  },
  {
    id: 10,
    url: video5,
    label: "Google Antigravity + BLENDER EXPERIMENT\nGame Design · 3D Environment",
    initialX: 750,
    initialY: 800,
    rotation: -5,
    backgroundColor: "#000000",
    size: "wide",
    isVideo: true,
  },
];

interface ImageCardProps {
  image: typeof studioImages[0];
  onBringToFront: () => void;
  zIndex: number;
  onExpand?: () => void;
}

function ImageCard({ image, onBringToFront, zIndex, onExpand }: ImageCardProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas drag from starting
    onBringToFront();
  };

  const handleDragEnd = (e: any, info: any) => {
    // If it was just a tiny movement (a click), trigger expand
    if (image.isVideo && Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5) {
      if (onExpand) onExpand();
    }
  };

  // Determine size based on image.size property
  const isWide = image.size === "wide";
  const containerClass = isWide ? "w-80 h-48" : "w-48 h-48";

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: image.initialX, y: image.initialY, rotate: image.rotation }}
      whileHover={{ rotate: image.rotation + 3, scale: 1.05 }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      onMouseDown={handleMouseDown}
      onDragEnd={handleDragEnd}
      style={{
        position: "absolute",
        zIndex: zIndex,
        cursor: "grab",
        touchAction: "none", // Prevent touch scrolling on mobile
      }}
      className="group draggable-image"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="bg-white p-3 shadow-2xl rounded-sm hover:shadow-lg transition-shadow duration-200">
        <motion.div
          className={`${containerClass} overflow-hidden flex items-center justify-center relative cursor-pointer`}
          style={image.backgroundColor ? { backgroundColor: image.backgroundColor } : {}}
          onClick={() => { if (image.isVideo && onExpand) onExpand(); }}
        >
          {image.isVideo ? (
            <>
              <video
                src={image.url}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full ${isWide ? 'object-contain' : 'object-cover'} pointer-events-none select-none opacity-80 group-hover:opacity-100 transition-opacity`}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors pointer-events-none">
                <div className="bg-black/50 text-white rounded-full p-3 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                  <Play fill="white" size={20} className="ml-1" />
                </div>
              </div>
            </>
          ) : (
            <ImageWithFallback
              src={image.url}
              alt={image.label}
              className={`w-full h-full ${isWide ? 'object-contain' : 'object-cover'} pointer-events-none select-none`}
              draggable={false}
              style={image.objectPosition ? { objectPosition: image.objectPosition } : {}}
            />
          )}
        </motion.div>
        <div className="mt-3 flex flex-col items-center text-center font-mono">
          <span className="text-black/50 text-[10px] uppercase tracking-[0.2em] font-medium leading-relaxed max-w-[90%]">{image.label.split('\n')[0]}</span>
          <span className="text-black text-xs font-bold tracking-wider leading-relaxed mt-2">{image.label.split('\n')[1] || ''}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function StudioDetail() {
  const [imageOrder, setImageOrder] = useState(
    studioImages.map((img) => img.id)
  );
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [expandedVideoId, setExpandedVideoId] = useState<number | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Center the canvas initially
  useEffect(() => {
    // Center on the title (1500, 1250) in the 3000x2500 canvas
    const initialX = -(1500 - window.innerWidth / 2);
    const initialY = -(1250 - window.innerHeight / 2);
    setCanvasPosition({ x: initialX, y: initialY });
  }, []);

  const bringToFront = (id: number) => {
    setImageOrder((prevOrder) => {
      const filtered = prevOrder.filter((imgId) => imgId !== id);
      return [...filtered, id];
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only start canvas drag if clicking on the background (not on images)
    if ((e.target as HTMLElement).closest('.draggable-image')) {
      return;
    }
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCanvas) return;
    
    // Calculate new position
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;
    
    // Define boundaries (canvas is 3000x2500)
    const canvasWidth = 3000;
    const canvasHeight = 2500;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Constrain the position so canvas edges can't go beyond viewport edges
    const maxX = 0;
    const minX = -(canvasWidth - viewportWidth);
    const maxY = 0;
    const minY = -(canvasHeight - viewportHeight);
    
    // Apply boundaries
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    setCanvasPosition({ x: newX, y: newY });
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const handleCanvasMouseLeave = () => {
    setIsDraggingCanvas(false);
  };
  
  const expandedVideo = studioImages.find(img => img.id === expandedVideoId);

  return (
    <div 
      className={`relative w-full h-screen bg-[#000000] ${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}
      onMouseDown={!isMobile ? handleCanvasMouseDown : undefined}
      onMouseMove={!isMobile ? handleCanvasMouseMove : undefined}
      onMouseUp={!isMobile ? handleCanvasMouseUp : undefined}
      onMouseLeave={!isMobile ? handleCanvasMouseLeave : undefined}
      style={{ cursor: isMobile ? 'auto' : (isDraggingCanvas ? 'grabbing' : 'grab') }}
    >
      {/* Header with Back Button - Fixed position outside canvas */}
      <div className="fixed top-0 left-0 z-[1001] p-4 md:p-8 pointer-events-none">
        <Link to="/" className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 text-sm md:text-base"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Home</span>
          </motion.button>
        </Link>
      </div>

      {/* Large scrollable/draggable canvas */}
      <div 
        className="relative w-[3000px] h-[2500px]"
        style={{
          transform: isMobile ? 'none' : `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
          transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Dot Pattern Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Title - centered in viewport initially */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[0] text-center pointer-events-none">
          <h1
            className="text-2xl md:text-3xl font-light tracking-tight text-white italic mb-2"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Keep chasing
          </h1>
          <h1
            className="text-2xl md:text-3xl font-light tracking-tight text-white italic mb-6"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            curiosity through play
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
            <Move size={16} className="opacity-60" />
            <p
              className="uppercase tracking-widest"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Drag to move
            </p>
          </div>
        </div>

        {/* Draggable Images Canvas */}
        <div className="absolute top-1/2 left-1/2">
          {studioImages.map((image) => {
            const zIndex = imageOrder.indexOf(image.id);
            return (
              <ImageCard
                key={image.id}
                image={image}
                onBringToFront={() => bringToFront(image.id)}
                zIndex={zIndex}
                onExpand={image.isVideo ? () => setExpandedVideoId(image.id) : undefined}
              />
            );
          })}
        </div>
      </div>
      
      {/* Expanded Video Modal */}
      <AnimatePresence>
        {expandedVideoId !== null && expandedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer"
            onClick={() => setExpandedVideoId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()} // Prevent clicks on video from closing modal
            >
              <video
                src={expandedVideo.url}
                autoPlay
                controls
                className="w-full h-full object-contain"
              />
              <button 
                onClick={() => setExpandedVideoId(null)}
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
    </div>
  );
}