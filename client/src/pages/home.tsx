import { useLanguage } from "@/hooks/use-language";
import Carousel from "@/components/carousel";
import GenerateSection from "@/components/generate-section";
import GallerySection from "@/components/gallery-section";
import { useCarouselData, useGalleryData } from "@/data/home-data";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const { t } = useLanguage();
  const carouselItems = useCarouselData();
  const galleryItems = useGalleryData();
  
  // References for animations
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const generateRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Apply iOS-style animations on component mount
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // GSAP timeline for sequenced animations
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    // Main page entrance animation
    tl.fromTo(sectionRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.4 }
    );
    
    // Element-specific animations with iOS-like feel
    if (carouselRef.current) {
      tl.fromTo(carouselRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );
    }
    
    if (generateRef.current) {
      // Animate the section container first
      tl.fromTo(generateRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );
      
      // Wait until the DOM is fully updated before querying elements
      setTimeout(() => {
        // Get all cards for staggered animation
        const cards = generateRef.current?.querySelectorAll('.generate-card');
        
        // Only animate if we found cards
        if (cards && cards.length > 0) {
          // iOS-style subtle card animations
          gsap.fromTo(cards,
            { y: 15, opacity: 0, scale: 0.97 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1, 
              duration: 0.4, 
              stagger: 0.05,
              ease: "power2.out",
              clearProps: "all"
            }
          );
        }
      }, 100);
    }
    
    if (galleryRef.current) {
      // Animate the gallery section container
      tl.fromTo(galleryRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );
      
      // Wait until the DOM is fully updated
      setTimeout(() => {
        // Get all gallery items for staggered animation
        const galleryItems = galleryRef.current?.querySelectorAll('.gallery-item');
        
        // Only animate if we found items
        if (galleryItems && galleryItems.length > 0) {
          // Subtle iOS-style animations
          gsap.fromTo(galleryItems,
            { y: 15, opacity: 0, scale: 0.97 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1, 
              duration: 0.4, 
              stagger: 0.05,
              ease: "power2.out",
              clearProps: "all"
            }
          );
        }
      }, 200);
    }
    
    return () => {
      // Clean up animations
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef}>
      <div ref={carouselRef}>
        <Carousel items={carouselItems} />
      </div>
      <div ref={generateRef}>
        <GenerateSection />
      </div>
      <div ref={galleryRef}>
        <GallerySection items={galleryItems} />
      </div>
    </section>
  );
}
