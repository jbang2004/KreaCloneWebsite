import { useLanguage } from "@/hooks/use-language";
import Carousel from "@/components/carousel";
import GenerateSection from "@/components/generate-section";
import GallerySection from "@/components/gallery-section";
import { useCarouselData, useGalleryData } from "@/data/home-data";

export default function Home() {
  const { t } = useLanguage();
  const carouselItems = useCarouselData();
  const galleryItems = useGalleryData();

  return (
    <section>
      <Carousel items={carouselItems} />
      <GenerateSection />
      <GallerySection items={galleryItems} />
    </section>
  );
}
