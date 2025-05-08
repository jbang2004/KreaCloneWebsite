import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground, { AnimationType } from './AnimatedBackground';

interface PageTransitionProps {
  children: ReactNode;
  location: string;
  previousLocation: string;
}

// 根据页面路径决定应该使用哪种动画效果
function getAnimationTypeForRoute(route: string): AnimationType {
  if (route === '/audio-transcription') return 'audio';
  if (route === '/text-to-speech') return 'speech';
  if (route === '/video-translation') return 'video';
  return 'default';
}

export default function PageTransition({ children, location, previousLocation }: PageTransitionProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType>('default');
  
  // 当路由变化时，显示过渡动画
  useEffect(() => {
    if (location !== previousLocation) {
      const newAnimationType = getAnimationTypeForRoute(location);
      setAnimationType(newAnimationType);
      setShowAnimation(true);
    }
  }, [location, previousLocation]);
  
  // 动画完成后隐藏动画效果
  const handleAnimationComplete = () => {
    setShowAnimation(false);
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
      
      {showAnimation && (
        <AnimatedBackground 
          type={animationType}
          onComplete={handleAnimationComplete}
          duration={2500}
          intensity="high"
        />
      )}
    </div>
  );
}