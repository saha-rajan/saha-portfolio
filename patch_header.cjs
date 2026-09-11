const fs = require('fs');
const file = 'src/app/components/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { trackEvent }')) {
  content = content.replace(
    'import { motion, AnimatePresence } from "motion/react";',
    'import { motion, AnimatePresence } from "motion/react";\nimport { trackEvent } from "../utils/analytics";'
  );
  
  content = content.replace(
    /href="https:\/\/drive\.google\.com\/file\/d\/1F9BM2hwJhAVcU_wmbbkOZkHrrbLJzVXB\/view\?usp=sharing"/g,
    'href="https://drive.google.com/file/d/1F9BM2hwJhAVcU_wmbbkOZkHrrbLJzVXB/view?usp=sharing" onClick={() => trackEvent("download_resume", { link_name: "resume_header" })}'
  );
  
  // Also track the contact link click
  content = content.replace(
    'to="/contact"\n            className="relative',
    'to="/contact"\n            onClick={() => trackEvent("navigation_click", { destination: "/contact" })}\n            className="relative'
  );

  fs.writeFileSync(file, content);
}
