const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldScroll = `          case 'SCROLL_TO':
            if (args.sectionId === 'hero' || args.sectionId === 'top') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (args.sectionId === 'bottom') {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
              const el = document.getElementById(args.sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              else success = false;
            }`;

const newScroll = `          case 'SCROLL_TO':
            if (args.sectionId === 'hero' || args.sectionId === 'top') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (args.sectionId === 'bottom') {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
              const cleanId = String(args.sectionId).toLowerCase().trim().replace(/\\s+/g, '-');
              const el = document.getElementById(cleanId) || document.getElementById(args.sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              else success = false;
            }`;

content = content.replace(oldScroll, newScroll);
fs.writeFileSync(file, content);
console.log("Safe scroll applied!");
