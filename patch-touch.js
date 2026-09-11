import fs from 'fs';

let content = fs.readFileSync('src/app/pages/StudioDetail.tsx', 'utf-8');

// Insert touch handlers after handleCanvasMouseLeave
const mouseEndRegex = /const handleCanvasMouseLeave = \(\) => \{\n    setIsDraggingCanvas\(false\);\n  \};/;
const touchHandlers = \`const handleCanvasMouseLeave = () => {
    setIsDraggingCanvas(false);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.draggable-image')) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.touches[0].clientX - canvasPosition.x, y: e.touches[0].clientY - canvasPosition.y });
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingCanvas) return;
    
    let newX = e.touches[0].clientX - dragStart.x;
    let newY = e.touches[0].clientY - dragStart.y;
    
    const canvasWidth = 3000;
    const canvasHeight = 2500;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const maxX = 0;
    const minX = -(canvasWidth - viewportWidth);
    const maxY = 0;
    const minY = -(canvasHeight - viewportHeight);
    
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    setCanvasPosition({ x: newX, y: newY });
  };

  const handleCanvasTouchEnd = () => {
    setIsDraggingCanvas(false);
  };\`;

content = content.replace(mouseEndRegex, touchHandlers);

// Replace parent div render
const parentRegex = /<div \n      className=\{\`relative w-full h-screen bg-\[#000000\] \$\{isMobile \? 'overflow-auto' : 'overflow-hidden'\}\`\}\n      onMouseDown=\{!isMobile \? handleCanvasMouseDown : undefined\}\n      onMouseMove=\{!isMobile \? handleCanvasMouseMove : undefined\}\n      onMouseUp=\{!isMobile \? handleCanvasMouseUp : undefined\}\n      onMouseLeave=\{!isMobile \? handleCanvasMouseLeave : undefined\}\n      style=\{\{ cursor: isMobile \? 'auto' : \(isDraggingCanvas \? 'grabbing' : 'grab'\) \}\}\n    >/;

const newParent = \`<div 
      className="relative w-full h-screen bg-[#000000] overflow-hidden"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseLeave}
      onTouchStart={handleCanvasTouchStart}
      onTouchMove={handleCanvasTouchMove}
      onTouchEnd={handleCanvasTouchEnd}
      style={{ cursor: isDraggingCanvas ? 'grabbing' : 'grab' }}
    >\`;

content = content.replace(parentRegex, newParent);

// Replace transform logic
const transformRegex = /style=\{\{\n          transform: isMobile \? 'none' : \`translate\(\$\{canvasPosition\.x\}px, \$\{canvasPosition\.y\}px\)\`,\n          transition: isDraggingCanvas \? 'none' : 'transform 0\.1s ease-out',\n        \}\}/;

const newTransform = \`style={{
          transform: \\\`translate(\${canvasPosition.x}px, \${canvasPosition.y}px)\\\`,
          transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out',
        }}\`;

content = content.replace(transformRegex, newTransform);

fs.writeFileSync('src/app/pages/StudioDetail.tsx', content);
