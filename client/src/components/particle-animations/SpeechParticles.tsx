import { useState, useEffect } from 'react';
import ParticleAnimation from './ParticleAnimation';

interface SpeechParticlesProps {
  className?: string;
  isActive?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export default function SpeechParticles({ 
  className = '', 
  isActive = true, 
  intensity = 'medium' 
}: SpeechParticlesProps) {
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
    <ParticleAnimation
      type="speech"
      className={className}
      autoPlay={true}
      duration={0} // 无限持续
      intensity={intensity}
    />
  );
}