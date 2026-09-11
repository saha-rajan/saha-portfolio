const fs = require('fs');
const path = require('path');

const files = {
  'ChemoBuddyCaseStudy.tsx': { prev: '/works/arizona-yoga-studio', next: '/works/aura' },
  'AuraCaseStudy.tsx': { prev: '/works/chemobuddy', next: '/works/aisle' },
  'AIsleCaseStudy.tsx': { prev: '/works/aura', next: '/works/arizona-yoga-studio' },
  'ArizonaYogaCaseStudy.tsx': { prev: '/works/aisle', next: '/works/chemobuddy' }
};

for (const [filename, nav] of Object.entries(files)) {
  const filepath = path.join(__dirname, 'src/app/pages', filename);
  let content = fs.readFileSync(filepath, 'utf8');
  
  const commentIdx = content.lastIndexOf('{/* Bottom Navigation */}');
  if (commentIdx === -1) {
    console.log("Not found in", filename);
    continue;
  }
  
  const beforeNav = content.substring(0, commentIdx);
  let navBlock = content.substring(commentIdx);
  
  // Find the two 'to="/works/..."' strings inside navBlock
  const linkRegex = /to="\/works\/[^"]+"/g;
  const matches = [...navBlock.matchAll(linkRegex)];
  
  if (matches.length === 2) {
    navBlock = navBlock.replace(matches[0][0], `to="${nav.prev}"`);
    navBlock = navBlock.replace(matches[1][0], `to="${nav.next}"`);
    
    fs.writeFileSync(filepath, beforeNav + navBlock);
    console.log(`Updated ${filename}: prev=${nav.prev}, next=${nav.next}`);
  } else {
    console.log(`Expected 2 links in ${filename}, found ${matches.length}`);
  }
}
