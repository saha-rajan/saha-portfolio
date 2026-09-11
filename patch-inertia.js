import fs from 'fs';

let content = fs.readFileSync('src/app/pages/StudioDetail.tsx', 'utf-8');

// Replace everything from `export function StudioDetail` down to `<div className="absolute inset-0"`
const regex = /export function StudioDetail\(\) \{[\s\S]*?\{ \/\* Dot Pattern Background \*\/\}/;

const newCode = \`export function StudioDetail() {
  const [imageOrder, setImageOrder] = useState(
    studioImages.map((img) => img.id)
  );
  
  const [isMobile, setIsMobile] = useState(false);
  const [expandedVideoId, setExpandedVideoId] = useState<number | null>(null);

  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouchDevice || isSmallScreen);

      const canvasWidth = 3000;
      const canvasHeight = 2500;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      setDragConstraints({
        top: -(canvasHeight - viewportHeight),
        left: -(canvasWidth - viewportWidth),
        right: 0,
        bottom: 0,
      });
      
      if (!isReady) {
        setInitialPos({
          x: -(1500 - viewportWidth / 2),
          y: -(1250 - viewportHeight / 2)
        });
        setIsReady(true);
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isReady]);

  const bringToFront = (id: number) => {
    setImageOrder((prevOrder) => {
      const filtered = prevOrder.filter((imgId) => imgId !== id);
      return [...filtered, id];
    });
  };

  const expandedVideo = studioImages.find(img => img.id === expandedVideoId);

  if (!isReady) return null;

  return (
    <div className="relative w-full h-screen bg-[#000000] overflow-hidden overscroll-none touch-none">
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
      <motion.div 
        className="relative w-[3000px] h-[2500px]"
        drag
        dragMomentum={true}
        dragElastic={0.1}
        dragConstraints={dragConstraints}
        initial={{ x: initialPos.x, y: initialPos.y }}
        style={{ cursor: 'grab' }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {/* Dot Pattern Background */}\`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/app/pages/StudioDetail.tsx', content);
