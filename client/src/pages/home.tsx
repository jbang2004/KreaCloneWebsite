import { useLanguage } from "@/hooks/use-language";
import Carousel from "@/components/carousel";
import GenerateSection from "@/components/generate-section";
import GallerySection from "@/components/gallery-section";
import { useCarouselData, useGalleryData } from "@/data/home-data";
import StaggeredAnimation from "@/components/staggered-animation";

export default function Home() {
  const { t } = useLanguage();
  const carouselItems = useCarouselData();
  const galleryItems = useGalleryData();

  return (
    <section className="max-w-7xl mx-auto">
      <StaggeredAnimation staggerDelay={0.15} initialY={20}>
        <div>
          <Carousel items={carouselItems} />
        </div>
        <div className="mt-12">
          <GenerateSection />
        </div>
        <div className="mt-12">
          <GallerySection items={galleryItems} />
        </div>
      </StaggeredAnimation>
    </section>
  );
}
