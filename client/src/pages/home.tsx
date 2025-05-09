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
      // Get all cards for staggered animation
      const cards = generateRef.current.querySelectorAll('.generate-card');
      
      tl.fromTo(generateRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );
      
      // iOS-style subtle card animations
      tl.fromTo(cards,
        { y: 15, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05 },
        "-=0.3"
      );
    }
    
    if (galleryRef.current) {
      const galleryItems = galleryRef.current.querySelectorAll('.gallery-item');
      
      tl.fromTo(galleryRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );
      
      // Subtle card animations similar to iOS app animations
      tl.fromTo(galleryItems,
        { y: 15, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05 },
        "-=0.3"
      );
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
