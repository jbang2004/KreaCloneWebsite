"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, MicrophoneIcon, SpeakerWaveIcon, LanguageIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";

// 简化的音频波形动画
const AudioWaveAnimation = () => (
  <div className="flex items-center space-x-1 h-8">
    {Array.from({ length: 12 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-primary/60 rounded-full"
        animate={{
          height: [8, 32, 16, 28, 12, 36, 20, 24, 16],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// 简化的数字计数器
const NumberCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = value / 50;
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev + increment >= value) {
            clearInterval(interval);
            return value;
          }
          return prev + increment;
        });
      }, 50);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  return <span>{Math.floor(count).toLocaleString()}{suffix}</span>;
};

// 背景音频波纹效果
const AudioRippleBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-primary/20"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          width: [0, 800, 1200],
          height: [0, 800, 1200],
          opacity: [0.6, 0.3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 1.3,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

export default function AudioVideoHero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* 背景音频波纹 */}
      <AudioRippleBackground />
      
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(180deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <BlurFade delay={0.25} inView>
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8"
            >
              <SpeakerWaveIcon className="w-4 h-4 mr-2" />
              {t("siteTagline")}
            </motion.div>
          </div>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <div className="space-y-6 mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {t("siteName")}
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-6"
            >
              {t("heroTitle")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              {t("heroDescription")}
            </motion.p>
          </div>
        </BlurFade>

        {/* 音频波形动画 */}
        <BlurFade delay={0.6} inView>
          <div className="flex justify-center mb-12">
            <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl">
              <AudioWaveAnimation />
            </div>
          </div>
        </BlurFade>

        {/* 统计数据 */}
        <BlurFade delay={0.75} inView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <motion.div 
              className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <MicrophoneIcon className="w-6 h-6 text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-primary">
                  <NumberCounter value={1000000} suffix="+" />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t("processedHours")}</p>
            </motion.div>

            <motion.div 
              className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <LanguageIcon className="w-6 h-6 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-primary">
                  <NumberCounter value={120} suffix="+" />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t("supportedLanguages")}</p>
            </motion.div>

            <motion.div 
              className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <SpeakerWaveIcon className="w-6 h-6 text-purple-500 mr-2" />
                <span className="text-2xl font-bold text-primary">
                  <NumberCounter value={50000} suffix="+" />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t("activeUsers")}</p>
            </motion.div>

            <motion.div 
              className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <PlayIcon className="w-6 h-6 text-orange-500 mr-2" />
                <span className="text-2xl font-bold text-primary">
                  <NumberCounter value={99} suffix="%" />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t("accuracyRate")}</p>
            </motion.div>
          </div>
        </BlurFade>

        {/* 行动按钮 */}
        <BlurFade delay={0.85} inView>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/audio-transcription">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  {t("tryForFree")}
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/pricing">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                  {t("viewPricing")}
                </Button>
              </motion.div>
            </Link>
          </div>
        </BlurFade>

        {/* 核心功能快速导航 */}
        <BlurFade delay={0.95} inView>
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6">{t("coreFeatures")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { href: "/audio-transcription", icon: MicrophoneIcon, label: t("audioTranscription"), status: 'coming-soon' },
                { href: "/text-to-speech", icon: SpeakerWaveIcon, label: t("textToSpeech"), status: 'coming-soon' },
                { href: "/video-translation", icon: LanguageIcon, label: t("videoTranslation"), status: 'available' }
              ].map((feature, index) => {
                const isComingSoon = feature.status === 'coming-soon';
                
                const NavItem = () => (
                  <motion.div
                    className={`flex items-center space-x-2 px-4 py-3 rounded-full text-sm font-medium border transition-all duration-300 ${
                      isComingSoon 
                        ? 'bg-muted/30 text-muted-foreground/60 border-border/30 cursor-not-allowed'
                        : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-primary hover:text-primary-foreground cursor-pointer'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    whileHover={!isComingSoon ? { scale: 1.05 } : {}}
                  >
                    <feature.icon className="w-4 h-4" />
                    <span>{feature.label}</span>
                    {isComingSoon && <span className="text-xs opacity-75">（即将推出）</span>}
                  </motion.div>
                );

                return isComingSoon ? (
                  <div key={feature.href}>
                    <NavItem />
                  </div>
                ) : (
                  <Link key={feature.href} href={feature.href}>
                    <NavItem />
                  </Link>
                );
              })}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
} 