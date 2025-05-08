import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 定义动画类型
export type AnimationType = 'audio' | 'speech' | 'video' | 'default';

interface AnimatedBackgroundProps {
  type: AnimationType;
  className?: string;
  onComplete?: () => void;
  duration?: number; // 动画持续时间（毫秒）
  autoPlay?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

// 为不同类型的动画设置不同的颜色和形状
const getAnimationConfig = (type: AnimationType, intensity: string) => {
  const particleCount = intensity === 'high' ? 40 : intensity === 'medium' ? 25 : 15;
  
  switch (type) {
    case 'audio':
      return {
        colors: ['#4F46E5', '#7C3AED', '#2563EB'],
        particleCount,
        pattern: 'waveform'
      };
    case 'speech':
      return {
        colors: ['#10B981', '#059669', '#047857'],
        particleCount,
        pattern: 'circular'
      };
    case 'video':
      return {
        colors: ['#F59E0B', '#D97706', '#B45309'],
        particleCount,
        pattern: 'rectangle'
      };
    default:
      return {
        colors: ['#60A5FA', '#3B82F6', '#2563EB'],
        particleCount,
        pattern: 'random'
      };
  }
};

// 生成随机粒子
const generateParticles = (count: number, colors: string[], pattern: string) => {
  return Array.from({ length: count }).map((_, index) => {
    // 基于模式生成不同的位置和动画
    let x, y, size, delay, duration, scale;
    
    // 随机尺寸 (较小)
    size = Math.random() * 10 + 5;
    
    // 随机延迟和持续时间 (动画变速)
    delay = Math.random() * 2;
    duration = Math.random() * 3 + 2;
    
    // 初始缩放比例
    scale = Math.random() * 0.5 + 0.5;
    
    // 根据不同模式设置不同的位置分布
    if (pattern === 'waveform') {
      // 音频波形模式 - 横向分布
      x = (index / count) * 100; // 均匀分布在x轴
      y = 40 + Math.sin(index * 0.5) * 30; // 波浪形分布
    } else if (pattern === 'circular') {
      // 语音模式 - 圆形分布
      const angle = (index / count) * Math.PI * 2;
      const radius = Math.random() * 40 + 10;
      x = 50 + Math.cos(angle) * radius;
      y = 50 + Math.sin(angle) * radius;
    } else if (pattern === 'rectangle') {
      // 视频模式 - 矩形框架
      const side = index % 4; // 0=上，1=右，2=下，3=左
      const sidePos = (index / 4) % 1; // 在边上的相对位置
      
      if (side === 0) {
        x = sidePos * 80 + 10;
        y = 10;
      } else if (side === 1) {
        x = 90;
        y = sidePos * 80 + 10;
      } else if (side === 2) {
        x = (1 - sidePos) * 80 + 10;
        y = 90;
      } else {
        x = 10;
        y = (1 - sidePos) * 80 + 10;
      }
    } else {
      // 默认随机分布
      x = Math.random() * 100;
      y = Math.random() * 100;
    }
    
    // 随机选择颜色
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return { x, y, size, color, delay, duration, scale };
  });
};

export default function AnimatedBackground({
  type,
  className = '',
  onComplete,
  duration = 5000,
  autoPlay = true,
  intensity = 'medium'
}: AnimatedBackgroundProps) {
  const [isVisible, setIsVisible] = useState(autoPlay);
  const [particles, setParticles] = useState<any[]>([]);
  
  // 初始化粒子
  useEffect(() => {
    if (isVisible) {
      const config = getAnimationConfig(type, intensity);
      const newParticles = generateParticles(
        config.particleCount, 
        config.colors,
        config.pattern
      );
      setParticles(newParticles);
    }
  }, [isVisible, type, intensity]);
  
  // 动画完成后的回调
  useEffect(() => {
    if (!isVisible || !onComplete) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [isVisible, onComplete, duration]);
  
  // 如果不可见，就不渲染
  if (!isVisible) return null;
  
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ 
        background: 'transparent',
        zIndex: 0 
      }}
    >
      {particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            zIndex: 0,
            opacity: 0.6,
            filter: 'blur(1px)'
          }}
          initial={{ 
            scale: 0,
            opacity: 0 
          }}
          animate={{ 
            scale: [0, particle.scale, particle.scale * 0.8, particle.scale],
            opacity: [0, 0.7, 0.5, 0],
            x: type === 'audio' ? [0, Math.random() * 20 - 10] : 0,
            y: type === 'speech' ? [0, Math.random() * 20 - 10] : 0,
          }}
          transition={{ 
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
    </div>
  );
}