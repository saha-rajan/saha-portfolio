import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NotFound } from "../pages/NotFound";
import Grid from "../../imports/Grid";
import { ChakkuProvider, ChakkuOverlay } from "../contexts/ChakkuContext";

export function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ChakkuProvider>
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative">
          <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
            <div className="h-full overflow-hidden flex justify-center w-full">
              <Grid />
            </div>
          </div>
          <div className="relative z-10">
            <Header />
            <main>
              <NotFound />
            </main>
            <Footer />
          </div>
        </div>
        <ChakkuOverlay />
      </ChakkuProvider>
    );
  }

  // Handle generic errors gracefully
  return (
    <ChakkuProvider>
      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative">
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="h-full overflow-hidden flex justify-center w-full">
            <Grid />
          </div>
        </div>
        <div className="relative z-10">
          <Header />
          <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto min-h-[70vh] flex flex-col justify-center items-center text-center">
            <div className="max-w-2xl">
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Something went wrong</h1>
              <p className="text-xl text-white/60 mb-12">
                An unexpected error occurred. Don't worry, you can always head back home.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return Home
                </Link>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <ChakkuOverlay />
    </ChakkuProvider>
  );
}
