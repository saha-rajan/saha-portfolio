import fs from 'fs';

function replaceInFile(filepath, replacements) {
  let content = fs.readFileSync(filepath, 'utf-8');
  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }
  fs.writeFileSync(filepath, content);
}

// 1. Studio.tsx
replaceInFile('src/app/components/Studio.tsx', [
  [/py-24/g, 'py-16 md:py-24'],
  [/text-6xl md:text-8xl/g, 'text-4xl sm:text-6xl md:text-8xl'],
  [/max-w-2xl text-\[\#A7A7A7\] text-xl leading-relaxed/g, 'max-w-2xl text-[#A7A7A7] text-sm sm:text-base md:text-xl leading-relaxed']
]);

// 2. Write.tsx
replaceInFile('src/app/components/Write.tsx', [
  [/py-24/g, 'py-16 md:py-24'],
  [/text-6xl md:text-8xl/g, 'text-4xl sm:text-6xl md:text-8xl'],
  [/max-w-2xl text-\[\#A7A7A7\] text-xl leading-relaxed/g, 'max-w-2xl text-[#A7A7A7] text-sm sm:text-base md:text-xl leading-relaxed'],
  [/aspect-\[4\/5\]/g, 'aspect-square']
]);

// 3. Cinematics.tsx
replaceInFile('src/app/components/Cinematics.tsx', [
  [/py-24/g, 'py-16 md:py-24'],
  [/text-6xl md:text-8xl/g, 'text-4xl sm:text-6xl md:text-8xl'],
  [/max-w-2xl text-\[\#A7A7A7\] text-xl leading-relaxed/g, 'max-w-2xl text-[#A7A7A7] text-sm sm:text-base md:text-xl leading-relaxed'],
  [/grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-\[300px\]/g, 'grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 auto-rows-[160px] sm:auto-rows-[300px]'],
  [/text-white text-lg font-medium block leading-tight/g, 'text-white text-sm sm:text-lg font-medium block leading-tight'],
  [/text-\[\#A7A7A7\] text-sm/g, 'text-[#A7A7A7] text-xs sm:text-sm']
]);

// 4. Recommendations.tsx
replaceInFile('src/app/components/Recommendations.tsx', [
  [/py-24/g, 'py-16 md:py-24'],
  [/text-6xl md:text-8xl/g, 'text-4xl sm:text-6xl md:text-8xl'],
  [/max-w-2xl text-\[\#A7A7A7\] text-xl leading-relaxed/g, 'max-w-2xl text-[#A7A7A7] text-sm sm:text-base md:text-xl leading-relaxed'],
  [/w-20 h-20 rounded-full/g, 'w-16 h-16 sm:w-20 sm:h-20 rounded-full'],
  [/w-full h-full object-cover transition-all/g, 'w-full h-full object-cover object-top transition-all'],
  [/text-white text-2xl font-bold/g, 'text-white text-xl sm:text-2xl font-bold'],
  [/text-\[\#A7A7A7\] text-sm font-medium/g, 'text-[#A7A7A7] text-xs sm:text-sm font-medium'],
  [/text-\[\#666\] text-xs font-medium/g, 'text-[#666] text-[10px] sm:text-xs font-medium'],
  [/text-\[\#E5E5E5\] text-lg md:text-xl/g, 'text-[#E5E5E5] text-sm sm:text-base md:text-xl']
]);

// 5. Works.tsx
replaceInFile('src/app/components/Works.tsx', [
  [/py-24/g, 'py-16 md:py-24']
]);

