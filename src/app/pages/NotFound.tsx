import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { useChakku } from "../contexts/ChakkuContext";

export function NotFound() {
  const { startSession } = useChakku();

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto min-h-[70vh] flex flex-col justify-center items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Compass className="w-8 h-8 text-white/40" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">404</h1>
        <p className="text-xl text-white/60 mb-12">
          Looks like this coordinate doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
          <button 
            onClick={startSession}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/30 transition-all"
          >
            Ask Chakku
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <Link to="/works/aisle" className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
            <span className="block text-sm text-white/40 mb-1">Case Study</span>
            <span className="font-medium group-hover:text-white transition-colors">AIsle</span>
          </Link>
          <Link to="/works/chemobuddy" className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
            <span className="block text-sm text-white/40 mb-1">Case Study</span>
            <span className="font-medium group-hover:text-white transition-colors">ChemoBuddy</span>
          </Link>
          <Link to="/works/aura" className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
            <span className="block text-sm text-white/40 mb-1">Case Study</span>
            <span className="font-medium group-hover:text-white transition-colors">AURA</span>
          </Link>
          <Link to="/about" className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
            <span className="block text-sm text-white/40 mb-1">More info</span>
            <span className="font-medium group-hover:text-white transition-colors">About Saha</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
