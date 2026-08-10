import { motion } from "motion/react";
import { Linkedin } from "lucide-react";
import cameronImage from "../../assets/cameron_burridge.png";
import tamaraImage from "../../assets/tamara_gligoric.png";

const recommendations = [
  {
    name: "Cameron Burridge",
    title: "Asst Game Programmer",
    org: "Ira A. Fulton Schools of Engineering, Arizona State University",
    tagline: "Cameron managed Thiruvenkata Saha directly",
    content: [
      "I really enjoy working with Thiruvenkata Saha Rajan as a Media Production Design Assistant. He's an incredibly creative person with a strong eye for detail, and he brings that care into everything he works on. What stood out to me most was his willingness to take on any project, no matter how different or challenging it was, and his positive attitude while doing it.",
      "Thiruvenkata is great at taking feedback and genuinely using it to improve his work. He doesn't get stuck on critique—he listens, adapts, and makes thoughtful changes that strengthen the final result. He's also a quick learner and was always open to picking up new skills and tools as needed. He would be a great addition to any creative or media production team."
    ],
    image: cameronImage,
    linkedin: "https://www.linkedin.com/in/cameron-burridge/"
  },
  {
    name: "Tamara Gligoric",
    title: "Project Coordinator",
    org: "Southwest Advanced Prototyping (SWAP) Hub at Arizona State University",
    tagline: "Tamara managed Thiruvenkata Saha directly",
    content: [
      "I've had the pleasure of working with Saha as our student worker for Media Production at ASU's SWAP Hub, and he has been an incredible asset to our team. Saha has contributed to a wide range of projects, including a promotional trailer, presentations, flyers, front-end website UI, and other digital media assets. Across all of this work, he consistently delivers high-quality results with efficiency and attention to detail.",
      "What truly sets Saha apart is his communication style and growth mindset. He is receptive to feedback, asks thoughtful questions, and is always looking for ways to improve and refine his work to create the best possible final product. He is reliable, proactive, and manages his time well. These qualities that make him someone you can genuinely depend on. Saha would be a strong addition to any team looking for a creative, dependable, and collaborative media producer, and I highly recommend him without hesitation."
    ],
    image: tamaraImage,
    linkedin: "https://www.linkedin.com/in/tamara-gligoric/"
  }
];

export function Recommendations() {
  return (
    <section id="recommendations" className="relative py-24 bg-black overflow-hidden px-8 md:px-16 lg:px-24">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">RECOMMENDATIONS</h2>
          <p className="text-[#A7A7A7] max-w-xl font-mono">Professional testimonials from colleagues and mentors.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] p-10 border border-white/5 relative group transition-all duration-500 rounded-lg max-w-5xl mx-auto w-full"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-[#111] overflow-hidden border border-white/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all duration-500" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-white text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{item.name}</h4>
                    <p className="text-[#A7A7A7] text-sm font-medium mb-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{item.title}</p>
                    <p className="text-[#666] text-xs font-medium mb-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{item.org}</p>
                    <p className="text-[#444] text-[10px] uppercase tracking-[0.05em]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{item.tagline}</p>
                  </div>
                </div>
                
                <a 
                  href={item.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-[#444] hover:text-white transition-colors"
                >
                  <Linkedin size={24} />
                </a>
              </div>

              {/* Separator */}
              <div className="h-[1px] w-full bg-white/5 mb-8" />
              
              {/* Testimonial Content */}
              <div className="space-y-6">
                {item.content.map((paragraph, pIndex) => (
                  <p 
                    key={pIndex} 
                    className="text-[#A7A7A7] text-lg leading-relaxed font-light"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '-0.01em' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
