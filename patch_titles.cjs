const fs = require('fs');
const file = 'src/app/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `  // Track page views with Google Analytics and update Page Title
  useEffect(() => {
    // 1. Update document title dynamically based on route
    const pathTitles: Record<string, string> = {
      "/": "Saha's Portfolio",
      "/about": "About | Saha's Portfolio",
      "/contact": "Contact | Saha's Portfolio",
      "/studio": "Studio | Saha's Portfolio",
      "/works/chemobuddy": "Chemo Buddy Case Study | Saha's Portfolio",
      "/works/arizona-yoga-studio": "Arizona Yoga Case Study | Saha's Portfolio",
      "/works/aura": "AURA Case Study | Saha's Portfolio",
      "/works/aisle": "AIsle Case Study | Saha's Portfolio",
    };
    
    const newTitle = pathTitles[location.pathname] || "Saha's Portfolio";
    document.title = newTitle;

    // 2. Send to GA4
    if (window.gtag && window.location.hostname !== 'localhost' && localStorage.getItem('ignore_analytics') !== 'true') {
      window.gtag('config', 'G-9ZHMPW32L4', {
        page_path: location.pathname + location.search,
        page_title: newTitle
      });
    }
  }, [location]);`;

// Replace the existing tracking useEffect
content = content.replace(
  /\/\/ Track page views with Google Analytics[\s\S]*?\}, \[location\]\);/,
  replacement
);

fs.writeFileSync(file, content);
console.log("Patched titles!");
