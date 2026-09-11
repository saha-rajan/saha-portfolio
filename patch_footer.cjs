const fs = require('fs');
const file = 'src/app/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { trackEvent }')) {
  content = content.replace(
    'import { motion } from "motion/react";',
    'import { motion } from "motion/react";\nimport { trackEvent } from "../utils/analytics";'
  );
  
  content = content.replace(
    'href="https://www.linkedin.com/in/saharajan/"',
    'href="https://www.linkedin.com/in/saharajan/" onClick={() => trackEvent("outbound_click", { link_name: "linkedin_footer" })}'
  );
  
  content = content.replace(
    'href="mailto:trajan2@asu.edu"',
    'href="mailto:trajan2@asu.edu" onClick={() => trackEvent("outbound_click", { link_name: "email_footer" })}'
  );

  fs.writeFileSync(file, content);
}
