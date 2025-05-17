import React, { useRef, useEffect } from 'react';

// Custom cursor styles
const cursorStyles = `
  .custom-cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    background-color: #7c3aed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.15s ease-in-out;
  }

  .custom-cursor-outline {
    position: fixed;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(124, 58, 237, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease-in-out, height 0.2s ease-in-out, border-color 0.2s ease-in-out;
  }

  /* Cursor hover effect for interactive elements */
  a:hover ~ .custom-cursor-outline,
  button:hover ~ .custom-cursor-outline,
  .interactive:hover ~ .custom-cursor-outline {
    width: 60px;
    height: 60px;
    border-color: rgba(124, 58, 237, 0.8);
  }

  /* Hide default cursor */
  html, body, a, button, .interactive {
    cursor: none !important;
  }
  
  /* Make sure cursor is visible on mobile */
  @media (max-width: 768px) {
    .custom-cursor-dot, .custom-cursor-outline {
      display: none;
    }
    
    html, body, a, button, .interactive {
      cursor: auto !important;
    }
  }
`;

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useEffect(() => {
    // Custom cursor functionality
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    if (!cursorDot || !cursorOutline) return;

    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      
      // Add a slight delay to the outline for a trailing effect
      requestAnimationFrame(() => {
        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;
      });
      
      cursorOutline.style.left = `${clientX}px`;
      cursorOutline.style.top = `${clientY}px`;
    };

    // Detect interactive elements for cursor size change
    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'a' || 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.classList.contains('interactive')
      ) {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.borderColor = 'rgba(124, 58, 237, 0.8)';
      }
    };

    const handleMouseOut = () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorOutline.style.borderColor = 'rgba(124, 58, 237, 0.5)';
    };

    // Hide cursor when leaving the window
    const handleMouseLeave = () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    };

    // Add event listeners
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cursorStyles }} />
      <div ref={cursorDotRef} className="custom-cursor-dot"></div>
      <div ref={cursorOutlineRef} className="custom-cursor-outline"></div>
    </>
  );
}