import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCursor } from "../contexts/CursorContext";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Clock, Zap, Target, Layout, Lightbulb, TrendingUp, ChevronUp } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import coverImage from "figma:asset/785d89a3ac623ee45faf4a42fac0f9f199ae2858.png";
import landingPageImage from "figma:asset/7622e63e23f27b0cbf0f04c71888d259d848aa87.png";
import homeDashboardImage from "figma:asset/1f1cc0939e19a34d75c2ddef2501cfc17729176e.png";
import formBuilderImage from "figma:asset/ea3f5ef74fc2a6f94906fa7dd050502ebf479cde.png";
import formBuilderScreenshot from "figma:asset/7f80c2ea6f22eceea8c1db5b2eb0a5acad9e3a61.png";
import formBuilderDetailImage from "figma:asset/845c1f770cd68d8be84e2423488899fee5fd0d3c.png";
import propertiesPanelImage from "figma:asset/d5b774c1c67ee9ca8af9e5bf15ffa8e5d6d81858.png";
import responsivePreviewImage from "figma:asset/f242ba518de941ac55b663efaf5c845385f3431b.png";

export function ZylkerCaseStudy() {
  const { setHideCursor } = useCursor();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-black min-h-screen text-[#A7A7A7] font-['IBM_Plex_Mono'] selection:bg-white selection:text-black">
      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        onMouseEnter={() => setHideCursor(true)}
        onMouseLeave={() => setHideCursor(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
          pointerEvents: showScrollTop ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-28 right-8 z-[10000] w-16 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#282834] hover:border-transparent hover:scale-110 transition-all duration-300"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </motion.button>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="max-w-[1190px] mx-auto">
          <div className="flex flex-col gap-8 mb-12">
            <div className="flex justify-between items-start">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}
                >
                  Zylker — Form Builder
                </motion.h1>
                <p className="text-xl text-[#A7A7A7] mb-6" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>A 2-Day UI/UX Design Challenge</p>
                <span className="inline-block border border-white/20 rounded-full px-4 py-1 text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  2023
                </span>
              </div>
              
              {/* Prev/Next Navigation */}
              <div className="hidden md:flex gap-4">
                <Link to="/works/arizona-yoga-studio" className="p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors">
                  <ArrowLeft size={20} />
                </Link>
                <Link to="/works/fintech-dashboard" className="p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors">
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-black p-8 md:p-16"
          >
            <ImageWithFallback 
              src={coverImage} 
              alt="Zylker Form Builder Interface" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Project Overview
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            <p className="text-lg md:text-xl text-[#A7A7A7] leading-relaxed mb-6" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              This project was a 2-day design challenge focused on reimagining an enterprise form builder experience. 
              Within a limited timeframe, the goal was to design a clear, scalable, and intuitive interface that supports both quick form creation and advanced configurations.
            </p>
            <p className="text-lg md:text-xl text-[#A7A7A7] leading-relaxed" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              The challenge emphasized speed, clarity, and practical decision-making, simulating real-world constraints.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Challenge Brief */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Challenge Brief
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div 
                className="border border-white/10 rounded-lg p-8 bg-[#0A0A0A] hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                onMouseEnter={() => setHideCursor(true)}
                onMouseLeave={() => setHideCursor(false)}
              >
                <Target className="text-white mb-4" size={32} />
                <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Redesign the form-building experience for better usability
                </p>
              </div>
              <div 
                className="border border-white/10 rounded-lg p-8 bg-[#0A0A0A] hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                onMouseEnter={() => setHideCursor(true)}
                onMouseLeave={() => setHideCursor(false)}
              >
                <Zap className="text-white mb-4" size={32} />
                <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Improve clarity and efficiency within a complex enterprise tool
                </p>
              </div>
              <div 
                className="border border-white/10 rounded-lg p-8 bg-[#0A0A0A] hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                onMouseEnter={() => setHideCursor(true)}
                onMouseLeave={() => setHideCursor(false)}
              >
                <Clock className="text-white mb-4" size={32} />
                <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Deliver high-fidelity screens and an interactive prototype in 2 days
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Constraints */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Constraints
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Limited time for in-depth user research
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  No access to real user data or usability testing
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Focus on core workflows over edge cases
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* My Role */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              My Role
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            <p className="text-2xl text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Solo UI/UX Designer
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Rapid problem analysis
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Information architecture
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Interaction & UI design
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  High-fidelity screens & prototype
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Approach (2-Day Breakdown)
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Day 1 */}
              <div 
                className="border border-white/10 rounded-lg p-8 bg-[#0A0A0A] hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                onMouseEnter={() => setHideCursor(true)}
                onMouseLeave={() => setHideCursor(false)}
              >
                <h3 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
                  Day 1 — Understand & Structure
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Analyzed the existing form builder flow
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Identified key pain points and usability gaps
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Defined primary user goals and core workflows
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Sketched layout ideas and reworked information hierarchy
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div 
                className="border border-white/10 rounded-lg p-8 bg-[#0A0A0A] hover:bg-[#282834] hover:border-transparent transition-all cursor-pointer"
                onMouseEnter={() => setHideCursor(true)}
                onMouseLeave={() => setHideCursor(false)}
              >
                <h3 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
                  Day 2 — Design & Prototype
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Designed high-fidelity UI screens
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Established a lightweight style guide
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Focused on consistency and scalability
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Created an interactive prototype to demonstrate flows
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Decisions */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Design Decisions
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            
            <div className="space-y-12">
              {/* Simplified Information Architecture */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="text-white" size={24} />
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
                    Simplified Information Architecture
                  </h3>
                </div>
                <div className="space-y-3 pl-9">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Grouped related actions and properties
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Reduced visual clutter using progressive disclosure
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Prioritized frequently used actions
                    </p>
                  </div>
                </div>
              </div>

              {/* Clear Builder Layout */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Layout className="text-white" size={24} />
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
                    Clear Builder Layout
                  </h3>
                </div>
                <div className="space-y-3 pl-9">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Separated canvas, controls, and properties
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Maintained context while editing form elements
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Enabled faster scanning and interaction
                    </p>
                  </div>
                </div>
              </div>

              {/* Scalable Visual System */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-white" size={24} />
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
                    Scalable Visual System
                  </h3>
                </div>
                <div className="space-y-3 pl-9">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Neutral color palette for enterprise clarity
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      System font (SF Pro) for readability and speed
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                    <p className="text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                      Modular components to support future expansion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Screens Section */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Key Screens
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
          </motion.div>

          {/* Landing Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Landing Page
            </h3>
            <p className="text-lg text-[#A7A7A7] mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              Introduces the form builder with a clear overview and directs users toward primary actions.
            </p>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <ImageWithFallback
                src={landingPageImage}
                alt="Landing Page"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Home Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Home Dashboard
            </h3>
            <p className="text-lg text-[#A7A7A7] mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              Displays all forms in a structured layout, enabling quick access, creation, and management.
            </p>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <ImageWithFallback
                src={homeDashboardImage}
                alt="Home Dashboard"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* New Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              New Form
            </h3>
            <p className="text-lg text-[#A7A7A7] mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              Provides a frictionless starting point, allowing users to begin building immediately.
            </p>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <ImageWithFallback 
                src={coverImage}
                alt="New Form"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Form Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Form Builder
            </h3>
            <p className="text-lg text-[#A7A7A7] mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              The core experience, designed to support drag-and-drop creation, real-time updates, and flexible customization.
            </p>
            <div className="rounded-lg overflow-hidden border border-white/10 mb-8">
              <ImageWithFallback 
                src={formBuilderImage}
                alt="Form Builder"
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <ImageWithFallback 
                src={formBuilderDetailImage}
                alt="Form Builder - Client Details Form"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Properties Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Properties Panel
            </h3>
            <p className="text-lg text-[#A7A7A7] mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              Allows users to edit field-level settings without breaking focus, with advanced options revealed only when needed.
            </p>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <ImageWithFallback 
                src={propertiesPanelImage}
                alt="Properties Panel"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Responsive Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Responsive Preview
            </h3>
            <p className="text-lg text-[#A7A7A7] mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              Enables users to preview forms across devices, ensuring consistency and usability.
            </p>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <ImageWithFallback 
                src={responsivePreviewImage}
                alt="Responsive Preview"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Outcome */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Outcome
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            <p className="text-lg text-[#A7A7A7] mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
              Within 2 days, the challenge resulted in:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  A complete end-to-end form builder flow
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  High-fidelity screens covering core use cases
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  A scalable visual and interaction system
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  An interactive prototype demonstrating key workflows
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Learnings */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
        <div className="max-w-[1190px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.02em' }}>
              Key Learnings
            </h2>
            <div className="h-px w-full bg-white/10 mb-12"></div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Prioritization is critical under time constraints
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Clear structure can simplify complex tools quickly
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-2"></div>
                <p className="text-lg text-[#A7A7A7]" style={{ fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1.7' }}>
                  Designing for scalability early saves future rework
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="px-6 md:px-12 max-w-[1440px] mx-auto pb-16">
        <div className="max-w-[1190px] mx-auto">
          <div className="h-px w-full bg-white/10 mb-6"></div>
          <div className="flex justify-end items-center gap-4">
            <Link 
              to="/works/arizona-yoga-studio" 
              className="p-3 border border-white/10 rounded-full hover:bg-[#282834] hover:border-transparent transition-all duration-300"
              onMouseEnter={() => setHideCursor(true)}
              onMouseLeave={() => setHideCursor(false)}
            >
              <ArrowLeft size={20} />
            </Link>
            <Link 
              to="/works/fintech-dashboard" 
              className="p-3 border border-white/10 rounded-full hover:bg-[#282834] hover:border-transparent transition-all duration-300"
              onMouseEnter={() => setHideCursor(true)}
              onMouseLeave={() => setHideCursor(false)}
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}