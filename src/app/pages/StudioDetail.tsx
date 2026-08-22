import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Move } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import robotImg from "figma:asset/f6768dc39512e7f0508e06a264f0361158314f01.png";
import sketchImg from "figma:asset/eb4fcc9f54db44a00e4be7b26ee721d1e3cc5cc2.png";
import gameLogoImg from "figma:asset/0aa009169e7b91ec3d1c260c0af7f996ec0ec4a2.png";

// Studio images with rotation and closer positioning
const studioImages = [
  {
    id: 1,
    url: robotImg,
    label: "Spline 3D\nInteractive 3D Model",
    initialX: 0,
    initialY: 220,
    rotation: 3,
  },
  {
    id: 2,
    url: sketchImg,
    label: "After Effects\nLogo Animation",
    initialX: 420,
    initialY: 380,
    rotation: -6,
  },
  {
    id: 3,
    url: gameLogoImg,
    label: "Adobe Illustrator\nThumbnail Design",
    initialX: -680,
    initialY: 420,
    rotation: 8,
    backgroundColor: "#E5E5E5",
    size: "wide", // Use wider format to fit full logo
  },
];

interface ImageCardProps {
  image: typeof studioImages[0];
  onBringToFront: () => void;
  zIndex: number;
}

function ImageCard({ image, onBringToFront, zIndex }: ImageCardProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas drag from starting
    onBringToFront();
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
        <div
          className={`${containerClass} overflow-hidden flex items-center justify-center`}
          style={image.backgroundColor ? { backgroundColor: image.backgroundColor } : {}}
        >
          <ImageWithFallback
            src={image.url}
            alt={image.label}
            className={`w-full h-full ${isWide ? 'object-contain' : 'object-cover'} pointer-events-none select-none`}
            draggable={false}
            style={image.objectPosition ? { objectPosition: image.objectPosition } : {}}
          />
        </div>
        <div className="mt-2 text-black text-xs font-medium tracking-wider text-center font-mono whitespace-pre-line leading-relaxed">
          {image.label}
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] text-center pointer-events-none">
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
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}