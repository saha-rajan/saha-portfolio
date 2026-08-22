import React, { useRef, useEffect } from 'react';

interface InteractiveDotGridProps {
  color?: string; // Target color when visible
  dotSize?: number;
  gap?: number;
  interactionRadius?: number;
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
}

export const InteractiveDotGrid: React.FC<InteractiveDotGridProps> = ({
  color = 'rgba(255, 255, 255, 0.4)', // The visible color
  dotSize = 1.5,
  gap = 20,
  interactionRadius = 200,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false, px: -1000, py: -1000, isTextLine: false });
  const dotsRef = useRef<Dot[]>([]);
  const animationFrameRef = useRef<number>();

  const parseRgba = (colorStr: string) => {
    const defaultRgba = [255, 255, 255, 1];
    if (!colorStr) return defaultRgba;
    if (colorStr.startsWith('#')) {
      const hex = colorStr.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b, 1];
    }
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        match[4] ? parseFloat(match[4]) : 1
      ];
    }
    return defaultRgba;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    // Detect mobile/touch
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If reduced motion or mobile, we don't start the animation at all
    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const rgba = parseRgba(color);
    
    // Physics constants
    const pullStrength = 1.6; // Pulls particles toward cursor
    const springFactor = 0.03; // Softer spring for fluid release
    const friction = 0.90; // Higher inertia for flowing stream
    const alphaFadeIn = 0.15;
    const alphaFadeOut = 0.02; // Slower fade for wake
    
    const initGrid = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const cols = Math.floor(width / gap);
      const rows = Math.floor(height / gap);
      const offsetX = (width - cols * gap) / 2;
      const offsetY = (height - rows * gap) / 2;

      dotsRef.current = [];
      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          dotsRef.current.push({
            x: offsetX + j * gap,
            y: offsetY + i * gap,
            ox: offsetX + j * gap,
            oy: offsetY + i * gap,
            vx: 0,
            vy: 0,
            alpha: 0,
            targetAlpha: 0,
          });
        }
      }
    };

    const drawGrid = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      
      // Calculate cursor velocity for directional flow
      const mouseVx = mouse.x - mouse.px;
      const mouseVy = mouse.y - mouse.py;
      // Cap speed to prevent explosion
      const cappedMouseVx = Math.max(-40, Math.min(40, mouseVx));
      const cappedMouseVy = Math.max(-40, Math.min(40, mouseVy));

      dots.forEach((dot) => {
        let isInfluenced = false;
        
        if (mouse.isActive) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          
          if (mouse.isTextLine) {
            // Blue line magnetic physics: a vertical line collector
            const lineHalfHeight = 40; 
            const dyClamped = Math.max(-lineHalfHeight, Math.min(lineHalfHeight, dy));
            const distToLine = Math.sqrt(dx * dx + (dy - dyClamped) * (dy - dyClamped));
            
            // Interaction radius for the line collector
            const lineRadius = interactionRadius * 0.85;
            
            if (distToLine < lineRadius) {
              isInfluenced = true;
              const force = Math.pow((lineRadius - distToLine) / lineRadius, 1.2);
              
              // Pull horizontally toward the line (negative dx direction)
              // Allow some velocity flow (pull particles along with the line)
              const moveForceX = (cappedMouseVx * force * 0.1) - (dx > 0 ? 1 : -1) * force * pullStrength * 1.5;
              const moveForceY = -(dy > 0 ? 1 : -1) * force * pullStrength * 0.2; // gentle vertical squeeze
              
              dot.vx += moveForceX;
              dot.vy += moveForceY;
              
              dot.targetAlpha = force;
            }
          } else {
            // Normal radial magnetic physics
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < interactionRadius) {
              isInfluenced = true;
              const force = Math.pow((interactionRadius - dist) / interactionRadius, 1.2);
              
              const angle = Math.atan2(dy, dx);
              // Pull toward cursor (-Math.cos, -Math.sin) + subtle drag in cursor direction
              const moveForceX = -Math.cos(angle) * force * pullStrength + (cappedMouseVx * force * 0.08);
              const moveForceY = -Math.sin(angle) * force * pullStrength + (cappedMouseVy * force * 0.08);
              
              dot.vx += moveForceX;
              dot.vy += moveForceY;
              
              dot.targetAlpha = force;
            }
          }
        }
        
        if (!isInfluenced) {
          dot.targetAlpha = 0;
        }

        // Spring back to original position
        const springX = (dot.ox - dot.x) * springFactor;
        const springY = (dot.oy - dot.y) * springFactor;
        dot.vx += springX;
        dot.vy += springY;
        
        // Apply friction (inertia)
        dot.vx *= friction;
        dot.vy *= friction;
        
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;
        
        // Update alpha (fade in fast, fade out slow for trail effect)
        if (dot.targetAlpha > dot.alpha) {
          dot.alpha += (dot.targetAlpha - dot.alpha) * alphaFadeIn;
        } else {
          dot.alpha += (dot.targetAlpha - dot.alpha) * alphaFadeOut;
        }

        // Only draw if visibly non-transparent (optimization)
        if (dot.alpha > 0.01) {
          let renderAlpha = dot.alpha;
          
          // Visual masking: hide particles that flow underneath the transparent circular cursor
          if (mouse.isActive && !mouse.isTextLine) {
            const dx = dot.x - mouse.x;
            const dy = dot.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const cursorRadius = 16;
            const featherZone = 8;
            const outerRadius = cursorRadius + featherZone;
            
            if (dist < outerRadius) {
              if (dist <= cursorRadius) {
                renderAlpha = 0; // Fully hidden inside cursor
              } else {
                // Feather smoothly from 0 to actual alpha
                const ratio = (dist - cursorRadius) / featherZone;
                renderAlpha *= ratio;
              }
            }
          }
          
          if (renderAlpha > 0.01) {
            // AIsle muted technical green
            // Map the particle's physical intensity to color saturation/lightness
            const intensity = Math.min(1, Math.max(0, dot.alpha));
            
            // Outer/barely revealed (intensity near 0) -> dark desaturated green-gray
            // Strongly attracted (intensity near 1) -> clear mild green (#7FAF9B family)
            const s = 5 + (25 * intensity);
            const l = 20 + (40 * intensity);
            
            ctx.fillStyle = `hsla(155, ${s}%, ${l}%, ${renderAlpha})`;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Update previous mouse pos
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      animationFrameRef.current = requestAnimationFrame(drawGrid);
    };

    initGrid();
    drawGrid();

    const handleResize = () => {
      initGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      
      if (
        clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom
      ) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        if (!mouseRef.current.isActive) {
          mouseRef.current.px = x;
          mouseRef.current.py = y;
        }
        
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.isActive = true;
        
        // Check if over text
        let isOverText = false;
        // Optimization: only check occasionally or when within bounds
        const elements = document.elementsFromPoint(clientX, clientY);
        for (const el of elements) {
          if (['H1', 'H2', 'H3', 'P', 'SPAN', 'A', 'BUTTON'].includes(el.tagName) || el.classList.contains('cursor-line-effect')) {
            isOverText = true;
            break;
          }
        }
        mouseRef.current.isTextLine = isOverText;
      } else {
        mouseRef.current.isActive = false;
      }
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color, dotSize, gap, interactionRadius]);

  return (
    <div 
      ref={wrapperRef} 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
};
