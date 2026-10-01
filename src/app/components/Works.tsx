import chemoVideo from '../../assets/Chemo thumbnail.mp4';
import { motion } from "motion/react";
import { trackEvent } from "../utils/analytics";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCursor } from "../contexts/CursorContext";
import auraVideo from '../../assets/Aura thumbnail.mp4';

import talentVaultVideo from '../../assets/talentVault_logo.mp4';

const projects = [
  {
    id: "chemobuddy",
    title: "Chemotherapy education platform",
    category: "In collaboration with Mayo Clinic",
    video: chemoVideo,
    size: "col-span-1 md:col-span-1 md:row-span-2",
  },
  {
    id: "aura",
    title: "AURA - FEEL THE ROOM",
    category: "UX Case Study",
    video: auraVideo,
    size: "col-span-1 md:col-span-1 md:row-span-1",
  },
  {
    id: "talentvault",
    title: "TalentVault",
    category: "Coming Soon",
    video: talentVaultVideo,
    size: "col-span-1 md:col-span-2 md:row-span-1",
  },
  {
    id: "art-gallery",
    title: "Art Gallery",
    category: "Brand Identity",
    image: "https://images.unsplash.com/photo-1697899001862-59699946ea29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNkJTIwZ2VvbWV0cmljJTIwYXJ0JTIwZGFya3xlbnwxfHx8fDE3NjY5NTIyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    size: "col-span-1 md:col-span-1 md:row-span-1",
  },
];

export function Works() {
  const { setCursorMode, setCursorText } = useCursor();
  return (
    <section id="works" className="relative py-16 md:py-24 bg-black overflow-hidden">
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
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="mb-16">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">SELECTED WORKS</h2>
            <span className="text-[#A7A7A7] hidden md:block">(2024 — 2025)</span>
          </div>
          <p className="text-[#A7A7A7] max-w-xl">
            A curated selection of UX and research projects from academic to real-world collaboration.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 auto-rows-[160px] sm:auto-rows-[300px]">
          {projects.map((project, index) => {
            const cardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer overflow-hidden h-full w-full bg-[#111]"
              >
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full transition-transform duration-700 object-cover group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                
                {project.id === 'talentvault' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xl bg-black/60">
                    <div className="flex flex-col items-center justify-center max-w-[95%] sm:max-w-[85%] text-center">
                      <div className="flex items-center justify-center px-4 pt-[6px] pb-[4px] mb-4 rounded-full border border-white/40 bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white font-semibold leading-none" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                          Currently Under Wraps
                        </span>
                      </div>
                      
                      <p className="text-[#E0E0E0] text-[11px] sm:text-xs md:text-sm leading-[1.7] sm:leading-[1.8] mb-4 sm:mb-6">
                        I’m building TalentVault from 0<span className="relative bottom-[1.5px] mx-[2px]">→</span>1 as a founding designer. The work is confidential, but I can walk through selected decisions and process privately with permission.
                      </p>

                      <a 
                        href="mailto:trajan2@asu.edu?subject=Request for TalentVault Case Study" 
                        onClick={(e) => { e.stopPropagation(); trackEvent("request_case_study", { project: "talentvault" }); }}
                        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-black/40 border border-[#1CB4F5]/40 text-[#1CB4F5] hover:bg-[#1CB4F5]/10 hover:border-[#1CB4F5] hover:shadow-[0_0_15px_rgba(28,180,245,0.2)] transition-all duration-300 group/link"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide">
                          Case study available upon request
                        </span>
                        <ArrowUpRight size={14} className="transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                       <div className="bg-white text-black p-3 rounded-full">
                          <ArrowUpRight size={20} />
                       </div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black via-black/50 to-transparent">
                      <h3 className="text-base sm:text-2xl font-medium mb-1 text-white">{project.title}</h3>
                      <p className="text-[#A7A7A7] text-[10px] sm:text-sm uppercase tracking-wider">{project.category}</p>
                    </div>
                  </>
                )}
              </motion.div>
            );

            return project.id === 'talentvault' ? (
              <div key={index} className={`${project.size} block`} data-no-text-cursor="true">
                {cardContent}
              </div>
            ) : (
              <Link 
                to={`/works/${project.id}`} 
                key={index} 
                className={`${project.size} block`}
                onMouseEnter={() => {
                  setCursorMode('project');
                  setCursorText('View\nProject');
                }}
                onMouseLeave={() => {
                  setCursorMode('default');
                  setCursorText('');
                }}
                onClick={() => {
                  trackEvent("select_case_study", {
                    project_id: project.id,
                    project_title: project.title
                  });
                }}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}