const fs = require('fs');
const filepath = 'src/app/pages/ChemoBuddyCaseStudy.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const navBlockStart = content.indexOf('{/* Bottom Navigation */}');
const navBlock = content.substring(navBlockStart);
const beforeNav = content.substring(0, navBlockStart);

const linkRegex = /to="\/works\/([^"]+)"/g;
let matches = [...navBlock.matchAll(linkRegex)];

if (matches.length >= 2) {
  // Currently matches[0] is aura, matches[1] is arizona-yoga-studio.
  // We want to swap them.
  let newNavBlock = navBlock;
  // Let's just do an exact string replace to be safe.
  newNavBlock = newNavBlock.replace('to="/works/aura"', 'to="/works/arizona-yoga-studio-TEMP"');
  newNavBlock = newNavBlock.replace('to="/works/arizona-yoga-studio"', 'to="/works/aura"');
  newNavBlock = newNavBlock.replace('to="/works/arizona-yoga-studio-TEMP"', 'to="/works/arizona-yoga-studio"');
  
  fs.writeFileSync(filepath, beforeNav + newNavBlock);
  console.log("Fixed ChemoBuddyCaseStudy.tsx!");
} else {
  console.log("Could not find links");
}
