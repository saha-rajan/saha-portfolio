import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Sparkles } from 'lucide-react';

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  // Text-to-Speech function
  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        setTranscript(speechResult);
        handleVoiceCommand(speechResult);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setPermissionDenied(true);
          setFeedback('Microphone access denied. Please enable microphone permissions in your browser settings.');
        } else if (event.error === 'no-speech') {
          setFeedback('No speech detected. Please try again.');
        } else if (event.error === 'network') {
          setFeedback('Network error. Please check your connection.');
        } else if (event.error !== 'aborted') {
          // Only show feedback for non-aborted errors
          setFeedback('Sorry, I didn\'t catch that. Please try again.');
        }
        
        if (event.error !== 'aborted') {
          setTimeout(() => setFeedback(''), 5000);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    let response = '';
    const cmd = command.toLowerCase();
    
    // Help and Commands List
    if (cmd.includes('help') || cmd.includes('what can you do') || cmd.includes('commands') || cmd.includes('assist') || cmd.includes('guide')) {
      response = 'I can help you navigate the portfolio, tell you about Saha\'s projects, summarize case studies, share information about Saha\'s background, skills, and experience. Try saying: go to studio, tell me about ChemoBuddy, what are Saha\'s skills, or tell me about Saha';
      setFeedback('Showing available commands');
      speak(response);
    }
    
    // ==================== NAVIGATION COMMANDS ====================
    
    // Home
    else if (cmd.includes('home') || cmd.includes('homepage') || cmd.includes('main page') || cmd.includes('go back home') || cmd.includes('take me home')) {
      response = 'Sure, taking you to the home page now';
      setFeedback('Going to home page');
      speak(response);
      setTimeout(() => navigate('/'), 800);
    } 
    
    // About
    else if (cmd.includes('about') || cmd.includes('bio') || cmd.includes('profile')) {
      response = 'Sure, here\'s the about page where you can learn more about Saha\'s background, experience, and expertise';
      setFeedback('Going to about page');
      speak(response);
      setTimeout(() => navigate('/about'), 800);
    } 
    
    // Contact
    else if (cmd.includes('contact') || cmd.includes('reach out') || cmd.includes('email') || cmd.includes('get in touch') || cmd.includes('message')) {
      response = 'Sure, opening the contact page. Saha would love to hear from you at trajan2@asu.edu';
      setFeedback('Going to contact page');
      speak(response);
      setTimeout(() => navigate('/contact'), 800);
    } 
    
    // Studio
    else if (cmd.includes('studio') || cmd.includes('playground') || cmd.includes('experiments') || cmd.includes('creative space')) {
      response = 'Sure, here\'s the studio playground. It\'s an interactive Miro-board style space where you can drag polaroid images freely across a large canvas';
      setFeedback('Opening studio');
      speak(response);
      setTimeout(() => navigate('/studio'), 800);
    } 
    
    // ==================== PROJECT NAVIGATION ====================
    
    // ChemoBuddy
    else if (cmd.includes('open chemo') || cmd.includes('show chemo') || cmd.includes('chemobuddy') || cmd.includes('chemo buddy') || cmd.includes('chemotherapy') || cmd.includes('cancer app') || cmd.includes('healthcare project')) {
      response = 'Sure, here\'s the ChemoBuddy case study. This is a compassionate healthcare application designed in collaboration with Mayo Clinic to support cancer patients through their chemotherapy journey';
      setFeedback('Opening ChemoBuddy case study');
      speak(response);
      setTimeout(() => navigate('/works/fintech-dashboard'), 1000);
    } 
    
    // Arizona Yoga
    else if (cmd.includes('arizona') || cmd.includes('yoga') || cmd.includes('wellness') || cmd.includes('yoga studio') || cmd.includes('arizona yoga')) {
      response = 'Sure, here\'s the Arizona Yoga case study. This is a wellness platform redesign focused on creating a calming, mindful digital experience';
      setFeedback('Opening Arizona Yoga case study');
      speak(response);
      setTimeout(() => navigate('/works/arizona-yoga-studio'), 1000);
    } 
    // Aura
    else if (cmd.includes('aura') || cmd.includes('feel the room') || cmd.includes('case study')) {
      response = 'Sure, here\'s the Aura - Feel the room case study. A UX case study focused on ambient experiences.';
      setFeedback('Opening Aura case study');
      speak(response);
      setTimeout(() => navigate('/works/aura'), 1000);
    }
    
    // ==================== PROJECT SUMMARIES & DETAILS ====================
    
    // ChemoBuddy Details
    else if (cmd.includes('chemo') && (cmd.includes('about') || cmd.includes('tell') || cmd.includes('explain') || cmd.includes('detail') || cmd.includes('summary') || cmd.includes('summarize') || cmd.includes('what is') || cmd.includes('describe'))) {
      response = 'ChemoBuddy is a compassionate healthcare application designed in collaboration with Mayo Clinic to support cancer patients during chemotherapy. Saha led the design of this project, focusing on medication tracking, appointment management, symptom logging, and emotional support resources. The project emphasizes accessibility, empathy, and user-centered design to make the treatment journey less overwhelming. Key features include a personalized dashboard, medication reminders, side effect tracking, and connection to support communities';
      setFeedback('Summarizing ChemoBuddy');
      speak(response);
    }
    
    // Arizona Yoga Details
    else if (cmd.includes('arizona') && (cmd.includes('about') || cmd.includes('tell') || cmd.includes('explain') || cmd.includes('detail') || cmd.includes('summary') || cmd.includes('summarize') || cmd.includes('what is') || cmd.includes('describe'))) {
      response = 'Arizona Yoga Co. is a wellness platform redesign that brings mindfulness and clarity to the digital experience. Saha created a calming, intuitive interface for class scheduling, instructor profiles, member management, and community engagement. The design emphasizes tranquility, ease of use, and breathing room in the interface. It includes features like real-time class availability, personalized recommendations, and a meditation timer';
      setFeedback('Summarizing Arizona Yoga');
      speak(response);
    }
    
    // Aura Details
    else if (cmd.includes('aura') && (cmd.includes('about') || cmd.includes('tell') || cmd.includes('explain') || cmd.includes('detail') || cmd.includes('summary') || cmd.includes('summarize') || cmd.includes('what is') || cmd.includes('describe'))) {
      response = 'Aura - Feel the room is a UX case study exploring ambient and atmospheric design. It focuses on creating immersive digital spaces that evoke specific moods and feelings.';
      setFeedback('Summarizing Aura');
      speak(response);
    }
    
    // List All Projects
    else if (cmd.includes('project') && (cmd.includes('show') || cmd.includes('list') || cmd.includes('what') || cmd.includes('all') || cmd.includes('how many') || cmd.includes('which'))) {
      response = 'Saha\'s portfolio features three main case studies: ChemoBuddy, a healthcare app for cancer patients done with Mayo Clinic; Arizona Yoga Co., a wellness platform redesign; and Aura - Feel the room, an ambient UX case study. There\'s also a Studio playground section with draggable polaroid images, a Cinematics section showcasing videography work shot on iPhone, and a Write section featuring design articles';
      setFeedback('Listing all projects');
      speak(response);
    }
    
    // ==================== ABOUT THE DESIGNER ====================
    
    // General Background - with name recognition
    else if ((cmd.includes('saha') || cmd.includes('thiruvenkata')) && (cmd.includes('who') || cmd.includes('background') || cmd.includes('about') || cmd.includes('tell me') || cmd.includes('story') || cmd.includes('introduce'))) {
      response = 'Thiruvenkata Saha is a multidisciplinary UX designer currently working as a Media Production Design Intern at Arizona State University\'s Ira A. Fulton Schools of Engineering. Saha specializes in user-centered design across healthcare, wellness, and enterprise software. With a unique background transitioning from architecture to product design, Saha brings a systematic yet creative mindset to every project. Saha\'s work demonstrates expertise in user research, interaction design, prototyping, and creating accessible, emotionally resonant experiences';
      setFeedback('About Saha');
      speak(response);
    }
    
    // Education and Background
    else if (cmd.includes('education') || cmd.includes('study') || cmd.includes('school') || cmd.includes('university') || cmd.includes('degree')) {
      response = 'Saha has a background in computer science and visual arts, and is currently studying at Arizona State University. Saha previously studied architecture before transitioning to product design, which gives him a unique perspective on structure, flow, and user experience. This architectural background taught Saha that design isn\'t just about aesthetics—it\'s about how people inhabit and move through a space';
      setFeedback('Educational background');
      speak(response);
    }
    
    // Architecture to Product Design Transition
    else if (cmd.includes('architecture') || cmd.includes('why product') || cmd.includes('transition') || cmd.includes('from architecture') || cmd.includes('architect')) {
      response = 'Before designing pixels, Saha designed physical spaces. Saha started in architecture, learning that design isn\'t just about aesthetics—it\'s about how people inhabit and move through a space. Saha realized that the principles of physical architecture—structure, circulation, and materiality—apply directly to digital environments. Saha traded concrete for code, but the core mission remains: building functional, human-centric systems. Key lessons from architecture include structural integrity in information architecture, circulation and flow in user journeys, and precision in details';
      setFeedback('Architecture background');
      speak(response);
    }
    
    // ==================== SKILLS & EXPERTISE ====================
    
    // General Skills
    else if (cmd.includes('skill') || cmd.includes('what can') || cmd.includes('expertise') || cmd.includes('capabilities') || cmd.includes('good at') || cmd.includes('specialize')) {
      response = 'Saha specializes in six core areas: Product Strategy—defining the why and how; UI and UX Design—crafting intuitive interfaces; Design Systems—building scalable design languages; Prototyping—bringing ideas to life with high-fidelity prototypes; User Research—understanding users through interviews and testing; and Motion Design—adding life to interactions. Additional skills include wireframing, interaction design, visual design, and accessibility. Saha is proficient in design tools and user-centered methodologies';
      setFeedback('Saha\'s skills and expertise');
      speak(response);
    }
    
    // Tools and Software
    else if (cmd.includes('tools') || cmd.includes('software') || cmd.includes('programs') || cmd.includes('figma') || cmd.includes('design tool')) {
      response = 'Saha is proficient in modern design tools including Figma for interface design and prototyping, Adobe Creative Suite for visual design, and various prototyping tools. Saha also understands front-end technologies like HTML, CSS, and has familiarity with React and modern web frameworks. Saha\'s technical background allows bridging the gap between design and development effectively';
      setFeedback('Design tools');
      speak(response);
    }
    
    // Design Process
    else if (cmd.includes('process') || cmd.includes('how do') || cmd.includes('approach') || cmd.includes('methodology') || cmd.includes('workflow') || cmd.includes('method')) {
      response = 'Saha\'s design approach follows a user-centered methodology: First, conducting user research and building empathy through interviews and observation. Second, defining problems by synthesizing research findings. Third, ideating solutions through sketching and brainstorming. Fourth, creating high-fidelity prototypes and testing with real users. Finally, iterating based on feedback. Accessibility and inclusivity are core principles throughout the entire process. This systematic yet creative approach comes from Saha\'s background in both computer science and architecture';
      setFeedback('Design process');
      speak(response);
    }
    
    // ==================== WORK EXPERIENCE ====================
    
    // Current and Recent Roles
    else if (cmd.includes('experience') || cmd.includes('work history') || cmd.includes('jobs') || cmd.includes('where') || cmd.includes('employment') || cmd.includes('current role')) {
      response = 'Saha is currently working as a Media Production Design Intern at Arizona State University\'s Ira A. Fulton Schools of Engineering since January 2026. Previously served as Student Assistant for Design and Media Production at ASU from September 2025 to January 2026. Before that, Saha worked as a User Experience Designer at Cycatz from August to October 2024, and as a Product Design Intern at Aspire India from March to April 2024. Saha also completed an internship at Chennai Architects from January to July 2022, which provided the architectural foundation';
      setFeedback('Work experience');
      speak(response);
    }
    
    // Specific Company Questions
    else if (cmd.includes('asu') || cmd.includes('arizona state') || cmd.includes('fulton')) {
      response = 'Saha is currently working at Arizona State University\'s Ira A. Fulton Schools of Engineering as a Media Production Design Intern since January 2026. Previously held the role of Student Assistant for Design and Media Production from September 2025 to January 2026. This role involves creating visual content, designing for engineering programs, and supporting media production initiatives';
      setFeedback('ASU experience');
      speak(response);
    }
    
    else if (cmd.includes('cycatz') || cmd.includes('user experience designer')) {
      response = 'Saha worked as a User Experience Designer at Cycatz from August to October 2024. This role involved designing user-centered digital experiences, conducting user research, and creating intuitive interface solutions';
      setFeedback('Cycatz experience');
      speak(response);
    }
    
    // ==================== PERSONAL INTERESTS & HOBBIES ====================
    
    // Hobbies
    else if (cmd.includes('hobbies') || cmd.includes('interests') || cmd.includes('personal') || cmd.includes('outside work') || cmd.includes('free time') || cmd.includes('passion')) {
      response = 'Outside of design work, Saha has diverse interests including street photography—capturing light and shadows in urban environments; hiking and nature—finding peace in the mountains; reading—exploring new worlds through books; gaming—appreciating immersive storytelling and competitive play; coffee brewing—mastering the art of the perfect pour over; and vinyl collection—appreciating the warmth of analog sound. These hobbies inform Saha\'s design work by providing fresh perspectives and inspiration';
      setFeedback('Personal interests');
      speak(response);
    }
    
    // Photography
    else if (cmd.includes('photography') || cmd.includes('photos') || cmd.includes('camera')) {
      response = 'Saha is passionate about street photography, capturing light and shadows in urban environments. This interest in composition, lighting, and framing directly influences Saha\'s visual design work. Saha also has a Cinematics section showcasing videography work shot entirely on iPhone';
      setFeedback('Photography interest');
      speak(response);
    }
    
    // ==================== STUDIO & SECTIONS ====================
    
    // Studio Information
    else if (cmd.includes('what is studio') || cmd.includes('studio info') || cmd.includes('studio section')) {
      response = 'The Studio is an experimental playground featuring a Miro-board style interface with draggable polaroid images. It\'s a creative space where you can freely drag and explore images across a large 3000 by 2500 pixel scrollable canvas. Think of it as a digital mood board or creative workspace. The images are randomly positioned and you can rearrange them however you like';
      setFeedback('About Studio');
      speak(response);
    }
    
    // Cinematics Information
    else if (cmd.includes('cinematics') || cmd.includes('videos') || cmd.includes('film') || cmd.includes('videography') || cmd.includes('movie')) {
      response = 'The Cinematics section showcases Saha\'s videography work shot entirely on iPhone, demonstrating how everyday moments can be captured with cinematic quality. It includes a Music Video Direction piece in the FLUX card with an embedded YouTube video that plays when clicked, along with various atmospheric shots. This section highlights Saha\'s eye for composition, lighting, and storytelling through motion';
      setFeedback('About Cinematics');
      speak(response);
    }
    
    // Write Section
    else if (cmd.includes('write') || cmd.includes('writing') || cmd.includes('articles') || cmd.includes('blog') || cmd.includes('content')) {
      response = 'The Write section features design articles and thoughts using a modal popup system instead of external links. It showcases Saha\'s ability to articulate design thinking, share insights, and contribute to the design community through written content';
      setFeedback('About Write section');
      speak(response);
    }
    
    // ==================== DESIGN PHILOSOPHY ====================
    
    // Philosophy
    else if (cmd.includes('philosophy') || cmd.includes('principles') || cmd.includes('values') || cmd.includes('believe')) {
      response = 'Saha\'s design philosophy emphasizes minimalism—removing everything that doesn\'t serve a purpose; clarity—content first, decoration second; consistency—reusing patterns and maintaining rhythm; whitespace—letting content breathe; performance—fast is a feature; accessibility—designing for everyone; and creating interfaces that are not just functional but emotionally resonant. This approach is influenced by architectural principles of structural integrity, circulation, and precision';
      setFeedback('Design philosophy');
      speak(response);
    }
    
    // User-Centered Design
    else if (cmd.includes('user centered') || cmd.includes('user research') || cmd.includes('empathy') || cmd.includes('testing') || cmd.includes('users first')) {
      response = 'User-centered design is at the core of Saha\'s work. This means starting with user research and empathy, understanding real human problems, testing designs with actual users, and iterating based on feedback. Saha believes in creating experiences that solve real problems through thoughtful, empathetic design. Accessibility and inclusivity are fundamental principles, not afterthoughts';
      setFeedback('User-centered approach');
      speak(response);
    }
    
    // ==================== TESTIMONIALS & ACHIEVEMENTS ====================
    
    // Testimonials
    else if (cmd.includes('testimonial') || cmd.includes('references') || cmd.includes('recommendations') || cmd.includes('what people say') || cmd.includes('reviews')) {
      response = 'Colleagues praise Saha\'s work highly. Sarah Jenkins, Product Director at TechFlow, says: "One of the most talented designers I\'ve worked with. He brings a unique perspective to every project." David Chen, CTO at StartupX, notes: "His attention to detail is unmatched. The design system he built saved us months of development time." These testimonials highlight Saha\'s talent, unique perspective, and attention to detail';
      setFeedback('Testimonials');
      speak(response);
    }
    
    // ==================== PORTFOLIO FEATURES ====================
    
    // Custom Cursor
    else if (cmd.includes('cursor') || cmd.includes('circle') || cmd.includes('custom cursor') || cmd.includes('mouse effect')) {
      response = 'The portfolio features an interactive white circle custom cursor with mix-blend-difference effects, creating an inverted color effect as it moves across the page. This adds a unique, memorable interaction that enhances the overall user experience and demonstrates Saha\'s attention to micro-interactions';
      setFeedback('Custom cursor feature');
      speak(response);
    }
    
    // Design System
    else if (cmd.includes('design system') || cmd.includes('color palette') || cmd.includes('typography') || cmd.includes('ibm plex') || cmd.includes('spacing')) {
      response = 'The portfolio uses a strict design system with a black and white color palette—pure black background with white for headings and light gray for body text. Typography is IBM Plex Mono throughout, giving a technical yet approachable feel. Spacing follows an 8-pixel grid system for consistency. The design emphasizes minimalism, clarity, and a developer-designer hybrid aesthetic';
      setFeedback('Design system');
      speak(response);
    }
    
    // ==================== CONTACT & COLLABORATION ====================
    
    // Contact Information
    else if (cmd.includes('email address') || cmd.includes('how to contact') || cmd.includes('reach') || cmd.includes('hire') || cmd.includes('collaborate') || cmd.includes('work together')) {
      response = 'You can reach Saha at trajan2@asu.edu. Saha is always open to feedback, ideas, new opportunities, or even a quick chat about design, films, or anything creative. Feel free to drop a message—all emails are read and responded to';
      setFeedback('Contact information');
      speak(response);
    }
    
    // Availability
    else if (cmd.includes('available') || cmd.includes('hiring') || cmd.includes('looking for work') || cmd.includes('open to') || cmd.includes('opportunities')) {
      response = 'Saha is currently working at Arizona State University and is open to new opportunities, collaborations, and interesting projects. Saha is particularly interested in healthcare, wellness, and enterprise software projects that make a meaningful impact. Reach out at trajan2@asu.edu to discuss potential collaboration';
      setFeedback('Availability');
      speak(response);
    }
    
    // ==================== UTILITY COMMANDS ====================
    
    // Scroll commands
    else if (cmd.includes('scroll up') || cmd.includes('go up') || cmd.includes('top') || cmd.includes('scroll to top')) {
      response = 'Scrolling to the top for you';
      setFeedback('Scrolling to top');
      speak(response);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
    
    else if (cmd.includes('scroll down') || cmd.includes('go down') || cmd.includes('bottom') || cmd.includes('scroll to bottom')) {
      response = 'Scrolling down to the bottom';
      setFeedback('Scrolling down');
      speak(response);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
    
    // Close/Back commands
    else if (cmd.includes('go back') || cmd.includes('back') || cmd.includes('previous page') || cmd.includes('return')) {
      response = 'Going back to the previous page';
      setFeedback('Going back');
      speak(response);
      setTimeout(() => window.history.back(), 500);
    }
    
    // ==================== GREETINGS & SOCIAL ====================
    
    // Greeting responses
    else if (cmd.includes('hello') || cmd.includes('hi ') || cmd.includes('hey') || cmd.includes('good morning') || cmd.includes('good afternoon') || cmd.includes('good evening')) {
      response = 'Hello! I\'m an AI voice assistant for Saha\'s portfolio. I can help you navigate anywhere, tell you about Saha\'s projects in detail, share information about Saha\'s background, skills, and experience, or answer any questions you have. How can I help you today?';
      setFeedback('Hello!');
      speak(response);
    }
    
    // Thank you responses
    else if (cmd.includes('thank') || cmd.includes('thanks') || cmd.includes('appreciate')) {
      response = 'You\'re very welcome! Let me know if you need anything else';
      setFeedback('You\'re welcome!');
      speak(response);
    }
    
    // Impressed/Compliments
    else if (cmd.includes('nice') || cmd.includes('cool') || cmd.includes('great') || cmd.includes('amazing') || cmd.includes('impressive') || cmd.includes('love this')) {
      response = 'Thank you! Saha will be happy to hear that. Feel free to reach out at trajan2@asu.edu if you\'d like to connect';
      setFeedback('Thank you!');
      speak(response);
    }
    
    // ==================== DEFAULT / NOT RECOGNIZED ====================
    
    else {
      response = 'I didn\'t quite catch that. You can ask me about Saha\'s projects, background, skills, work experience, hobbies, or say "help" to hear all available commands. Try asking: What are Saha\'s skills? Tell me about ChemoBuddy. What\'s Saha\'s background? Or, Show all projects';
      setFeedback('Command not recognized. Say "help" for available commands.');
      speak(response);
    }

    // Clear feedback after appropriate time
    setTimeout(() => {
      setFeedback('');
      setTranscript('');
    }, 3000);
  };

  const toggleListening = async () => {
    if (!isSupported) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // If currently speaking, stop the speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      // Also cancel any ongoing speech when stopping listening
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately as we only needed permission
        stream.getTracks().forEach(track => track.stop());
        
        setPermissionDenied(false);
        setTranscript('');
        setFeedback('Listening...');
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error: any) {
        // Silently handle permission denial
        setPermissionDenied(true);
        setIsListening(false);
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setFeedback('🎤 Microphone access required. Please click "Allow" when prompted by your browser.');
        } else if (error.name === 'NotFoundError') {
          setFeedback('No microphone found. Please connect a microphone and try again.');
        } else {
          setFeedback('Unable to access microphone. Please check your browser settings.');
        }
        
        setTimeout(() => setFeedback(''), 6000);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Assistant Button */}
      <motion.button
        onClick={toggleListening}
        className={`group fixed bottom-8 right-8 z-[9999] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening 
            ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50' 
            : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        title="AI Voice Assistant"
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Mic className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Main circle with glow */}
              <div className="w-6 h-6 rounded-full border-2 border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-shadow duration-300" />
              
              {/* Sparks around the circle - only visible on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 360) / 8;
                  const distance = 16;
                  const x = Math.cos((angle * Math.PI) / 180) * distance;
                  const y = Math.sin((angle * Math.PI) / 180) * distance;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: '-2px',
                        marginTop: '-2px',
                      }}
                      animate={{
                        x: [0, x, 0],
                        y: [0, y, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing ring when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Feedback Tooltip */}
      <AnimatePresence>
        {(feedback || transcript) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-8 z-[9999] bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 max-w-xs"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {transcript && (
              <div className="mb-2">
                <div className="text-xs text-white/60 uppercase tracking-wider mb-1">You said:</div>
                <div className="text-sm text-white">"{transcript}"</div>
              </div>
            )}
            {feedback && (
              <div className={transcript ? 'mt-3 pt-3 border-t border-white/10' : ''}>
                <div className="text-sm text-[#A7A7A7] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                  <span>{feedback}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Tooltip on Hover */}
      {!isListening && !feedback && (
        <div
          className="fixed bottom-28 right-8 z-[9998] bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 max-w-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <div className="text-xs text-white/80 mb-2 font-semibold">Voice Commands:</div>
          <div className="text-xs text-[#A7A7A7] space-y-1">
            <div>• "Tell me about Saha"</div>
            <div>• "What are Saha's skills?"</div>
            <div>• "Show ChemoBuddy"</div>
            <div>• "What's Saha's background?"</div>
          </div>
        </div>
      )}
    </>
  );
}
