
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CustomCursor from '@/components/ui/custom-cursor';
import Footer from '@/components/ui/footer';
import {
  Check,
  X,
  DollarSign,
  Zap,
  Calendar,
  Users,
  BarChart2,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

// Enhanced CSS for animations and effects
const animationStyles = `
  /* Float animations */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes floatSlow {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }

  .float-animation {
    animation: float 3s ease-in-out infinite;
  }

  .float-animation-slow {
    animation: floatSlow 5s ease-in-out infinite;
  }

  .float-delay-1 {
    animation-delay: 1s;
  }

  .float-delay-2 {
    animation-delay: 2s;
  }

  .float-delay-3 {
    animation-delay: 0.5s;
  }

  .float-delay-4 {
    animation-delay: 1.5s;
  }

  .float-delay-5 {
    animation-delay: 0.7s;
  }

  /* Text animation effects */
  @keyframes revealText {
    0% { 
      opacity: 0;
      transform: translateY(20px);
    }
    100% { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .text-reveal {
    opacity: 0;
    animation: revealText 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }

  .text-reveal-delay-1 {
    animation-delay: 0.2s;
  }

  .text-reveal-delay-2 {
    animation-delay: 0.4s;
  }

  .text-reveal-delay-3 {
    animation-delay: 0.6s;
  }

  .gradient-text {
    background: linear-gradient(90deg, #7c3aed, #ec4899, #7c3aed);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientFlow 3s linear infinite;
    text-shadow: none; /* Remove text shadow for better contrast with gradient */
  }

  .text-shadow {
    text-shadow: 0 4px 12px rgba(124, 58, 237, 0.5); /* Enhanced shadow for better contrast */
  }

  /* Text fade-in animation */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .fade-in-text {
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 0.8s;
  }
  
  /* Highlight text effect with improved contrast */
  .highlight-text {
    position: relative;
    display: inline;
    color: #000; /* Ensure text is dark for contrast */
    font-weight: 600; /* Make highlighted text slightly bolder */
  }
  
  .highlight-text::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%; /* Increased height for better visibility */
    background-color: rgba(124, 58, 237, 0.3); /* Increased opacity for better contrast */
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s ease;
  }
  
  .highlight-text.animate::after {
    transform: scaleX(1);
    transition-delay: 1.2s;
  }

  /* Parallax effect */
  .parallax-container {
    position: relative;
    overflow: hidden;
  }

  .parallax-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
  }

  /* Card hover effects */
  .hover-card {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                box-shadow 0.3s ease,
                border-color 0.3s ease;
  }

  .hover-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: rgba(124, 58, 237, 0.3);
  }

  /* Button hover effects */
  .glow-button {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .glow-button::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    transform: scale(0.5);
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  .glow-button:hover::after {
    opacity: 0.3;
    transform: scale(1);
  }

  /* Scroll-triggered animations */
  .fade-in-section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .fade-in-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Staggered animation for children */
  .stagger-children > * {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  .stagger-children.is-visible > *:nth-child(1) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.1s;
  }

  .stagger-children.is-visible > *:nth-child(2) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.2s;
  }

  .stagger-children.is-visible > *:nth-child(3) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.3s;
  }

  .stagger-children.is-visible > *:nth-child(4) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.4s;
  }

  .stagger-children.is-visible > *:nth-child(5) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.5s;
  }

  .stagger-children.is-visible > *:nth-child(6) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.6s;
  }

  /* Background pattern */
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c3aed' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* High contrast mode */
  .high-contrast {
    --text-color: #000000;
    --background-color: #ffffff;
    --accent-color: #7c3aed;
    --accent-color-hover: #6d28d9;
    --border-color: #000000;
  }

  /* Dark mode */
  .dark-mode {
    --text-color: #ffffff;
    --background-color: #121212;
    --accent-color: #9d5cff;
    --accent-color-hover: #b57bff;
    --border-color: #333333;
  }

  /* 3D button effect */
  .button-3d {
    transform: translateY(0);
    box-shadow: 0 4px 0 0 #6d28d9;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .button-3d:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 0 #6d28d9;
  }

  /* Shimmer effect */
  @keyframes shimmer {
    0% {
      background-position: -100% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .shimmer {
    position: relative;
    overflow: hidden;
  }

  .shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  /* Glass effect */
  .glass-effect {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
    transition: all 0.3s ease;
  }
  
  .glass-card:hover {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    transform: translateY(-5px);
  }
  
  /* Company logo animations */
  .company-logo {
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.5s ease;
  }
  
  .company-logo:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
  }
  
  @keyframes fadeInLogo {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 0.7;
      transform: translateY(0);
    }
  }
  
  .company-logo-animation {
    animation: fadeInLogo 0.8s ease forwards;
  }
  
  .logo-delay-1 { animation-delay: 0.1s; }
  .logo-delay-2 { animation-delay: 0.2s; }
  .logo-delay-3 { animation-delay: 0.3s; }
  .logo-delay-4 { animation-delay: 0.4s; }
  .logo-delay-5 { animation-delay: 0.5s; }
  .logo-delay-6 { animation-delay: 0.6s; }
`;

export default function Landing() {
  const [scrollY, setScrollY] = React.useState(0);
  const [highContrast, setHighContrast] = React.useState(false);
  
  // Handle scroll for parallax effect and scroll-triggered animations
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Add fade-in effect to sections as they come into view
      const fadeElements = document.querySelectorAll('.fade-in-section');
      fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('is-visible');
        }
      });
      
      // Add staggered animation to children elements
      const staggerElements = document.querySelectorAll('.stagger-children');
      staggerElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('is-visible');
        }
      });
    };
    
    // Add animation classes with delay to create a sequence
    const highlights = document.querySelectorAll('.highlight-text');
    highlights.forEach((highlight, index) => {
      setTimeout(() => {
        highlight.classList.add('animate');
      }, 1000 + (index * 400));
    });
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount to check initial positions
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Add the custom CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Custom cursor */}
      <CustomCursor />
      {/* Sticky Navbar with Glass Effect */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-100 p-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center shimmer">
              <span className="text-white font-bold relative z-10">K</span>
            </div>
            <h1 className="text-xl font-bold">kulibre</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-kulibre-purple transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kulibre-purple transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-kulibre-purple transition-colors relative group">
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kulibre-purple transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-kulibre-purple transition-colors relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kulibre-purple transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-kulibre-purple transition-colors relative group">
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kulibre-purple transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-kulibre-purple transition-colors relative group">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kulibre-purple transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleHighContrast}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
              title={highContrast ? "Disable high contrast" : "Enable high contrast"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z"></path>
                <path d="M2 12h20"></path>
              </svg>
            </button>
            <Link to="/login">
              <Button variant="outline" className="hover-card">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button className="glow-button button-3d">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Parallax */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-kulibre-purple/5 to-white relative overflow-hidden parallax-container bg-pattern">
          {/* Animated background elements with parallax effect */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div 
              className="float-animation-slow absolute top-10 left-[10%] w-32 h-32 rounded-full bg-kulibre-purple/20 blur-lg"
              style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            ></div>
            <div 
              className="float-animation float-delay-2 absolute top-[30%] right-[15%] w-24 h-24 rounded-full bg-creatively-pink/20 blur-lg"
              style={{ transform: `translateY(${scrollY * -0.08}px)` }}
            ></div>
            <div 
              className="float-animation float-delay-3 absolute bottom-[20%] left-[20%] w-40 h-40 rounded-full bg-creatively-blue/20 blur-lg"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            ></div>
            <div 
              className="float-animation-slow float-delay-4 absolute bottom-[10%] right-[25%] w-28 h-28 rounded-full bg-creatively-yellow/20 blur-lg"
              style={{ transform: `translateY(${scrollY * -0.07}px)` }}
            ></div>
            
            {/* Additional decorative elements */}
            <div className="absolute top-[15%] left-[30%] w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-3xl"></div>
            <div className="absolute bottom-[25%] right-[5%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/5 to-green-500/5 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-reveal text-reveal-delay-1 inline-block">Manage</span>{" "}
              <span className="text-reveal text-reveal-delay-2 inline-block">Creative</span>{" "}
              <span className="text-reveal text-reveal-delay-3 inline-block">Projects</span>{" "}
              <span className="gradient-text font-extrabold">Seamlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto fade-in-text">
              <span className="font-medium text-kulibre-purple">kulibre</span> helps creative agencies 
              <span className="highlight-text"> streamline workflows</span>, 
              <span className="highlight-text"> collaborate effectively</span>, and 
              <span className="highlight-text"> deliver exceptional results for their clients</span>.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-reveal text-reveal-delay-3">
              <Link to="/signup">
                <Button size="lg" className="px-8 relative overflow-hidden glow-button button-3d">
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-kulibre-purple to-kulibre-purple/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 hover:border-kulibre-purple/50 transition-colors duration-300 hover-card" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10 h-16 bottom-0 top-auto"></div>

              {/* Feature Highlights */}
              <div className="absolute -top-6 left-10 z-20 float-animation-slow hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-kulibre-purple">
                  <Calendar className="h-5 w-5 text-kulibre-purple" />
                  <div>
                    <p className="text-sm font-semibold">Project Planning</p>
                    <p className="text-xs text-gray-500">Visualize timelines</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 right-10 z-20 float-animation float-delay-1 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-kulibre-orange">
                  <Users className="h-5 w-5 text-kulibre-orange" />
                  <div>
                    <p className="text-sm font-semibold">Team Collaboration</p>
                    <p className="text-xs text-gray-500">Work together seamlessly</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 left-10 z-20 float-animation-slow float-delay-3 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-creatively-yellow">
                  <Zap className="h-5 w-5 text-creatively-yellow" />
                  <div>
                    <p className="text-sm font-semibold">Automated Workflows</p>
                    <p className="text-xs text-gray-500">Save time with automation</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 z-20 float-animation float-delay-4 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-creatively-blue">
                  <BarChart2 className="h-5 w-5 text-creatively-blue" />
                  <div>
                    <p className="text-sm font-semibold">Advanced Analytics</p>
                    <p className="text-xs text-gray-500">Data-driven insights</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/3 right-5 z-20 float-animation-slow float-delay-5 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-creatively-pink">
                  <DollarSign className="h-5 w-5 text-creatively-pink" />
                  <div>
                    <p className="text-sm font-semibold">Budget Tracking</p>
                    <p className="text-xs text-gray-500">Monitor project costs</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-5 z-20 float-animation float-delay-2 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-green-500">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold">Client Approvals</p>
                    <p className="text-xs text-gray-500">Streamlined feedback</p>
                  </div>
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=600&q=80"
                alt="Creatively Dashboard"
                className="rounded-lg shadow-2xl border border-gray-200 mx-auto"
              />
            </div>

            {/* Key Benefits */}
            <div className="mt-16 text-center">
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Key Benefits</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-creatively-purple/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-creatively-purple" />
                  </div>
                  <h3 className="font-semibold mb-2">Streamlined Workflows</h3>
                  <p className="text-sm text-gray-500">Reduce project delivery time by up to 40% with optimized processes</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-creatively-blue/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-creatively-blue" />
                  </div>
                  <h3 className="font-semibold mb-2">Enhanced Collaboration</h3>
                  <p className="text-sm text-gray-500">Keep everyone aligned with real-time updates and communication</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-creatively-green/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <BarChart2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
                  <p className="text-sm text-gray-500">Make informed decisions with comprehensive analytics and reporting</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Companies Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 fade-in-section">
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Trusted by innovative companies</p>
              <h3 className="text-2xl font-semibold text-gray-800">Empowering creative teams worldwide</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
              {/* Company 1 */}
              <div className="flex items-center justify-center company-logo company-logo-animation logo-delay-1">
                <div className="p-4 rounded-lg glass-card hover:shadow-lg transition-all duration-300 w-full h-24 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="ml-2 font-bold text-gray-700">Stackify</span>
                </div>
              </div>
              
              {/* Company 2 */}
              <div className="flex items-center justify-center company-logo company-logo-animation logo-delay-2">
                <div className="p-4 rounded-lg glass-card hover:shadow-lg transition-all duration-300 w-full h-24 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                    <circle cx="12" cy="12" r="10" stroke="#ec4899" strokeWidth="2"/>
                    <path d="M12 8V16" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12H16" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="ml-2 font-bold text-gray-700">Circleplus</span>
                </div>
              </div>
              
              {/* Company 3 */}
              <div className="flex items-center justify-center company-logo company-logo-animation logo-delay-3">
                <div className="p-4 rounded-lg glass-card hover:shadow-lg transition-all duration-300 w-full h-24 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                    <path d="M6 9L12 15L18 9" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="ml-2 font-bold text-gray-700">Wavefront</span>
                </div>
              </div>
              
              {/* Company 4 */}
              <div className="flex items-center justify-center company-logo company-logo-animation logo-delay-4">
                <div className="p-4 rounded-lg glass-card hover:shadow-lg transition-all duration-300 w-full h-24 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#22c55e" strokeWidth="2"/>
                    <path d="M9 12L11 14L15 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="ml-2 font-bold text-gray-700">TaskMaster</span>
                </div>
              </div>
              
              {/* Company 5 */}
              <div className="flex items-center justify-center company-logo company-logo-animation logo-delay-5">
                <div className="p-4 rounded-lg glass-card hover:shadow-lg transition-all duration-300 w-full h-24 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f59e0b" strokeWidth="2"/>
                    <path d="M12 8V16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12H16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="ml-2 font-bold text-gray-700">Innovate</span>
                </div>
              </div>
              
              {/* Company 6 */}
              <div className="flex items-center justify-center company-logo company-logo-animation logo-delay-6">
                <div className="p-4 rounded-lg glass-card hover:shadow-lg transition-all duration-300 w-full h-24 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="ml-2 font-bold text-gray-700">HomeBase</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with scroll animations */}
        <section id="features" className="py-20 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-pattern opacity-50"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 fade-in-section">
              <span className="inline-block px-4 py-1 rounded-full bg-kulibre-purple/10 text-kulibre-purple text-sm font-medium mb-4">Features</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Creative Teams</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage projects, collaborate with your team, and delight your clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-creatively-purple" />}
                title="Visual Project Planning"
                description="Intuitive Kanban boards and Gantt charts that help you visualize project timelines and dependencies."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-creatively-orange" />}
                title="Team Collaboration"
                description="Real-time communication, file sharing, and task assignment to keep everyone on the same page."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-creatively-yellow" />}
                title="Automated Workflows"
                description="Create custom workflows that automate repetitive tasks and keep projects moving forward."
              />
              <FeatureCard
                icon={<BarChart2 className="h-10 w-10 text-creatively-blue" />}
                title="Advanced Analytics"
                description="Gain insights into team performance, project profitability, and resource allocation."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-creatively-green" />}
                title="Client Approvals"
                description="Streamline the review and approval process with clients for faster feedback cycles."
              />
              <FeatureCard
                icon={<DollarSign className="h-10 w-10 text-creatively-pink" />}
                title="Budget Tracking"
                description="Monitor project budgets and expenses to keep your projects profitable."
              />
            </div>
          </div>
        </section>

        {/* How It Works - with enhanced visuals */}
        <section id="how-it-works" className="py-20 bg-kulibre-gray relative">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-gradient-to-bl from-kulibre-purple/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute left-0 top-1/3 w-1/4 h-1/4 bg-gradient-to-tr from-creatively-pink/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 fade-in-section">
              <span className="inline-block px-4 py-1 rounded-full bg-kulibre-purple/10 text-kulibre-purple text-sm font-medium mb-4">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How kulibre Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Getting started is simple. Here's how kulibre transforms your creative workflow.
              </p>
            </div>

            <div className="max-w-4xl mx-auto relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 w-0.5 h-[calc(100%-50px)] bg-gradient-to-b from-kulibre-purple via-creatively-pink to-creatively-blue"></div>
              
              <div className="space-y-16 stagger-children">
                <StepItem
                  number="1"
                  title="Set up your workspace"
                  description="Create your team workspace and invite team members to collaborate on projects."
                />
                <StepItem
                  number="2"
                  title="Create your first project"
                  description="Use our templates or start from scratch to set up your project structure."
                />
                <StepItem
                  number="3"
                  title="Assign tasks and track progress"
                  description="Break down projects into manageable tasks and track progress in real-time."
                />
                <StepItem
                  number="4"
                  title="Collaborate and get feedback"
                  description="Share work with clients, collect feedback, and get approvals all in one place."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials with enhanced visuals */}
        <section id="testimonials" className="py-20 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-pattern opacity-30"></div>
          <div className="absolute -left-20 top-20 w-80 h-80 rounded-full bg-gradient-to-br from-kulibre-purple/10 to-transparent blur-3xl"></div>
          <div className="absolute -right-20 bottom-20 w-80 h-80 rounded-full bg-gradient-to-br from-creatively-pink/10 to-transparent blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 fade-in-section">
              <span className="inline-block px-4 py-1 rounded-full bg-kulibre-purple/10 text-kulibre-purple text-sm font-medium mb-4">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creative teams who've transformed their workflow with kulibre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              <TestimonialCard
                quote="kulibre has revolutionized how we manage our design projects. The client approval workflow is a game-changer."
                author="Sarah Johnson"
                role="Creative Director, DesignHub"
              />
              <TestimonialCard
                quote="We've reduced our project turnaround time by 40% since implementing kulibre. The team collaboration features are unmatched."
                author="Michael Chen"
                role="Agency Owner, Pixel Perfect"
              />
              <TestimonialCard
                quote="As a freelancer, kulibre helps me stay organized and professional with my clients. Worth every penny!"
                author="Alex Rodriguez"
                role="Independent Designer"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-kulibre-purple/5 via-white to-kulibre-purple/10 relative overflow-hidden">
          {/* Background elements for glass effect */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="float-animation-slow absolute top-10 left-[10%] w-32 h-32 rounded-full bg-kulibre-purple/20 blur-lg"></div>
            <div className="float-animation float-delay-2 absolute top-[30%] right-[15%] w-24 h-24 rounded-full bg-creatively-pink/20 blur-lg"></div>
            <div className="float-animation float-delay-3 absolute bottom-[20%] left-[20%] w-40 h-40 rounded-full bg-creatively-blue/20 blur-lg"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 fade-in-section">
              <span className="inline-block px-4 py-1 rounded-full bg-kulibre-purple/10 text-kulibre-purple text-sm font-medium mb-4">Pricing</span>
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that best fits your team's needs. No hidden fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard
                title="Free"
                price="$0"
                description="Perfect for individuals and small projects"
                features={[
                  "Up to 5 Projects",
                  "Basic Task Management",
                  "Collaborative Workspace"
                ]}
                unavailable={[
                  "Advanced Analytics",
                  "Priority Support",
                  "Unlimited Projects"
                ]}
                ctaText="Sign Up Free"
                popular={false}
              />
              <PricingCard
                title="Basic"
                price="$9.99/mo"
                description="Great for growing creative teams"
                features={[
                  "Up to 20 Projects",
                  "Advanced Task Management",
                  "Team Collaboration",
                  "Basic Analytics",
                  "Client Portal"
                ]}
                unavailable={[
                  "Enterprise Features",
                  "Priority Support"
                ]}
                ctaText="Start with Basic"
                popular={true}
              />
              <PricingCard
                title="Premium"
                price="$24.99/mo"
                description="For professional agencies and studios"
                features={[
                  "Unlimited Projects",
                  "Advanced Analytics",
                  "Priority Support",
                  "Custom Integrations",
                  "Advanced Team Management",
                  "Resource Allocation",
                  "White-labeling"
                ]}
                unavailable={[]}
                ctaText="Go Premium"
                popular={false}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the free plan work?</AccordionTrigger>
                  <AccordionContent>
                    Our free plan gives you access to basic project management features for up to 5 projects.
                    You can create tasks, collaborate with team members, and manage deadlines.
                    There's no time limit on the free plan, use it as long as you like.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I upgrade or downgrade my plan later?</AccordionTrigger>
                  <AccordionContent>
                    Yes! You can upgrade or downgrade your plan at any time.
                    When you upgrade, you'll be prorated for the remainder of your billing cycle.
                    When you downgrade, the changes will take effect at the end of your current billing cycle.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Is there a limit to how many team members I can invite?</AccordionTrigger>
                  <AccordionContent>
                    The Free plan allows up to 3 team members, the Basic plan supports up to 10 team members,
                    and the Premium plan offers unlimited team members. Each team member gets their own login
                    and customized permissions based on their role.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What kind of support do you offer?</AccordionTrigger>
                  <AccordionContent>
                    All plans include community support through our knowledge base and forums.
                    Basic plans include email support with a 48-hour response time.
                    Premium plans include priority email support with a response time of 24 hours
                    and access to live chat during business hours.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel your subscription at any time. When you cancel,
                    you'll continue to have access to your paid features until the end of your billing cycle.
                    After that, your account will revert to the free plan.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-kulibre-purple/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Creative Workflow?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of creative teams who've streamlined their processes with kulibre.
            </p>
            <Link to="/signup">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Component for feature cards with enhanced hover effects
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="hover-card h-full fade-in-section border-2 border-gray-100 transition-all duration-300">
      <CardContent className="pt-6 relative overflow-hidden group">
        {/* Background gradient that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-kulibre-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="mb-5 transform group-hover:scale-110 transition-transform duration-300 relative z-10">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-kulibre-purple transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground group-hover:text-gray-700 transition-colors duration-300">{description}</p>
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-kulibre-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </CardContent>
    </Card>
  );
};

// Enhanced component for how it works steps with animations
const StepItem = ({ number, title, description }: { number: string, title: string, description: string }) => {
  return (
    <div className="flex gap-6 group">
      <div className="flex-shrink-0 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-kulibre-purple to-creatively-pink text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative">
          {/* Pulsing effect */}
          <div className="absolute inset-0 rounded-full bg-kulibre-purple animate-ping opacity-20"></div>
          {number}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-kulibre-purple flex-1 transform group-hover:translate-x-2 transition-transform duration-300 hover-card">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-kulibre-purple transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground group-hover:text-gray-700 transition-colors duration-300">{description}</p>
        
        {/* Decorative icon */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-kulibre-purple/50">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

// Component for testimonial cards
const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="mb-4 text-4xl text-creatively-purple/30">"</div>
        <p className="mb-6 italic">{quote}</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for pricing cards
const PricingCard = ({
  title,
  price,
  description,
  features,
  unavailable = [],
  ctaText,
  popular
}: {
  title: string,
  price: string,
  description: string,
  features: string[],
  unavailable?: string[],
  ctaText: string,
  popular: boolean
}) => (
  <Card className={`h-full glass-card hover-card ${
    popular ? 'border-2 border-creatively-purple relative' : ''
  }`}>
    {popular && (
      <div className="absolute top-0 right-0 bg-creatively-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
        Popular
      </div>
    )}
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        {title}
        <div className="rounded-full bg-kulibre-purple/10 p-2">
          <DollarSign className="h-5 w-5 text-kulibre-purple" />
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-3xl font-bold gradient-text">{price}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <div className="rounded-full bg-green-100 p-1">
              <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
        {unavailable.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="rounded-full bg-red-100 p-1">
              <X className="h-3 w-3 text-red-500 flex-shrink-0" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Link to="/signup" className="w-full">
        <Button className={`w-full glow-button ${popular ? 'bg-creatively-purple hover:bg-creatively-purple/90' : ''}`}>
          {ctaText}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);
