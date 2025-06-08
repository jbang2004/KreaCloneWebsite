'use client';

import AudioVideoHero from "@/components/audio-video-hero";
import AudioVideoFeatures from "@/components/audio-video-features";
import AudioVideoAdvantages from "@/components/audio-video-advantages";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 音视频AI处理平台英雄区域 */}
      <AudioVideoHero />
      
      {/* 核心功能展示区域 */}
      <AudioVideoFeatures />
      
      {/* 平台优势区域 */}
      <AudioVideoAdvantages />
    </main>
  );
}
