const fs = require('fs');
const file = 'src/app/contexts/ChakkuContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldOverlay = `    <AnimatePresence>
      {isSessionActive && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-[200] flex justify-center px-4 pointer-events-none"
        >`;

const newOverlay = `    <AnimatePresence>
      {isSessionActive && (
        <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[190] pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 150px rgba(150, 150, 150, 0.15)'
          }}
        />
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-[200] flex justify-center px-4 pointer-events-none"
        >`;

content = content.replace(oldOverlay, newOverlay);

// Need to also close the fragment
const oldOverlayClose = `        </motion.div>
      )}
    </AnimatePresence>`;

const newOverlayClose = `        </motion.div>
        </>
      )}
    </AnimatePresence>`;

content = content.replace(oldOverlayClose, newOverlayClose);

fs.writeFileSync(file, content);
console.log("Halo added!");
