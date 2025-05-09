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
    gsap.fromTo(
      pageRef.current,
      { 
        x: direction * window.innerWidth * 0.3,
        opacity: 0
      },
      { 
        x: 0, 
        opacity: 1,
        duration: 0.5,
        ease: "power1.out"
      }
    );

    // Target all first-level children for staggered animation
    if (childrenRef.current) {
      const childElements = childrenRef.current.querySelectorAll(':scope > div, :scope > section, :scope > header, :scope > main');
      
      // Staggered entrance animation for child elements (iOS style)
      gsap.fromTo(
        childElements,
        { 
          y: 15, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.05,
          delay: 0.2,
          ease: "power2.out" 
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
