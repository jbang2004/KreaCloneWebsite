'use client';

import { Suspense } from "react";
import dynamic from "next/dynamic";

// 动态导入需要客户端交互的组件
const PricingContent = dynamic(() => import("@/components/pricing-content"), {
  ssr: false,
  loading: () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded-md animate-pulse mb-4 w-48 mx-auto" />
        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-96 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

export default function PricingPage() {
  return (
    <Suspense 
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded-md animate-pulse mb-4 w-48 mx-auto" />
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
} 