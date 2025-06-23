'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import Header from "@/components/header";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/hooks/use-language";
import { MotionProvider } from "@/lib/lazy-motion";
import { PerformanceMonitorClient } from "@/components/performance-monitor-client";

// 创建一个查询客户端实例
const queryClient = new QueryClient();

export default function ClientProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={0} // 禁用自动刷新，依赖JWT过期机制
      refetchOnWindowFocus={true} // 窗口获得焦点时刷新session
      refetchWhenOffline={false} // 离线时不刷新
    >
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MotionProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
                  {children}
                </main>
                <Toaster />
                <PerformanceMonitorClient />
              </div>
            </MotionProvider>
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
} 