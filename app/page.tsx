'use client';

import { Suspense } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import Carousel from "@/components/carousel";
import GenerateSection from "@/components/generate-section";
import GallerySection from "@/components/gallery-section";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto">
      <BlurFade delay={0.25} inView={true}>
        <div>
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
            <Carousel />
          </Suspense>
        </div>
      </BlurFade>
      <BlurFade delay={0.25 + 0.15} inView={true}>
        <div className="mt-12">
          <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
            <GenerateSection />
          </Suspense>
        </div>
      </BlurFade>
      <BlurFade delay={0.25 + 0.15 + 0.15} inView={true}>
        <div className="mt-12">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
            <GallerySection />
          </Suspense>
        </div>
      </BlurFade>
    </section>
  );
}
