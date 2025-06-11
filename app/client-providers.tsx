'use client';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/hooks/use-language";
import { MotionProvider } from "@/lib/lazy-motion";
import { PerformanceMonitorClient } from "@/components/performance-monitor-client";

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
} 