import { motion } from "motion/react";
import { ArrowRight, Linkedin, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useState } from "react";

export function Contact() {
  const [message, setMessage] = useState("");

  const handleSendEmail = () => {
    const recipient = "trajan2@asu.edu";
    const subject = "Message from Portfolio";
    const body = encodeURIComponent(message);
    
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pt-[128px] pb-[0px] px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen relative pr-[48px] pl-[48px]">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-white w-fit font-normal">
            Say hello!
          </h1>
          <p className="text-xl md:text-2xl text-[#A7A7A7] max-w-2xl leading-relaxed">
            If you've scrolled this far, that's reason enough. I'm always open to feedback, ideas, or even a quick chat about design, films, or anything random.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-lg font-bold text-white w-fit mb-8">
            Drop me a note, I read them all ↓
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 max-w-2xl mb-24"
        >
          <div className="space-y-2">
            <Textarea 
              placeholder="Message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] bg-[#121217] border-none text-[#929292] text-lg rounded-lg resize-none focus-visible:ring-1 focus-visible:ring-white/20 p-4"
            />
          </div>
          
          <Button 
            onClick={handleSendEmail}
            className="w-full h-14 bg-transparent border border-white text-white hover:bg-white hover:text-black rounded-lg text-lg font-medium transition-all duration-300"
          >
            Send Email
          </Button>
        </motion.div>


      </div>
    </div>
  );
}