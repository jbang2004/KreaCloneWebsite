'use client';

import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider } from "@/contexts/AuthContext";

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
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
                {children}
              </main>
              <Toaster />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 