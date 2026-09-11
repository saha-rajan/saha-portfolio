const fs = require('fs');

// 1. Patch analytics.ts
const analyticsFile = 'src/app/utils/analytics.ts';
const analyticsContent = `
export const isAnalyticsEnabled = () => {
  if (typeof window === "undefined") return false;
  if (window.location.hostname === "localhost") return false;
  if (localStorage.getItem("ignore_analytics") === "true") return false;
  return true;
};

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (!isAnalyticsEnabled()) {
    console.log(\`[Analytics Disabled] \${eventName}\`, eventParams);
    return;
  }
  
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  } else {
    console.warn(\`Analytics not loaded. Event: \${eventName}\`, eventParams);
  }
};
`;
fs.writeFileSync(analyticsFile, analyticsContent);

// 2. Patch App.tsx
const appFile = 'src/app/App.tsx';
let appContent = fs.readFileSync(appFile, 'utf8');

// Replace Layout useEffect
appContent = appContent.replace(
  /if \(window\.gtag\) \{\n\s*window\.gtag\('config', 'G-9ZHMPW32L4', \{\n\s*page_path: location\.pathname \+ location\.search,\n\s*\}\);\n\s*\}/,
  `if (window.gtag && window.location.hostname !== 'localhost' && localStorage.getItem('ignore_analytics') !== 'true') {
      window.gtag('config', 'G-9ZHMPW32L4', {
        page_path: location.pathname + location.search,
      });
    }`
);

// Replace App useEffect
appContent = appContent.replace(
  /function App\(\) \{\n\s*\/\/ Initialize Google Analytics\n\s*useEffect\(\(\) => \{/,
  `function App() {
  // Initialize Google Analytics
  useEffect(() => {
    // Check for opt-out flag in URL
    if (window.location.search.includes('ignore_me=true')) {
      localStorage.setItem('ignore_analytics', 'true');
      alert('Analytics tracking successfully disabled for your browser!');
    }

    // Don't inject analytics if on localhost or if ignored
    if (window.location.hostname === 'localhost' || localStorage.getItem('ignore_analytics') === 'true') {
      console.log('Analytics disabled for this session.');
      return;
    }`
);

fs.writeFileSync(appFile, appContent);
console.log("Patched App.tsx and analytics.ts successfully!");
