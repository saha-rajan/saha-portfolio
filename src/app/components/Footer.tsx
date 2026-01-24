import svgPaths from "../../imports/svg-cxqqlnkn3m";
import { useCursor } from "../contexts/CursorContext";
import { useState } from "react";
import { motion } from "motion/react";

export function Footer() {
  const { setHideCursor } = useCursor();
  const [linkedInPosition, setLinkedInPosition] = useState({ x: 0, y: 0 });
  const [emailPosition, setEmailPosition] = useState({ x: 0, y: 0 });
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkedInMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 12;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setLinkedInPosition({ x: clampedX, y: clampedY });
  };

  const handleEmailMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 12;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setEmailPosition({ x: clampedX, y: clampedY });
  };

  const handleArrowMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxMove = 12;
    const clampedX = Math.max(-maxMove, Math.min(maxMove, x * 0.25));
    const clampedY = Math.max(-maxMove, Math.min(maxMove, y * 0.25));
    
    setArrowPosition({ x: clampedX, y: clampedY });
  };

  return (
    <footer className="relative bg-black border-t border-[#333] mt-24 overflow-hidden">
      {/* 6-Column Grid Background - Center Aligned - Double Lines */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-full max-w-[1200px] h-full flex justify-between px-8 md:px-16 lg:px-24">
          {/* Desktop: 7 columns - double lines for middle, single for first/last */}
          <div className="hidden lg:flex w-full h-full justify-between">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex gap-[16px]">
                {i === 0 || i === 6 ? (
                  // First and last: single line
                  <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                ) : (
                  // Middle: double lines
                  <>
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Tablet: 4 columns - double lines for middle, single for first/last */}
          <div className="hidden md:flex lg:hidden w-full h-full justify-between">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-[16px]">
                {i === 0 || i === 3 ? (
                  // First and last: single line
                  <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                ) : (
                  // Middle: double lines
                  <>
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                    <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile: 2 columns - all single lines */}
          <div className="flex md:hidden w-full h-full justify-between">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 md:px-16 lg:px-24 py-24">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-10 items-center">
            <div className="flex gap-3 items-center text-xl font-medium text-white">
              <span>.</span>
              <a 
                href="https://www.linkedin.com/in/saharajan/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-3 rounded-md hover:bg-[#282834] transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setHideCursor(true)}
                onMouseLeave={() => {
                  setHideCursor(false);
                  setLinkedInPosition({ x: 0, y: 0 });
                }}
                onMouseMove={handleLinkedInMouseMove}
              >
                <motion.span
                  className="inline-block"
                  animate={{ x: linkedInPosition.x, y: linkedInPosition.y }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    mass: 0.5
                  }}
                >
                  LinkedIn
                </motion.span>
              </a>
            </div>
            <div className="flex gap-3 items-center text-xl font-medium text-white">
              <span>.</span>
              <a 
                href="mailto:trajan2@asu.edu" 
                className="px-6 py-3 rounded-md hover:bg-[#282834] transition-all duration-300 relative z-50 overflow-hidden"
                onMouseEnter={() => setHideCursor(true)}
                onMouseLeave={() => {
                  setHideCursor(false);
                  setEmailPosition({ x: 0, y: 0 });
                }}
                onMouseMove={handleEmailMouseMove}
              >
                <motion.span
                  className="inline-block"
                  animate={{ x: emailPosition.x, y: emailPosition.y }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    mass: 0.5
                  }}
                >
                  Email
                </motion.span>
              </a>
            </div>
          </div>

          <button 
            onClick={scrollToTop}
            className="px-6 py-3 rounded-md hover:bg-[#282834] transition-all duration-300 overflow-hidden"
            aria-label="Back to top"
            onMouseEnter={() => setHideCursor(true)}
            onMouseLeave={() => {
              setHideCursor(false);
              setArrowPosition({ x: 0, y: 0 });
            }}
            onMouseMove={handleArrowMouseMove}
          >
            <motion.div
              className="inline-block"
              animate={{ x: arrowPosition.x, y: arrowPosition.y }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                mass: 0.5
              }}
            >
              <div className="flex-none rotate-90">
                <div className="w-[17.42px] h-[30.32px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4214 30.3204">
                    <path d={svgPaths.p2d439d20} fill="white" id="Icon / chevron.left" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </button>
        </div>

        <div className="mt-24 flex flex-col md:flex-row justify-between items-center text-sm text-[#555]">
          <p className="cursor-line-effect">© 2025 THIRUVENKATA SAHA. ALL RIGHTS RESERVED.</p>
          <p className="cursor-line-effect">DESIGNED & DEVELOPED WITH CARE BY SAHA.</p>
        </div>
      </div>
    </footer>
  );
}