import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import PageTransition from "@/components/page-transition";
import Home from "@/pages/home";
import Image from "@/pages/image";
import Video from "@/pages/video";
import Enhancer from "@/pages/enhancer";
import Pricing from "@/pages/pricing";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";

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
              
              <main className="max-w-7xl mx-auto px-4 py-6">
                <PageTransition location={location} previousLocation={previousLocation}>
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/image" component={Image} />
                    <Route path="/video" component={Video} />
                    <Route path="/enhancer" component={Enhancer} />
                    <Route path="/pricing" component={Pricing} />
                    <Route path="/auth" component={AuthPage} />
                    <Route path="/login" component={AuthPage} />
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
