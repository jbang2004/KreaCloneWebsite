import { useState, useEffect } from 'react';
import AnimatedBackground from './AnimatedBackground';

interface VideoAnimationProps {
  className?: string;
  isActive?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export default function VideoAnimation({
  className = '',
  isActive = true,
  intensity = 'medium'
}: VideoAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // 当组件挂载或isActive变化时控制可见性
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);
  
  if (!isVisible) return null;
  
  return (
    <AnimatedBackground
      type="video"
      className={className}
      autoPlay={true}
      duration={0} // 无限持续
      intensity={intensity}
    />
  );
}