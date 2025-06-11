import { LazyMotion, domAnimation, m } from "framer-motion";
import React from "react";

// 官方推荐的懒加载方式：LazyMotion + domAnimation + m
export { LazyMotion, domAnimation, m };

// 便捷的 LazyMotion Provider 组件
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(
    LazyMotion,
    { features: domAnimation },
    children
  );
} 