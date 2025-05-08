import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleAnimation, { ParticleType } from './particle-animations/ParticleAnimation';

interface PageTransitionProps {
  children: ReactNode;
  location: string;
  previousLocation: string;
}

// 根据页面路径决定应该使用哪种粒子效果
function getParticleTypeForRoute(route: string): ParticleType {
  if (route === '/audio-transcription') return 'audio';
  if (route === '/text-to-speech') return 'speech';
  if (route === '/video-translation') return 'video';
  return 'default';
}

export default function PageTransition({ children, location, previousLocation }: PageTransitionProps) {
  const [showParticles, setShowParticles] = useState(false);
  const [particleType, setParticleType] = useState<ParticleType>('default');
  
  // 当路由变化时，显示过渡动画
  useEffect(() => {
    if (location !== previousLocation) {
      const newParticleType = getParticleTypeForRoute(location);
      setParticleType(newParticleType);
      setShowParticles(true);
    }
  }, [location, previousLocation]);
  
  // 动画完成后隐藏粒子效果
  const handleAnimationComplete = () => {
    setShowParticles(false);
  };

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {showParticles && (
        <ParticleAnimation 
          type={particleType}
          onComplete={handleAnimationComplete}
          duration={2500}
          intensity="high"
        />
      )}
    </div>
  );
}