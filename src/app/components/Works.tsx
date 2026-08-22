import chemoVideo from '../../assets/Chemo thumbnail.mp4';
import image_a77d1db12e8df8c86d603cb5d79ce40f7ba0c131 from 'figma:asset/a77d1db12e8df8c86d603cb5d79ce40f7ba0c131.png';
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import auraVideo from '../../assets/Aura thumbnail.mp4';

import arizonaYogaVideo from '../../assets/Arizona yoga.mp4';

const projects = [
  {
    id: "fintech-dashboard",
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
    id: "arizona-yoga-studio",
    title: "Arizona Yoga Studio",
    category: "UX / UI Design",
    video: arizonaYogaVideo,
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
  return (
    <section id="works" className="relative py-24 bg-black overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {projects.map((project, index) => (
            <Link to={`/works/${project.id}`} key={index} className={`${project.size} block`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative group cursor-pointer overflow-hidden h-full w-full ${project.id === 'arizona-yoga-studio' ? 'bg-white' : 'bg-[#111]'}`}
              >
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full transition-transform duration-700 ${
                      project.id === 'arizona-yoga-studio' ? 'object-contain scale-125 group-hover:scale-[1.30]' : 'object-cover group-hover:scale-105'
                    }`}
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                   <div className="bg-white text-black p-3 rounded-full">
                      <ArrowUpRight size={20} />
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black via-black/50 to-transparent">
                  <h3 className="text-2xl font-medium mb-1 text-white">{project.title}</h3>
                  <p className="text-[#A7A7A7] text-sm uppercase tracking-wider">{project.category}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}