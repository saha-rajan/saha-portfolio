import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Move } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import stadiumImg from "figma:asset/52e72f7f24face51a30e9ed8ff5decf4a50e33b0.png";
import trainImg from "figma:asset/b474af98e1d63545706e7c867b42b273c1082b34.png";
import templeImg from "figma:asset/bf6fd2939af9d160aa611142701aca102f95d363.png";
import snowImg from "figma:asset/85f960d44b7c54823bcc93531dae6ad9e4882932.png";
import treesImg from "figma:asset/55bfe0101e96a98d8a7c7168e32a60e2aeacd571.png";
import caveImg from "figma:asset/912f021086eadca18bd8ec27a8a3ac1edab53796.png";
import summitImg from "figma:asset/0902b04f5fc0e540c92f6ef607c657c406d37641.png";
import sunsetGroupImg from "figma:asset/95585d9e4e6f09563cedbcf4a6df7d8b7b815103.png";
import ruinsImg from "figma:asset/d9d716885d3713e59390a871b546d6bc28a83b5e.png";
import cityscapeImg from "figma:asset/f09489f05dcb966ee77164e8c38c226188416055.png";
import couchImg from "figma:asset/cad4184cff8840002e85f65ffcdc73ce6af50493.png";
import wandererImg from "figma:asset/525ffd42988a5dbf06571117b0185795ce32938f.png";
import dockImg from "figma:asset/3ab3a0b5b6c78b968bcb4e1569ae06e2668ad8fd.png";
import apartmentImg from "figma:asset/9edae7bdf697fd739e6338ffc1d8c17dcb6943b9.png";
import roadImg from "figma:asset/fdbd17a90a42563c09b2c9e5e2c036bcf1d8ddfa.png";
import curryImg from "figma:asset/900d717f07264980831c076350c2772e04adef61.png";
import dinerImg from "figma:asset/b2ac0a4dddeca58515e3fc8c4c5af3d994f1a661.png";
import innoutImg from "figma:asset/172678394c3bc5d4970475d82d460382c8d48a8a.png";
import busImg from "figma:asset/791ae484c129ff9b243fb763b59cfef810a00ab0.png";
import robotImg from "figma:asset/f6768dc39512e7f0508e06a264f0361158314f01.png";
import sketchImg from "figma:asset/eb4fcc9f54db44a00e4be7b26ee721d1e3cc5cc2.png";
import gameLogoImg from "figma:asset/0aa009169e7b91ec3d1c260c0af7f996ec0ec4a2.png";

// Studio images with rotation and closer positioning
const studioImages = [
  {
    id: 1,
    url: stadiumImg,
    label: "STADIUM",
    initialX: -680,
    initialY: -420,
    rotation: -8,
  },
  {
    id: 2,
    url: trainImg,
    label: "TWILIGHT",
    initialX: 620,
    initialY: -280,
    rotation: 12,
  },
  {
    id: 3,
    url: templeImg,
    label: "TEMPLE",
    initialX: -320,
    initialY: 480,
    rotation: -5,
  },
  {
    id: 4,
    url: snowImg,
    label: "WINTER",
    initialX: 520,
    initialY: 520,
    rotation: 8,
  },
  {
    id: 5,
    url: treesImg,
    label: "SKYWARD",
    initialX: -820,
    initialY: 120,
    rotation: 6,
  },
  {
    id: 6,
    url: caveImg,
    label: "DEPTHS",
    initialX: 780,
    initialY: -520,
    rotation: -12,
  },
  {
    id: 7,
    url: summitImg,
    label: "SUMMIT",
    initialX: -120,
    initialY: -620,
    rotation: 4,
  },
  {
    id: 8,
    url: sunsetGroupImg,
    label: "HORIZON",
    initialX: 720,
    initialY: 280,
    rotation: -6,
  },
  {
    id: 9,
    url: ruinsImg,
    label: "EXPLORE",
    initialX: -580,
    initialY: -180,
    rotation: 10,
  },
  {
    id: 10,
    url: cityscapeImg,
    label: "VISTA",
    initialX: 320,
    initialY: -480,
    rotation: -4,
  },
  {
    id: 11,
    url: couchImg,
    label: "PAUSE",
    initialX: -420,
    initialY: 620,
    rotation: 7,
  },
  {
    id: 12,
    url: wandererImg,
    label: "WANDERER",
    initialX: -920,
    initialY: -320,
    rotation: -10,
    objectPosition: "center bottom", // Maximum downward positioning
  },
  {
    id: 13,
    url: dockImg,
    label: "SOLITUDE",
    initialX: 880,
    initialY: 80,
    rotation: 5,
  },
  {
    id: 14,
    url: apartmentImg,
    label: "TRANSIT",
    initialX: 120,
    initialY: 680,
    rotation: -7,
  },
  {
    id: 15,
    url: roadImg,
    label: "JOURNEY",
    initialX: -680,
    initialY: -680,
    rotation: 9,
  },
  {
    id: 16,
    url: curryImg,
    label: "CURRY",
    initialX: -1000,
    initialY: 1000,
    rotation: 15,
  },
  {
    id: 17,
    url: dinerImg,
    label: "DINER",
    initialX: 1000,
    initialY: 1000,
    rotation: -15,
  },
  {
    id: 18,
    url: innoutImg,
    label: "INNOUT",
    initialX: -1000,
    initialY: -1000,
    rotation: 20,
    objectPosition: "center top", // Maximum upward positioning to show face
  },
  {
    id: 19,
    url: busImg,
    label: "BUS",
    initialX: 1000,
    initialY: -1000,
    rotation: -20,
  },
  {
    id: 20,
    url: robotImg,
    label: "ROBOT",
    initialX: 0,
    initialY: 220,
    rotation: 3,
  },
  {
    id: 21,
    url: sketchImg,
    label: "AFTER EFFECTS",
    initialX: 420,
    initialY: 380,
    rotation: -6,
  },
  {
    id: 22,
    url: gameLogoImg,
    label: "GAME",
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
        <div className="mt-2 text-black text-xs font-medium tracking-wider text-center font-mono">
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