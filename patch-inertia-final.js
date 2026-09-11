import fs from 'fs';

const content = fs.readFileSync('src/app/pages/StudioDetail.tsx', 'utf-8');

// We want to replace everything from `export function StudioDetail() {` down to `  return (` (before the return)
const startIdx = content.indexOf('export function StudioDetail() {');
const returnIdx = content.indexOf('  return (', startIdx);
if (startIdx === -1 || returnIdx === -1) {
  console.log("Could not find start or return");
  process.exit(1);
}

const beforeCode = content.slice(0, startIdx);
const afterCode = content.slice(returnIdx);

const newLogic = \`export function StudioDetail() {
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

\`;

// Now let's fix the return statement.
// Find the closing of the root div.
// The root div ends at `</div>` before `{/* Expanded Video Modal */}`? No, the root div wraps everything.
// Let's just do a regex replace on the returned JSX.

let updatedAfterCode = afterCode.replace(
  /<div \n      className="relative w-full h-screen bg-\[#000000\] overflow-hidden overscroll-none touch-none"[\s\S]*?style=\{\{ cursor: isDraggingCanvas \? 'grabbing' : 'grab' \}\}\n    >/,
  '<div className="relative w-full h-screen bg-[#000000] overflow-hidden overscroll-none touch-none">'
);

updatedAfterCode = updatedAfterCode.replace(
  /<div \n        className="relative w-\[3000px\] h-\[2500px\]"\n        style=\{\{\n          transform: `translate\(\$\{canvasPosition\.x\}px, \$\{canvasPosition\.y\}px\)`,\n          transition: isDraggingCanvas \? 'none' : 'transform 0\.1s ease-out',\n        \}\}\n      >/,
  \`<motion.div 
        className="relative w-[3000px] h-[2500px]"
        drag
        dragMomentum={true}
        dragElastic={0.1}
        dragConstraints={dragConstraints}
        initial={{ x: initialPos.x, y: initialPos.y }}
        style={{ cursor: 'grab' }}
        whileDrag={{ cursor: 'grabbing' }}
      >\`
);

// We need to change the closing `</div>` of the canvas to `</motion.div>`
updatedAfterCode = updatedAfterCode.replace(
  /        <\/div>\n      <\/div>\n      \n      \{\/\* Expanded Video Modal \*\/\}/,
  '        </div>\n      </motion.div>\n      \n      {/* Expanded Video Modal */}'
);

fs.writeFileSync('src/app/pages/StudioDetail.tsx', beforeCode + newLogic + updatedAfterCode);
