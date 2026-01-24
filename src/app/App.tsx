import { createBrowserRouter, RouterProvider, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { LoadingScreen } from "./components/LoadingScreen";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { CursorProvider } from "./contexts/CursorContext";
import { Home } from "./pages/Home";
import { ChemoBuddyCaseStudy } from "./pages/ChemoBuddyCaseStudy";
import { ArizonaYogaCaseStudy } from "./pages/ArizonaYogaCaseStudy";
import { ZylkerCaseStudy } from "./pages/ZylkerCaseStudy";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { StudioDetail } from "./pages/StudioDetail";
import Grid from "../imports/Grid";

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
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // Track page views with Google Analytics
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-9ZHMPW32L4', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onLoadingComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

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

      {/* <VoiceAssistant /> */}
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
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
        path: "/works/fintech-dashboard",
        element: <ChemoBuddyCaseStudy />,
      },
      {
        path: "/works/arizona-yoga-studio",
        element: <ArizonaYogaCaseStudy />,
      },
      {
        path: "/works/zylker",
        element: <ZylkerCaseStudy />,
      },
      {
        path: "/works/art-gallery",
        element: <Home />,
      },
      {
        path: "/works/e-commerce",
        element: <Home />,
      },
    ],
  },
]);

function App() {
  // Initialize Google Analytics
  useEffect(() => {
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
    };
  }, []);

  return (
    <CursorProvider>
      <RouterProvider router={router} />
    </CursorProvider>
  );
}

export default App;