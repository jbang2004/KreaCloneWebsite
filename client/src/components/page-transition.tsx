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
    
    // First make sure the current page is visible
    gsap.set(pageRef.current, {clearProps: "all"});
    
    // Run the iOS-style slide animation
    gsap.fromTo(
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
        clearProps: "all" // Clean up after animation
      }
    );

    // Target elements for iOS-style staggered animation
    if (childrenRef.current) {
      // Clear any existing animations on children
      gsap.killTweensOf(childrenRef.current.children);
      
      // Select child elements to animate
      const childElements = childrenRef.current.querySelectorAll(
        ':scope > div, :scope > section, :scope > header, :scope > main, ' +
        ':scope > div > div, :scope > section > div, ' +
        ':scope > div > h1, :scope > div > h2, :scope > div > p, ' +
        ':scope > section > h1, :scope > section > h2, :scope > section > p'
      );
      
      // iOS-style entrance animation for UI elements
      gsap.fromTo(
        childElements,
        { 
          y: 20, 
          opacity: 0,
          scale: 0.99
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1, 
          duration: 0.3, 
          stagger: 0.03, // Faster stagger for iOS feel
          delay: 0.15,   // Slightly quicker start
          ease: "power2.out",
          clearProps: "all" // Clean up after animation
        }
      );
      
      // Add subtle fade for buttons and interactive elements
      const interactiveElements = childrenRef.current.querySelectorAll(
        'button, a, .card, input, select, textarea'
      );
      
      gsap.fromTo(
        interactiveElements,
        {
          opacity: 0,
          y: 10,
          scale: 0.97
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.25,
          stagger: 0.02,
          delay: 0.25,
          ease: "power3.out",
          clearProps: "all"
        }
      );
    }
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
