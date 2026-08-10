import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Ellipse from "../../imports/Ellipse79";
import { useCursor } from "../contexts/CursorContext";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { setHideCursor } = useCursor();
  const [contactTextPosition, setContactTextPosition] = useState({ x: 0, y: 0 });

  const links = [
    { name: "Works", href: "/#works" },
    { name: "Studio", href: "/#studio" },
    { name: "Write", href: "/#write" },
    { name: "Cinematics", href: "/#cinematics" },
    { name: "Recommendations", href: "/#recommendations" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Helper to handle smooth scroll if on homepage, or navigation if not
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      
      // If we're already on homepage, just scroll
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to homepage first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  const handleContactHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate relative position within button bounds (-1 to 1)
    const relativeX = ((x / rect.width) - 0.5) * 2;
    const relativeY = ((y / rect.height) - 0.5) * 2;
    
    // Apply maximum 8px movement
    const maxMovement = 8;
    setContactTextPosition({
      x: relativeX * maxMovement,
      y: relativeY * maxMovement,
    });
  };

  const handleContactLeave = () => {
    setContactTextPosition({ x: 0, y: 0 });
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-colors duration-300 ${
        isOpen 
          ? "" 
          : isScrolled
            ? "bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5"
            : "mix-blend-difference"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 flex items-center justify-between">
        <Link to="/" className="w-[34px] h-[34px]">
          <Ellipse />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium hover:text-gray-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/about"
            className="text-sm font-medium hover:text-gray-400 transition-colors"
          >
            About
          </Link>
          <a
            href="https://drive.google.com/file/d/1F9BM2hwJhAVcU_wmbbkOZkHrrbLJzVXB/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-gray-400 transition-colors"
          >
            Resume
          </a>
          <Link
            to="/contact"
            className="relative px-6 py-2 border border-white rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 overflow-hidden"
            onMouseMove={handleContactHover}
            onMouseLeave={handleContactLeave}
          >
            <motion.span
              className="relative z-10 inline-block"
              animate={{
                x: contactTextPosition.x,
                y: contactTextPosition.y,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              Contact
            </motion.span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-black border-t border-white/10"
        >
          <div className="px-6 py-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-sm font-medium hover:text-gray-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-medium hover:text-gray-400 transition-colors"
            >
              About
            </Link>
            <a
              href="https://drive.google.com/file/d/1F9BM2hwJhAVcU_wmbbkOZkHrrbLJzVXB/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium hover:text-gray-400 transition-colors"
            >
              Resume
            </a>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-medium hover:text-gray-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}