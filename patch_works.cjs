const fs = require('fs');
const file = 'src/app/components/Works.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { trackEvent }')) {
  content = content.replace(
    'import { motion } from "motion/react";',
    'import { motion } from "motion/react";\nimport { trackEvent } from "../utils/analytics";'
  );
  
  content = content.replace(
    /<Link to={`\/works\/\${project.id}`} key={index} className={`\${project.size} block`}>/,
    `<Link 
              to={\`/works/\${project.id}\`} 
              key={index} 
              className={\`\${project.size} block\`}
              onClick={() => {
                trackEvent("select_case_study", {
                  project_id: project.id,
                  project_title: project.title
                });
              }}
            >`
  );
  fs.writeFileSync(file, content);
}
