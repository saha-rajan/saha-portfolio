import fs from 'fs';

let content = fs.readFileSync('src/app/pages/StudioDetail.tsx', 'utf-8');

// 1. Update ImageCardProps
content = content.replace(
  /interface ImageCardProps \{[\s\S]*?\}/,
  \`interface ImageCardProps {
  image: typeof studioImages[0];
  onBringToFront: () => void;
  zIndex: number;
  onExpand?: () => void;
  isMobile?: boolean;
}\`
);

// 2. Update ImageCard signature and body
content = content.replace(
  /function ImageCard\(\{ image, onBringToFront, zIndex, onExpand \}: ImageCardProps\) \{/,
  \`function ImageCard({ image, onBringToFront, zIndex, onExpand, isMobile }: ImageCardProps) {\`
);

content = content.replace(
  /const containerClass = isWide \? "w-80 h-48" : "w-48 h-48";/,
  \`const containerClass = isWide ? "w-64 md:w-80 h-40 md:h-48" : "w-36 md:w-48 h-36 md:h-48";\`
);

content = content.replace(
  /initial=\{\{ x: image\.initialX, y: image\.initialY, rotate: image\.rotation \}\}/,
  \`initial={{ 
        x: isMobile ? image.initialX * 0.5 : image.initialX, 
        y: isMobile ? image.initialY * 0.5 : image.initialY, 
        rotate: image.rotation 
      }}\`
);

content = content.replace(
  /text-\[10px\] uppercase/,
  \`text-[8px] md:text-[10px] uppercase\`
);

content = content.replace(
  /text-xs font-bold/,
  \`text-[10px] md:text-xs font-bold\`
);

// 3. Update root container classes to prevent pull-to-refresh
content = content.replace(
  /className="relative w-full h-screen bg-\[#000000\] overflow-hidden"/,
  \`className="relative w-full h-screen bg-[#000000] overflow-hidden overscroll-none touch-none"\`
);

// 4. Scale down center text
content = content.replace(
  /text-2xl md:text-3xl font-light tracking-tight text-white italic mb-2/g,
  \`text-xl md:text-3xl font-light tracking-tight text-white italic mb-2\`
);
content = content.replace(
  /text-2xl md:text-3xl font-light tracking-tight text-white italic mb-6/g,
  \`text-xl md:text-3xl font-light tracking-tight text-white italic mb-6\`
);

// 5. Pass isMobile to ImageCard
content = content.replace(
  /<ImageCard\n\s+key=\{image\.id\}\n\s+image=\{image\}\n\s+onBringToFront=\{.*\n\s+zIndex=\{zIndex\}\n\s+onExpand=\{.*\n\s+\/>/g,
  (match) => match.replace('/>', 'isMobile={isMobile}\n              />')
);

fs.writeFileSync('src/app/pages/StudioDetail.tsx', content);
