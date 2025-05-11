import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import PageTransition from "@/components/page-transition";
import { lazy, Suspense } from "react";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProtectedRoute } from "./lib/protected-route";

// 页面导入
import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

// 懒加载新添加的页面以提高性能
const AudioTranscription = lazy(() => import("./pages/audio-transcription"));
const TextToSpeech = lazy(() => import("./pages/text-to-speech"));
const VideoTranslation = lazy(() => import("./pages/video-translation"));

function App() {
  const [location] = useLocation();
  const [previousLocation, setPreviousLocation] = useState(location);

  useEffect(() => {
    setPreviousLocation(location);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              
              <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
                <PageTransition location={location} previousLocation={previousLocation}>
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/pricing" component={Pricing} />
                    <Route path="/auth" component={AuthPage} />
                    <Route path="/login" component={AuthPage} />
                    <ProtectedRoute 
                      path="/audio-transcription" 
                      component={() => (
                        <Suspense fallback={<div className="flex items-center justify-center h-[60vh]">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>}>
                          <AudioTranscription />
                        </Suspense>
                      )} 
                    />
                    <ProtectedRoute 
                      path="/text-to-speech" 
                      component={() => (
                        <Suspense fallback={<div className="flex items-center justify-center h-[60vh]">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>}>
                          <TextToSpeech />
                        </Suspense>
                      )} 
                    />
                    <ProtectedRoute 
                      path="/video-translation" 
                      component={() => (
                        <Suspense fallback={<div className="flex items-center justify-center h-[60vh]">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>}>
                          <VideoTranslation />
                        </Suspense>
                      )} 
                    />
                    <Route component={NotFound} />
                  </Switch>
                </PageTransition>
              </main>
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
