import React, { useRef, useEffect, useState } from 'react';

// Enhanced custom cursor styles with trail effect
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
    transition: opacity 0.15s ease-in-out, background-color 0.3s ease;
    box-shadow: 0 0 10px rgba(124, 58, 237, 0.8);
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
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                height 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                border-color 0.3s ease-in-out,
                border-width 0.3s ease;
  }

  .cursor-trail {
    position: fixed;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(124, 58, 237, 0.3);
    pointer-events: none;
    z-index: 9997;
    transform: translate(-50%, -50%);
    transition: opacity 0.5s ease;
  }

  /* Cursor hover effect for interactive elements */
  a:hover ~ .custom-cursor-outline,
  button:hover ~ .custom-cursor-outline,
  .interactive:hover ~ .custom-cursor-outline {
    width: 70px;
    height: 70px;
    border-color: rgba(124, 58, 237, 0.9);
    border-width: 3px;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Special effect for buttons */
  button:hover ~ .custom-cursor-dot {
    background-color: #ec4899;
    box-shadow: 0 0 15px rgba(236, 72, 153, 0.8);
  }

  /* Hide default cursor */
  html, body, a, button, .interactive {
    cursor: none !important;
  }
  
  /* Make sure cursor is visible on mobile */
  @media (max-width: 768px) {
    .custom-cursor-dot, .custom-cursor-outline, .cursor-trail {
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
  const [trails, setTrails] = useState([]);
  const trailsRef = useRef([]);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Create and manage cursor trails
  useEffect(() => {
    const createTrailElements = () => {
      const trailElements = [];
      const trailCount = 8; // Number of trail elements
      
      for (let i = 0; i < trailCount; i++) {
        const trail = {
          id: i,
          x: 0,
          y: 0,
          opacity: 1 - (i / trailCount),
          size: 8 - (i * 0.7)
        };
        trailElements.push(trail);
      }
      
      setTrails(trailElements);
      trailsRef.current = trailElements;
    };
    
    createTrailElements();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Animation loop for trail effect
  const animateTrails = (time) => {
    if (previousTimeRef.current === 0) {
      previousTimeRef.current = time;
    }
    
    const { x, y } = mousePositionRef.current;
    
    // Update trail positions with delay
    const updatedTrails = trailsRef.current.map((trail, index) => {
      // Add delay based on trail index
      const delay = index * 2;
      
      // Calculate new position with easing
      const newX = trail.x + (x - trail.x) / (delay + 1);
      const newY = trail.y + (y - trail.y) / (delay + 1);
      
      return {
        ...trail,
        x: newX,
        y: newY
      };
    });
    
    trailsRef.current = updatedTrails;
    setTrails(updatedTrails);
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateTrails);
  };

  useEffect(() => {
    // Custom cursor functionality
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    if (!cursorDot || !cursorOutline) return;

    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      mousePositionRef.current = { x: clientX, y: clientY };
      
      // Move the main cursor dot immediately
      requestAnimationFrame(() => {
        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;
      });
      
      // Add a slight delay to the outline for a trailing effect
      setTimeout(() => {
        cursorOutline.style.left = `${clientX}px`;
        cursorOutline.style.top = `${clientY}px`;
      }, 50);
    };

    // Detect interactive elements for cursor size change
    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'a' || 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.classList.contains('interactive')
      ) {
        cursorOutline.style.width = '70px';
        cursorOutline.style.height = '70px';
        cursorOutline.style.borderColor = 'rgba(124, 58, 237, 0.9)';
        cursorOutline.style.borderWidth = '3px';
        
        if (e.target.tagName.toLowerCase() === 'button') {
          cursorDot.style.backgroundColor = '#ec4899';
          cursorDot.style.boxShadow = '0 0 15px rgba(236, 72, 153, 0.8)';
        }
      }
    };

    const handleMouseOut = () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorOutline.style.borderColor = 'rgba(124, 58, 237, 0.5)';
      cursorOutline.style.borderWidth = '2px';
      cursorDot.style.backgroundColor = '#7c3aed';
      cursorDot.style.boxShadow = '0 0 10px rgba(124, 58, 237, 0.8)';
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

    // Add click effect
    const handleMouseDown = () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.7)';
    };
    
    const handleMouseUp = () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    // Start animation loop
    requestRef.current = requestAnimationFrame(animateTrails);

    // Add event listeners
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cursorStyles }} />
      <div ref={cursorDotRef} className="custom-cursor-dot"></div>
      <div ref={cursorOutlineRef} className="custom-cursor-outline"></div>
      
      {/* Render trail elements */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            opacity: trail.opacity,
            width: `${trail.size}px`,
            height: `${trail.size}px`
          }}
        />
      ))}
    </>
  );
}