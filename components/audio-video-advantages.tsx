"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Globe, 
  Clock,
  Users,
  Award,
  CheckCircle
} from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useLanguage } from "@/hooks/use-language";

interface Advantage {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

export default function AudioVideoAdvantages() {
  const { t } = useLanguage();

  const advantages: Advantage[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("fastProcessing"),
      description: t("fastProcessingDesc"),
      stat: "10倍",
      statLabel: "处理速度提升"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: t("highAccuracy"),
      description: t("highAccuracyDesc"),
      stat: "99%+",
      statLabel: "准确率"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t("multiLanguage"),
      description: t("multiLanguageDesc"),
      stat: "120+",
      statLabel: "支持语言"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("securePrivate"),
      description: t("securePrivateDesc"),
      stat: "100%",
      statLabel: "数据安全"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t("realTimeProcessing"),
      description: t("realTimeProcessingDesc"),
      stat: "<1s",
      statLabel: "响应时间"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("easyIntegration"),
      description: t("easyIntegrationDesc"),
      stat: "24/7",
      statLabel: "技术支持"
    }
  ];

  const AdvantageCard = ({ advantage, index }: { advantage: Advantage; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative p-6 h-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-card/60 hover:border-border transition-all duration-300 overflow-hidden">
        {/* 悬浮时的渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 图标和统计 */}
        <div className="relative flex items-start justify-between mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            {advantage.icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{advantage.stat}</div>
            <div className="text-xs text-muted-foreground">{advantage.statLabel}</div>
          </div>
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
          {advantage.title}
        </h3>

        {/* 描述 */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {advantage.description}
        </p>
      </div>
    </motion.div>
  );

  const StatCard = ({ icon, number, label, delay }: { 
    icon: React.ReactNode; 
    number: string; 
    label: string; 
    delay: number; 
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );

  return (
    <section className="py-24 bg-background">
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
              <Award className="w-4 h-4 mr-2" />
              {t("whyChooseUs")}
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                技术领先的音视频AI
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("featuresDescription")}
            </p>
          </div>
        </BlurFade>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <StatCard 
            icon={<Clock className="w-8 h-8" />} 
            number="<1s" 
            label="平均响应时间" 
            delay={0.2} 
          />
          <StatCard 
            icon={<Users className="w-8 h-8" />} 
            number="50K+" 
            label="企业用户" 
            delay={0.3} 
          />
          <StatCard 
            icon={<Zap className="w-8 h-8" />} 
            number="99.9%" 
            label="服务可用性" 
            delay={0.4} 
          />
          <StatCard 
            icon={<Shield className="w-8 h-8" />} 
            number="100%" 
            label="数据安全" 
            delay={0.5} 
          />
        </div>

        {/* 优势网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {advantages.map((advantage, index) => (
            <AdvantageCard key={advantage.title} advantage={advantage} index={index} />
          ))}
        </div>

        {/* 技术认证 */}
        <BlurFade delay={0.8} inView>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-semibold mb-4">企业级技术保障</h3>
              <p className="text-muted-foreground mb-8">
                通过多项国际认证，为您的音视频处理需求提供可靠保障
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
              {[
                "ISO 27001", "SOC 2 Type II", "GDPR", "CCPA", 
                "AWS Partner", "Google Cloud", "Azure", "HIPAA"
              ].map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm font-medium border border-border/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{cert}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
} 