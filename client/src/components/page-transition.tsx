import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

interface PageTransitionProps {
  children: ReactNode;
  location: string;
  previousLocation: string;
}

export default function PageTransition({ children, location, previousLocation }: PageTransitionProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isInitialRender = previousLocation === "";
  const shouldAnimate = !isInitialRender && location !== previousLocation;
  
  // Define all navigation paths for determining transition direction
  const navPaths = ["/", "/image", "/video", "/audio-transcription", "/text-to-speech", "/video-translation", "/enhancer", "/pricing", "/auth"]; 
  const currentIndex = navPaths.indexOf(location);
  const previousIndex = navPaths.indexOf(previousLocation);
  const direction = currentIndex > previousIndex ? 1 : -1;

  useEffect(() => {
    if (!shouldAnimate || !pageRef.current) return;

    // iOS style page slide animation
    // Clear any existing animations
    gsap.killTweensOf(pageRef.current);
    
    // Create a timeline for smoother animation sequencing
    const tl = gsap.timeline({
      defaults: { 
        ease: "power1.out", 
        duration: 0.25 // Faster for iOS-like quick transitions
      }
    });
    
    // First make sure the current page is visible
    tl.set(pageRef.current, {
      clearProps: "all",
      visibility: "visible"
    });
    
    // No page transition animation, just make the page visible immediately
    tl.set(pageRef.current, { 
      opacity: 1,
      scale: 1,
      clearProps: "all"
    });
    
    // Wait for the DOM to fully update before animating children
    setTimeout(() => {
      // Target elements for iOS-style staggered animation
      if (childrenRef.current) {
        // Clear any existing animations on children
        gsap.killTweensOf(childrenRef.current.children);
        
        // Select various elements to animate
        const headingElements = childrenRef.current.querySelectorAll('h1, h2, h3');
        const paragraphElements = childrenRef.current.querySelectorAll('p');
        const containerElements = childrenRef.current.querySelectorAll('.generate-card, .gallery-item');
        const buttonElements = childrenRef.current.querySelectorAll('button, a');
        
        // Create a timeline for child elements with quicker animations
        const childTl = gsap.timeline({
          defaults: {
            ease: "power1.out",
            duration: 0.2, // Faster animations
            clearProps: "all" // Clean up properties when done
          }
        });
        
        // iOS-style entrance animation for headings - quick fade in with slight scaling
        if (headingElements.length > 0) {
          childTl.fromTo(
            headingElements,
            { 
              opacity: 0,
              scale: 0.98
            },
            { 
              opacity: 1,
              scale: 1,
              stagger: 0.02
            },
            0
          );
        }
        
        // Animation for paragraphs and text elements - slightly delayed
        if (paragraphElements.length > 0) {
          childTl.fromTo(
            paragraphElements,
            { 
              opacity: 0,
              scale: 0.98
            },
            { 
              opacity: 1,
              scale: 1,
              stagger: 0.015,
              delay: 0.03
            },
            0.05
          );
        }
        
        // Animation for containers and cards
        if (containerElements.length > 0) {
          childTl.fromTo(
            containerElements,
            { 
              opacity: 0,
              scale: 0.95
            },
            { 
              opacity: 1,
              scale: 1,
              stagger: 0.02,
              delay: 0.05
            },
            0.1
          );
        }
        
        // Animation for buttons and links
        if (buttonElements.length > 0) {
          childTl.fromTo(
            buttonElements,
            {
              opacity: 0,
              scale: 0.97
            },
            {
              opacity: 1,
              scale: 1,
              stagger: 0.01,
              delay: 0.05
            },
            0.15
          );
        }
      }
    }, 50); // Faster start of animations
    
    // Return cleanup function
    return () => {
      if (pageRef.current) {
        gsap.killTweensOf(pageRef.current);
      }
      if (childrenRef.current) {
        gsap.killTweensOf(childrenRef.current.children);
      }
    };
  }, [location, shouldAnimate, direction]);

  return (
    <div 
      ref={pageRef} 
      className="min-h-screen w-full overflow-x-hidden"
      style={{ 
        opacity: isInitialRender ? 1 : shouldAnimate ? 0 : 1
      }}
    >
      <div ref={childrenRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
