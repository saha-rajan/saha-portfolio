import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface HighlightOnScrollProps {
  children: React.ReactNode;
  delay?: number;
}

export function HighlightOnScroll({ children, delay = 0 }: HighlightOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  return (
    <span ref={ref} className="relative inline-block">
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isVisible ? 1 : 0 }}
        transition={{
          duration: 0.6,
          delay: delay,
          ease: "easeOut",
        }}
        className="absolute bg-white/80 origin-left z-0 inset-0"
        style={{ 
          transformOrigin: "left center",
          willChange: "transform",
        }}
      />
      <span className={`relative z-10 ${isVisible ? "text-black" : ""} transition-colors duration-300`}>
        {children}
      </span>
    </span>
  );
}