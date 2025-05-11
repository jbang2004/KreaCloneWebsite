import { motion } from "framer-motion";

interface GlassmorphicLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function GlassmorphicLoader({ 
  size = "md", 
  className = "" 
}: GlassmorphicLoaderProps) {
  // 根据尺寸设置合适的大小
  const dimensions = {
    sm: { outer: "h-16 w-16", inner: "h-12 w-12" },
    md: { outer: "h-24 w-24", inner: "h-20 w-20" },
    lg: { outer: "h-32 w-32", inner: "h-28 w-28" },
  };

  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 2
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 外层玻璃态容器 */}
      <div className={`${dimensions[size].outer} rounded-full flex items-center justify-center bg-white/20 backdrop-blur-lg shadow-lg dark:bg-gray-800/30`}>
        {/* 动画加载环 */}
        <motion.div
          className={`${dimensions[size].inner} rounded-full border-4 border-transparent border-t-primary border-b-primary dark:border-t-primary-dark dark:border-b-primary-dark`}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
      </div>
    </div>
  );
}