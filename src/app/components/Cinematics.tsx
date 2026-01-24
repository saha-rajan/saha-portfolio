import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useCursor } from "../contexts/CursorContext";
import { useState } from "react";
import fluxImage from "figma:asset/11ea18eb3ee2bcba4dc6d58accbfb6f42874db71.png";
import nocturnalImage from "figma:asset/27688d268730ef30cf14ec57815f8ef5c3a246c8.png";
import grainImage from "figma:asset/b285a8056d5d2f480756ffecea176842fd013d7e.png";
import solitudeImage from "figma:asset/2dc50afe23f1aed50f325dd58dc05e6e7b8e832f.png";
import echoImage from "figma:asset/501181401c7d4347a40bbb1e648efa8a806d3225.png";

const cinematics = [
  {
    title: "NOCTURNAL",
    type: "video",
    duration: "02:14",
    image: nocturnalImage,
    driveId: "1N6_h3BgYdOQkHCbC5Re0stoDzyafL1nZ",
    size: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    title: "GRAIN",
    type: "video",
    duration: "01:30",
    image: grainImage,
    driveId: "1PGo9yQRYxvDW27h-UOt2j9gwo7C4K_gp",
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Music Video Direction",
    type: "video",
    duration: "5:05",
    image: fluxImage,
    youtubeId: "mYvJ30aQk50",
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "SOLITUDE",
    type: "video",
    duration: "01:45",
    image: solitudeImage,
    driveId: "1zUOH-4NtMw0LGx5IqGjQNO-MLoxKDRha",
    size: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "ECHO",
    type: "video",
    duration: "03:45",
    image: echoImage,
    driveId: "1A8VLzNFg8Pib7vkg6z5tnNmDhXd_ghUJ",
    size: "col-span-1 md:col-span-2 row-span-1",
  },
];

export function Cinematics() {
  const { setIsTextCursor, setHideCursor } = useCursor();
  const [videoId, setVideoId] = useState("");

  return (
    <section id="cinematics" className="relative py-24 bg-black overflow-hidden">
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
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">CINEMATICS</h2>
          <p 
            className="text-[#A7A7A7] max-w-xl"
            onMouseEnter={() => setIsTextCursor(true)}
            onMouseLeave={() => setIsTextCursor(false)}
          >
            Shots from my iPhone capturing everyday moments where videography and storytelling come together naturally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {cinematics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group overflow-hidden bg-[#111] ${item.size} cursor-none`}
              onMouseEnter={() => setHideCursor(true)}
              onMouseLeave={() => setHideCursor(false)}
              onClick={() => {
                if (item.youtubeId) {
                  setVideoId(item.youtubeId);
                } else if (item.driveId) {
                  setVideoId(item.driveId);
                }
              }}
            >
              {videoId === item.youtubeId ? (
                // YouTube Player
                <iframe
                  src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="w-full h-full absolute inset-0"
                  style={{ border: 'none' }}
                />
              ) : videoId === item.driveId ? (
                // Google Drive Player
                <iframe
                  src={`https://drive.google.com/file/d/${item.driveId}/preview`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="w-full h-full absolute inset-0"
                  style={{ border: 'none' }}
                />
              ) : (
                <>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Play Button Overlay for Videos */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-black/20">
                        <Play size={24} fill="white" className="ml-1" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}