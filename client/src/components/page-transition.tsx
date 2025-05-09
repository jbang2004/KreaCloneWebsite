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
        ease: "power2.out", 
        duration: 0.35
      }
    });
    
    // First make sure the current page is visible
    tl.set(pageRef.current, {
      clearProps: "all",
      visibility: "visible"
    });
    
    // Run the iOS-style slide animation
    tl.fromTo(
      pageRef.current,
      { 
        x: direction * window.innerWidth * 0.15, // Subtler slide
        opacity: 0,
        scale: 0.98 // Slight scaling effect
      },
      { 
        x: 0, 
        opacity: 1,
        scale: 1,
        duration: 0.35, // Faster, iOS-like
        ease: "power2.out", // More iOS-like easing
      }
    );
    
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
        
        // iOS-style entrance animation for headings
        if (headingElements.length > 0) {
          gsap.fromTo(
            headingElements,
            { 
              y: 15, 
              opacity: 0
            },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.3, 
              stagger: 0.03,
              ease: "power2.out"
            }
          );
        }
        
        // Animation for paragraphs and text elements
        if (paragraphElements.length > 0) {
          gsap.fromTo(
            paragraphElements,
            { 
              y: 10, 
              opacity: 0
            },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.3, 
              stagger: 0.02,
              delay: 0.05,
              ease: "power2.out"
            }
          );
        }
        
        // Animation for containers and cards
        if (containerElements.length > 0) {
          gsap.fromTo(
            containerElements,
            { 
              y: 15, 
              opacity: 0,
              scale: 0.97
            },
            { 
              y: 0, 
              opacity: 1,
              scale: 1, 
              duration: 0.4, 
              stagger: 0.05,
              delay: 0.1,
              ease: "power2.out"
            }
          );
        }
        
        // Animation for buttons and links
        if (buttonElements.length > 0) {
          gsap.fromTo(
            buttonElements,
            {
              opacity: 0,
              y: 5,
              scale: 0.97
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.25,
              stagger: 0.02,
              delay: 0.2,
              ease: "power3.out"
            }
          );
        }
      }
    }, 100);
    
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
      style={{ opacity: isInitialRender ? 1 : shouldAnimate ? 0 : 1 }}
    >
      <div ref={childrenRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
