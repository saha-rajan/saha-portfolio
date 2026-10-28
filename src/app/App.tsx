import { createBrowserRouter, RouterProvider, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { ChakkuProvider, ChakkuOverlay } from "./contexts/ChakkuContext";
import { CursorProvider } from "./contexts/CursorContext";
import { useCursor } from "./contexts/CursorContext";
import { Home } from "./pages/Home";
import { ChemoBuddyCaseStudy } from "./pages/ChemoBuddyCaseStudy";
import { ArizonaYogaCaseStudy } from "./pages/ArizonaYogaCaseStudy";
import { AuraCaseStudy } from "./pages/AuraCaseStudy";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { StudioDetail } from "./pages/StudioDetail";
import { AIsleCaseStudy } from "./pages/AIsleCaseStudy";
import Grid from "../imports/Grid";
import { isAnalyticsEnabled } from "./utils/analytics";

// Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

function Layout() {
  const location = useLocation();
  const isStudioPage = location.pathname === "/studio";
  const { setHideCursor } = useCursor();
  // Reset cursor visibility on route change UNLESS mouse is over a cursor-hide element
  useEffect(() => {
    const timer = setTimeout(() => {
      const x = (window as any).mouseX || 0;
      const y = (window as any).mouseY || 0;
      const elems = document.elementsFromPoint(x, y);
      const isOverHideElem = elems.some(
        (el) =>
          el.getAttribute("data-cursor-hide") === "true" ||
          el.closest('[data-cursor-hide="true"]') !== null
      );
      if (!isOverHideElem) {
        setHideCursor(false);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, setHideCursor]);

    // Track page views with Google Analytics and update Page Title
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
    
    const newTitle = pathTitles[location.pathname] || "Page Not Found | Saha's Portfolio";
    document.title = newTitle;

    // 2. Send to GA4
    if (window.gtag && isAnalyticsEnabled()) {
      window.gtag('config', 'G-9ZHMPW32L4', {
        page_path: location.pathname + location.search,
        page_title: newTitle
      });
    }
  }, [location]);

  return (
    <ChakkuProvider>
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative">
      <CustomCursor />

      {!isStudioPage && (
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="h-full overflow-hidden flex justify-center w-full">
            <Grid />
          </div>
        </div>
      )}

      <div className="relative z-10">
        {!isStudioPage && <Header />}
        <main>
          <Outlet />
        </main>
        {!isStudioPage && <Footer />}
      </div>

      </div>
      <ChakkuOverlay />
    </ChakkuProvider>
  );
}

import { RootErrorBoundary } from "./components/ErrorBoundary";
import { NotFound } from "./pages/NotFound";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/studio",
        element: <StudioDetail />,
      },
      {
        path: "/works/chemobuddy",
        element: <ChemoBuddyCaseStudy />,
      },
      {
        path: "/works/arizona-yoga-studio",
        element: <ArizonaYogaCaseStudy />,
      },
      {
        path: "/works/aura",
        element: <AuraCaseStudy />,
      },
      {
        path: "/works/aisle",
        element: <AIsleCaseStudy />,
      },
      {
        path: "/works/art-gallery",
        element: <Home />,
      },
      {
        path: "/works/e-commerce",
        element: <Home />,
      },
      // Aliases / Redirects
      {
        path: "/works/aio",
        element: <Navigate to="/works/aisle" replace />,
      },
      {
        path: "/works/chemo-buddy",
        element: <Navigate to="/works/chemobuddy" replace />,
      },
      {
        path: "/works/yoga",
        element: <Navigate to="/works/arizona-yoga-studio" replace />,
      },
      {
        path: "/resume",
        element: <Navigate to="/about" replace />,
      },
      {
        path: "/experience",
        element: <Navigate to="/about" replace />,
      },
      // Catch-all for 404
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    // Check for opt-out flag in URL
    if (window.location.search.includes('ignore_me=true')) {
      localStorage.setItem('ignore_analytics', 'true');
      alert('Analytics tracking successfully disabled for your browser!');
    }

    // Don't inject analytics (GA or Clarity) anywhere but the live site, or if ignored
    if (!isAnalyticsEnabled()) {
      console.log('Analytics disabled for this session.');
      return;
    }

    // Microsoft Clarity
    const clarityScript = document.createElement('script');
    clarityScript.innerHTML = `
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "yu1vjuk8wn");
    `;
    document.head.appendChild(clarityScript);

    // Load gtag.js script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-9ZHMPW32L4';
    document.head.appendChild(script1);

    // Initialize gtag
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-9ZHMPW32L4');
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(clarityScript);
    };
  }, []);

  return (
    <CursorProvider>
      <RouterProvider router={router} />
    </CursorProvider>
  );
}

export default App;