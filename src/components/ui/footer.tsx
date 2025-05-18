import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSoundEffects } from '@/hooks/use-sound-effects';

// Footer animation styles
const footerAnimationStyles = `
  /* Footer link hover effect */
  .footer-link {
    position: relative;
    transition: color 0.3s ease;
  }
  
  .footer-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #7c3aed;
    transition: width 0.3s ease;
    opacity: 0;
  }
  
  .footer-link:hover::after {
    width: 100%;
    opacity: 1;
  }
  
  /* Footer section reveal animation */
  @keyframes footerReveal {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .footer-reveal {
    opacity: 0;
    animation: footerReveal 0.8s ease forwards;
  }
  
  .footer-delay-1 { animation-delay: 0.1s; }
  .footer-delay-2 { animation-delay: 0.2s; }
  .footer-delay-3 { animation-delay: 0.3s; }
  .footer-delay-4 { animation-delay: 0.4s; }
  
  /* Footer wave effect */
  .footer-wave {
    position: relative;
    overflow: hidden;
  }
  
  .footer-wave::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    height: 10px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%237c3aed'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%237c3aed'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%237c3aed'%3E%3C/path%3E%3C/svg%3E") no-repeat;
    background-size: cover;
  }
  
  /* Glow effect for footer logo */
  @keyframes glow {
    0% {
      box-shadow: 0 0 5px rgba(124, 58, 237, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.8);
    }
    100% {
      box-shadow: 0 0 5px rgba(124, 58, 237, 0.5);
    }
  }
  
  .footer-logo {
    animation: glow 3s infinite;
  }
  
  /* Floating social icons */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }
  
  .social-icon {
    transition: all 0.3s ease;
  }
  
  .social-icon:hover {
    animation: float 2s ease-in-out infinite;
    color: #7c3aed;
    transform: scale(1.2);
  }
`;

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const { playButtonClick } = useSoundEffects();
  
  useEffect(() => {
    // Set visible after component mounts to trigger animations
    setIsVisible(true);
    
    // Add scroll event listener to check when footer is in view
    const handleScroll = () => {
      const footer = document.getElementById('site-footer');
      if (footer) {
        const footerPosition = footer.getBoundingClientRect();
        if (footerPosition.top < window.innerHeight) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle link clicks with sound
  const handleLinkClick = (e) => {
    playButtonClick();
  };

  return (
    <footer id="site-footer" className="bg-gray-50 py-12 border-t footer-wave">
      {/* Add the custom CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: footerAnimationStyles }} />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className={`footer-reveal footer-delay-1 ${isVisible ? 'opacity-100' : ''}`}>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/#features" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Features</a></li>
              <li><a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Roadmap</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Updates</a></li>
            </ul>
          </div>
          <div className={`footer-reveal footer-delay-2 ${isVisible ? 'opacity-100' : ''}`}>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>About</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Careers</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Contact</Link></li>
            </ul>
          </div>
          <div className={`footer-reveal footer-delay-3 ${isVisible ? 'opacity-100' : ''}`}>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/documentation" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Documentation</Link></li>
              <li><Link to="/tutorials" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Tutorials</Link></li>
              <li><Link to="/support" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Support</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>FAQ</Link></li>
            </ul>
          </div>
          <div className={`footer-reveal footer-delay-4 ${isVisible ? 'opacity-100' : ''}`}>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Privacy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Terms</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Refund Policy</Link></li>
              <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground footer-link" onClick={handleLinkClick}>Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center footer-logo">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="font-bold">kulibre</span>
          </div>
          
          {/* Social media icons with hover animation */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} kulibre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
