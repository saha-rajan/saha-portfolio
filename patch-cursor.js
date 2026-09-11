import fs from 'fs';

let content = fs.readFileSync('src/app/pages/StudioDetail.tsx', 'utf-8');

// 1. Add imports
content = content.replace(
  /import \{ motion, AnimatePresence \} from "motion\/react";/,
  \`import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { useCursor } from "../contexts/CursorContext";\`
);

// 2. Add cursor hooks and state inside StudioDetail
const hookCode = \`  const { setHideCursor } = useCursor();
  
  // Custom local cursor
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 });
  
  useEffect(() => {
    // Hide the global cursor on this page
    setHideCursor(true);
    
    // Fallback cursor style for the body just in case
    document.body.style.cursor = 'none';
    
    return () => {
      setHideCursor(false);
      document.body.style.cursor = '';
    };
  }, [setHideCursor]);
  
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the 32x32 icon
      cursorY.set(e.clientY - 16);
    };
    const handleMouseDown = () => scale.set(0.7);
    const handleMouseUp = () => scale.set(1);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile, cursorX, cursorY, scale]);\`;

content = content.replace(
  /const \[isReady, setIsReady\] = useState\(false\);/,
  \`const [isReady, setIsReady] = useState(false);\n\n\` + hookCode
);

// 3. Render custom cursor and ensure cursor-none on root
content = content.replace(
  /<div className="relative w-full h-screen bg-\[#000000\] overflow-hidden overscroll-none touch-none">/,
  \`<div className="relative w-full h-screen bg-[#000000] overflow-hidden overscroll-none touch-none cursor-none">
      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] text-gray-400 opacity-80"
          style={{ x: cursorX, y: cursorY, scale: springScale }}
        >
          <Move size={32} />
        </motion.div>
      )}\`
);

// 4. Remove 'grab' and 'grabbing' inline styles from the framer motion wrapper since we use a custom cursor
content = content.replace(
  /style=\{\{ cursor: 'grab' \}\}\n\s+whileDrag=\{\{ cursor: 'grabbing' \}\}/,
  \`style={{ cursor: 'none' }}\n        whileDrag={{ cursor: 'none' }}\`
);

fs.writeFileSync('src/app/pages/StudioDetail.tsx', content);
