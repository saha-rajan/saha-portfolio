import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const routes = [
  { name: 'fintech-dashboard', url: 'http://localhost:5173/works/fintech-dashboard' },
  { name: 'arizona-yoga-studio', url: 'http://localhost:5173/works/arizona-yoga-studio' },
  { name: 'zylker', url: 'http://localhost:5173/works/zylker' },
];

const outputDir = path.join(process.cwd(), 'case-studies-pdf-v2');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // High quality for retina-like rendering
  });

  for (const route of routes) {
    console.log(`Generating PDF for ${route.name}...`);
    const page = await context.newPage();

    // Set a timeout to wait for the page to load
    await page.goto(route.url, { waitUntil: 'networkidle' });

    // 1. Hide fixed UI elements that obscure content or look bad in print
    await page.addStyleTag({
      content: `
        header, 
        .fixed, 
        [aria-label="Scroll to top"],
        .loading-screen { 
          display: none !important; 
        }
      `
    });

    // 2. Automatically scroll to the bottom to trigger framer-motion animations
    // and lazy-loaded assets.
    console.log(`Scrolling ${route.name} to trigger animations...`);
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait a few seconds for all animations to settle and images to load
    await page.waitForTimeout(3000);

    // Scroll back to top before printing to ensure first page starts correctly
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    const pdfPath = path.join(outputDir, `${route.name}.pdf`);
    await page.pdf({
      path: pdfPath,
      width: '1440px', // Set width to match viewport for better layout fidelity
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
      preferCSSPageSize: true
    });

    console.log(`Saved ${pdfPath}`);
    await page.close();
  }

  await browser.close();
  console.log('PDF generation complete!');
})();
