import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';

// Common animation URLs for our app features
const ANIMATION_URLS = {
  microphone: 'https://assets9.lottiefiles.com/packages/lf20_mf5j5kua.json',
  speech: 'https://assets3.lottiefiles.com/packages/lf20_ed9hgzcr.json',
  video: 'https://assets2.lottiefiles.com/packages/lf20_vvvie0sh.json',
  image: 'https://assets3.lottiefiles.com/packages/lf20_tedgenft.json',
  enhance: 'https://assets3.lottiefiles.com/packages/lf20_q0tn33qu.json',
  loading: 'https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json',
  success: 'https://assets2.lottiefiles.com/packages/lf20_ydo1amjm.json',
};

export type AnimationType = keyof typeof ANIMATION_URLS;

interface LottieAnimationProps {
  type: AnimationType;
  className?: string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export default function LottieAnimation({
  type,
  className,
  width = 120,
  height = 120,
  loop = true,
  autoplay = true,
  speed = 1,
  onComplete,
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically fetch the animation JSON
    const fetchAnimation = async () => {
      try {
        const url = ANIMATION_URLS[type];
        const response = await fetch(url);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    fetchAnimation();
  }, [type]);

  // Apply speed when lottieRef or speed changes
  useEffect(() => {
    if (lottieRef.current && speed !== 1) {
      lottieRef.current.setSpeed(speed);
    }
  }, [lottieRef, speed]);

  if (!animationData) {
    return <div className={cn("animate-pulse bg-muted rounded-xl", className)} style={{ width, height }} />;
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        lottieRef={lottieRef}
        style={{ width, height }}
        onComplete={onComplete}
      />
    </div>
  );
}