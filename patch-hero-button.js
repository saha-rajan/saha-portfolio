import fs from 'fs';
let content = fs.readFileSync('src/app/components/Hero.tsx', 'utf-8');

const oldButton = `          {/* Say Hi Button */}
          {!isSessionActive && (
            <motion.button
              onClick={startSession}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="group flex items-center text-sm text-[#A7A7A7] hover:text-white transition-colors w-fit self-start mt-2"
              style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.02em' }}
            >
              <span className="text-white mr-2">✦</span>
              <span>This portfolio talks. Meet Chakku →</span>
            </motion.button>
          )}`;

const newButton = `          {/* Say Hi Button */}
          {!isSessionActive && (
            <motion.button
              onClick={startSession}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="group flex items-center text-sm w-fit self-start mt-2"
              style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.02em' }}
            >
              <span className="text-[#D4D4D4] mr-2">✦</span>
              <span 
                className="bg-gradient-to-r from-[#8A8A8A] via-[#F5F5F5] to-[#8A8A8A] bg-clip-text text-transparent bg-[length:200%_auto] bg-[position:0%_center] group-hover:bg-[position:100%_center] transition-[background-position] duration-[1200ms] ease-in-out"
              >
                meet chakku ↗
              </span>
            </motion.button>
          )}`;

content = content.replace(oldButton, newButton);
fs.writeFileSync('src/app/components/Hero.tsx', content);
