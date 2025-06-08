"use client";

import { motion } from "framer-motion";
import { MicrophoneIcon, SpeakerWaveIcon, LanguageIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";

interface FeatureData {
  title: string;
  description: string;
  features: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  badge?: string;
  status: 'available' | 'coming-soon';
}

export default function AudioVideoFeatures() {
  const { t } = useLanguage();

  const featuresData: FeatureData[] = [
    {
      title: t("audioTranscriptionTitle"),
      description: t("audioTranscriptionDesc"),
      features: t("audioTranscriptionFeatures"),
      icon: <MicrophoneIcon className="w-8 h-8" />,
      href: "/audio-transcription",
      gradient: "from-blue-500 to-cyan-500",
      badge: "即将推出",
      status: 'coming-soon'
    },
    {
      title: t("textToSpeechTitle"),
      description: t("textToSpeechDesc"),
      features: t("textToSpeechFeatures"),
      icon: <SpeakerWaveIcon className="w-8 h-8" />,
      href: "/text-to-speech",
      gradient: "from-purple-500 to-pink-500",
      badge: "即将推出",
      status: 'coming-soon'
    },
    {
      title: t("videoTranslationTitle"),
      description: t("videoTranslationDesc"),
      features: t("videoTranslationFeatures"),
      icon: <LanguageIcon className="w-8 h-8" />,
      href: "/video-translation",
      gradient: "from-green-500 to-teal-500",
      badge: "已上线",
      status: 'available'
    }
  ];

  const FeatureCard = ({ feature, index }: { feature: FeatureData; index: number }) => {
    const isComingSoon = feature.status === 'coming-soon';
    
    const CardContent = () => (
      <div className={`relative p-8 h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl transition-all duration-300 overflow-hidden ${
        isComingSoon 
          ? 'opacity-75 cursor-not-allowed' 
          : 'hover:bg-card/80 hover:border-border hover:shadow-2xl hover:-translate-y-2'
      } group`}>
        {/* 渐变背景 */}
        {!isComingSoon && (
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        )}
        
        {/* 即将推出的遮罩 */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-muted/20 backdrop-blur-[1px] rounded-3xl" />
        )}
        
        {/* Badge */}
        <div className="absolute top-6 right-6">
          <Badge 
            variant={isComingSoon ? "secondary" : "default"} 
            className={`text-xs ${
              isComingSoon 
                ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                : 'bg-green-100 text-green-700 border-green-300'
            }`}
          >
            {isComingSoon && <ClockIcon className="w-3 h-3 mr-1" />}
            {feature.badge}
          </Badge>
        </div>

        {/* 图标 */}
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 ${
          isComingSoon ? 'opacity-60' : 'group-hover:scale-110'
        } transition-transform duration-300`}>
          <div className="text-white">
            {feature.icon}
          </div>
        </div>

        {/* 标题和描述 */}
        <h3 className={`text-2xl font-bold mb-4 transition-colors ${
          isComingSoon ? 'text-muted-foreground' : 'group-hover:text-primary'
        }`}>
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-base mb-6 leading-relaxed">
          {feature.description}
        </p>

        {/* 功能特性 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {feature.features.split(" • ").map((item, idx) => (
              <div key={idx} className={`flex items-center text-sm bg-muted/30 px-3 py-1 rounded-full ${
                isComingSoon ? 'text-muted-foreground/60' : 'text-muted-foreground'
              }`}>
                <CheckCircleIcon className={`w-3 h-3 mr-2 flex-shrink-0 ${
                  isComingSoon ? 'text-muted-foreground/60' : 'text-green-500'
                }`} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 按钮 */}
        <Button 
          className={`w-full transition-all duration-300 ${
            isComingSoon 
              ? 'bg-muted/50 text-muted-foreground cursor-not-allowed hover:bg-muted/50 hover:text-muted-foreground' 
              : 'group-hover:bg-primary group-hover:text-primary-foreground'
          }`}
          variant="outline"
          size="lg"
          disabled={isComingSoon}
        >
          {isComingSoon ? '即将推出' : '开始使用'}
          {!isComingSoon && (
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          )}
          {isComingSoon && (
            <ClockIcon className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="group relative"
      >
        {isComingSoon ? (
          <CardContent />
        ) : (
          <Link href={feature.href}>
            <CardContent />
          </Link>
        )}
      </motion.div>
    );
  };

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <BlurFade delay={0.25} inView>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
            >
              <SpeakerWaveIcon className="w-4 h-4 mr-2" />
              {t("coreFeatures")}
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                专业音视频AI处理
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              基于最先进的AI技术，为您提供专业级的音频转录、语音合成和视频翻译服务。
              无论是内容创作、企业办公还是教育培训，都能找到适合的解决方案。
            </p>
          </div>
        </BlurFade>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* 底部CTA */}
        <BlurFade delay={0.8} inView>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-4">
                需要定制化解决方案？
              </h3>
              <p className="text-muted-foreground mb-6">
                我们提供企业级API接入和定制化服务，满足您的特殊需求。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button size="lg" className="px-8 py-3">
                    查看企业方案
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    联系销售团队
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
} 