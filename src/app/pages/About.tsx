import image_13fbe3cb33bdd866c42f89a0b63321c6153dd542 from 'figma:asset/13fbe3cb33bdd866c42f89a0b63321c6153dd542.png';
import image_66f1cfabc87c947bb58e037d695220d1fd8de505 from 'figma:asset/66f1cfabc87c947bb58e037d695220d1fd8de505.png';
import image_e16bb5934b0b8c4b4d6bf543f2e95291a282bfe9 from 'figma:asset/e16bb5934b0b8c4b4d6bf543f2e95291a282bfe9.png';
import image_96d9f4d876a0debf676876e6df51ce08332049bb from 'figma:asset/96d9f4d876a0debf676876e6df51ce08332049bb.png';
import { motion } from "motion/react";
import { Target, LayoutTemplate, Layers, Zap, Search, Film, Ruler, Compass, Box } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import exampleImage from 'figma:asset/d7cd4901bed9632d30e81d9850f60137bc81d369.png';
import travelingImage from 'figma:asset/5b4dbed0b99d9df47d017f509831a22af398669e.png';
import runningImage from 'figma:asset/4df6f63d00c92b74769d085a5b796694512ebfd5.png';
import photographyImage from 'figma:asset/4b74c7191b16e212fdb64d80d604ce557692fb93.png';

const experience = [
  {
    role: "Media Production Design Intern",
    company: "Ira A. Fulton Schools of Engineering at ASU",
    period: "Jan 2026 — Present",
    image: image_96d9f4d876a0debf676876e6df51ce08332049bb,
  },
  {
    role: "Student Assistant IV - Design & Media Production",
    company: "Ira A. Fulton Schools of Engineering at ASU",
    period: "Sep 2025 — Jan 2026",
    image: image_96d9f4d876a0debf676876e6df51ce08332049bb,
  },
  {
    role: "User Experience Designer",
    company: "Cycatz",
    period: "Aug 2024 — Oct 2024",
    image: image_e16bb5934b0b8c4b4d6bf543f2e95291a282bfe9,
  },
  {
    role: "Product Design Intern",
    company: "Aspire India",
    period: "Mar 2024 — Apr 2024",
    image: image_66f1cfabc87c947bb58e037d695220d1fd8de505,
  },
  {
    role: "Internship Trainee",
    company: "Chennai Architects",
    period: "Jan 2022 — Jul 2022",
    image: image_13fbe3cb33bdd866c42f89a0b63321c6153dd542,
  },
];

const expertise = [
  { title: "Product Strategy", description: "Defining the why and how.", icon: Target },
  { title: "UI/UX Design", description: "Crafting intuitive interfaces.", icon: LayoutTemplate },
  { title: "Design Systems", description: "Scalable design language.", icon: Layers },
  { title: "Prototyping", description: "Bringing ideas to life.", icon: Zap },
  { title: "User Research", description: "Understanding the user.", icon: Search },
  { title: "Motion Design", description: "Adding life to interaction.", icon: Film },
];

const hobbies = [
  {
    title: "Traveling",
    description: "Capturing light and shadows in urban environments.",
    image: travelingImage,
    className: "md:col-span-2 md:row-span-2"
  },
  {
    title: "Hiking & Nature",
    description: "Finding peace in the mountains.",
    image: "https://images.unsplash.com/photo-1611072374888-cf7b657b84de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzY3MTIxNjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "Running",
    description: "Finding balance and strength in motion.",
    image: runningImage,
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "Gaming",
    description: "Immersive storytelling and competitive play.",
    image: "https://images.unsplash.com/photo-1658423594131-870bc585a9f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1lY2hhbmljYWwlMjBrZXlib2FyZCUyMGdhbWluZyUyMG1pbmltYWxpc3QlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDF8fHx8MTc2NzEyMTY1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "Coffee Brewing",
    description: "The art of the perfect pour over.",
    image: "https://images.unsplash.com/photo-1636897723338-044840ff6d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmV3aW5nJTIwY29mZmVlJTIwcG91ciUyMG92ZXIlMjBtaW5pbWFsaXN0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NjcxMjE2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "Photography",
    description: "Capturing moments through the lens.",
    image: photographyImage,
    className: "md:col-span-1 md:row-span-1"
  }
];

const testimonials = [
  {
    quote: "One of the most talented designers I've worked with. He brings a unique perspective to every project.",
    name: "Sarah Jenkins",
    role: "Product Director at TechFlow",
    image: "https://images.unsplash.com/photo-1701286842710-5f37edc4b8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NjcxMjEwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    quote: "His attention to detail is unmatched. The design system he built saved us months of development time.",
    name: "David Chen",
    role: "CTO at StartupX",
    image: "https://images.unsplash.com/photo-1670881391783-9c55ba592f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzY3MTIxMDA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const architectureLessons = [
  {
    title: "Structural Integrity",
    description: "Just like a building needs a strong foundation, an app needs a robust information architecture.",
    icon: Box
  },
  {
    title: "Circulation & Flow",
    description: "In architecture we plan paths. In product design, we map user flows. The goal is the same: intuitive navigation.",
    icon: Compass
  },
  {
    title: "Measure Twice",
    description: "Precision matters. The difference between good and great design often lies in the smallest details.",
    icon: Ruler
  }
];

export function About() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto">
      {/* Hero Section */}
      <section className="mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-[20px]"
        >
          ABOUT ME
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:text-2xl text-[#A7A7A7] max-w-3xl leading-relaxed text-[16px]"
        >
          I am a multidisciplinary designer focusing on digital experiences. 
          My work sits at the intersection of design, technology, and storytelling.
        </motion.p>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
        {/* Left Column - Image Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="aspect-[3/4] bg-[#111] rounded-lg overflow-hidden relative"
        >
            <img 
              src={exampleImage} 
              alt="Portrait" 
              className="object-cover w-full h-full grayscale opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
        </motion.div>

        {/* Right Column - Bio & Experience */}
        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">BACKGROUND</h3>
            <p className="text-[#A7A7A7] leading-relaxed mb-6">
              With a background in computer science and visual arts, I approach design with a systematic yet creative mindset. 
              I believe in creating interfaces that are not just functional but also emotionally resonant.
            </p>
            <p className="text-[#A7A7A7] leading-relaxed">
              Over the years, I've had the privilege of working with diverse clients, from early-stage startups to established brands, helping them define their digital presence through clear, impactful design.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-8 text-white">EXPERIENCE</h3>
            <div className="space-y-6">
              {experience.map((job, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
                    <img src={job.image} alt={job.company} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium group-hover:text-gray-300 transition-colors">{job.role}</h4>
                    <p className="text-[#A7A7A7] text-sm">{job.company}</p>
                  </div>
                  <span className="text-[#A7A7A7] text-sm">{job.period}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Architecture to Product Transition Section */}
      <section className="mb-32">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold mb-12 text-white"
        >
          FROM ARCHITECTURE TO PRODUCT
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <p className="text-[#A7A7A7] text-lg leading-relaxed mb-6">
              Before I designed pixels, I designed spaces. My journey began in the world of architecture, where I learned that design isn't just about aesthetics—it's about how people inhabit and move through a space.
            </p>
            <p className="text-[#A7A7A7] text-lg leading-relaxed">
              I realized that the principles of physical architecture—structure, circulation, and materiality—apply directly to digital environments. I traded concrete for code, but the core mission remains: building functional, human-centric systems.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
             <div className="aspect-[3/4] bg-[#111] rounded-lg overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1759178387128-a15f01a7de6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBtaW5pbWFsaXN0JTIwYnVpbGRpbmclMjBjb25jcmV0ZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzY3MTI0ODI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                 alt="Architecture" 
                 className="w-full h-full object-cover opacity-80"
               />
             </div>
             <div className="aspect-[3/4] bg-[#111] rounded-lg overflow-hidden mt-8">
               <img 
                 src="https://images.unsplash.com/photo-1721132537184-5494c01ed87f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwYmx1ZXByaW50JTIwc2tldGNoJTIwcGxhbiUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzY3MTI0ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                 alt="Blueprint" 
                 className="w-full h-full object-cover opacity-80"
               />
             </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {architectureLessons.map((lesson, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="bg-[#0A0A0A] border border-[#222] p-8 rounded-lg"
             >
               <lesson.icon className="w-8 h-8 text-white mb-6" strokeWidth={1.5} />
               <h4 className="text-white font-bold mb-4">{lesson.title}</h4>
               <p className="text-[#A7A7A7] text-sm leading-relaxed">{lesson.description}</p>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Expertise Section */}
      <section className="mb-32">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold mb-12 text-white"
        >
          MY EXPERTISE
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertise.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, backgroundColor: "#1A1A1A" }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 border border-[#333] bg-[#111] rounded-xl group cursor-default transition-colors"
            >
              <div className="mb-6 p-4 bg-black w-fit rounded-lg border border-[#222] group-hover:border-white/20 transition-colors">
                <item.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl text-white font-medium mb-3">{item.title}</h4>
              <p className="text-base text-[#A7A7A7] leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hobbies / Beyond Work Section */}
      <TooltipProvider>
        <section className="mb-32">
            <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-bold mb-12 text-white"
            >
            LIFE OUTSIDE WORK
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px]">
            {hobbies.map((hobby, index) => (
                <Tooltip key={index}>
                <TooltipTrigger asChild>
                    <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative overflow-hidden rounded-xl bg-[#111] border border-[#333] group cursor-none ${hobby.className}`}
                    >
                    <img 
                        src={hobby.image} 
                        alt={hobby.title} 
                        className={`w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ${hobby.title === "Traveling" ? "object-[center_30%]" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium text-lg">{hobby.title}</span>
                    </div>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#111] border border-[#333] text-white px-4 py-2">
                    <p className="font-medium text-sm">{hobby.description}</p>
                </TooltipContent>
                </Tooltip>
            ))}
            </div>
        </section>
      </TooltipProvider>

      {/* Testimonials Section */}
      {/* <section className="mb-32">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold mb-12 text-white"
        >
          WHAT THEY SAY
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] p-8 border-l-2 border-[#333]"
            >
              <p className="text-lg text-[#D1D1D1] mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover grayscale"
                />
                <div>
                  <h5 className="text-white font-medium text-sm">{testimonial.name}</h5>
                  <p className="text-[#666] text-xs uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}
    </div>
  );
}