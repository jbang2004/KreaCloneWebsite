'use client';

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { m as motion } from "@/lib/lazy-motion";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "next-themes";
import WabiSabiBackground from "@/components/wabi-sabi-background";
import { signInWithGoogle, signInWithCredentials, signUpWithCredentials } from "@/app/actions";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    if (status === 'authenticated' && session?.user?.email) {
      redirectTimeoutRef.current = setTimeout(() => {
        router.push("/");
      }, 100);
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [session, status, router]);

  const handleGoogleLogin = () => {
    startTransition(async () => {
      try {
        await signInWithGoogle();
      } catch (error) {
        toast({
          title: "Google Login Failed",
          description: "请稍后再试",
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: "Invalid email format",
            description: "Please enter a valid email address",
            variant: "destructive",
        });
        return;
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
        toast({
            title: "Password too short",
            description: "Password should be at least 6 characters long",
            variant: "destructive",
        });
        return;
    }

    if (isRegistering && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        if (isRegistering) {
          toast({
            title: "注册中...",
            description: "正在创建您的账户",
          });
          
          try {
            const result = await signUpWithCredentials(email, password);
            
            // 如果result为undefined，说明重定向成功
            if (result === undefined) {
              toast({
                title: "注册成功！",
                description: "正在重定向到首页...",
              });
              // 设置成功标记
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('authSuccess', 'true');
              }
              // 强制更新session状态
              await update();
              return;
            }
            
            // 如果有result且不成功，显示错误
            if (result && !result.success) {
              toast({
                title: "注册失败",
                description: result.error || "请检查您的信息并重试",
                variant: "destructive",
              });
              return;
            }
            
            // 如果到达这里，说明注册成功但没有重定向
            toast({
              title: "注册成功！",
              description: "正在更新状态...",
            });
            
            // 设置成功标记
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('authSuccess', 'true');
            }
            
            // 强制更新session状态
            await update();
            
            // 延迟一下再手动重定向
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
            
          } catch (redirectError) {
            // 如果捕获到重定向错误，这实际上是成功的
            toast({
              title: "注册成功！",
              description: "正在重定向到首页...",
            });
            
            // 设置成功标记
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('authSuccess', 'true');
            }
            
            // 强制更新session状态
            await update();
            
            // 重定向将由Next.js处理，但我们可以确保状态更新
            setTimeout(async () => {
              await update();
              window.location.href = '/';
            }, 500);
          }
          
        } else {
          toast({
            title: "登录中...",
            description: "正在验证您的账户",
          });
          
          try {
            const result = await signInWithCredentials(email, password);
            
            // 如果result为undefined，说明重定向成功
            if (result === undefined) {
              toast({
                title: "登录成功！",
                description: "正在重定向到首页...",
              });
              // 设置成功标记
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('authSuccess', 'true');
              }
              // 强制更新session状态
              await update();
              return;
            }
            
            // 如果有result且不成功，显示错误
            if (result && !result.success) {
              toast({
                title: "登录失败",
                description: result.error || "请检查您的信息并重试",
                variant: "destructive",
              });
              return;
            }
            
            // 如果到达这里，说明登录成功但没有重定向
            toast({
              title: "登录成功！",
              description: "正在更新状态...",
            });
            
            // 设置成功标记
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('authSuccess', 'true');
            }
            
            // 强制更新session状态
            await update();
            
            // 延迟一下再手动重定向
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
            
          } catch (redirectError) {
            // 如果捕获到重定向错误，这实际上是成功的
            toast({
              title: "登录成功！",
              description: "正在重定向到首页...",
            });
            
            // 设置成功标记
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('authSuccess', 'true');
            }
            
            // 强制更新session状态
            await update();
            
            // 重定向将由Next.js处理，但我们可以确保状态更新
            setTimeout(async () => {
              await update();
              window.location.href = '/';
            }, 500);
          }
        }
        
      } catch (error: any) {
        console.error('Auth error:', error);
        
        toast({
          title: isRegistering ? "注册失败" : "登录失败",
          description: error?.message || "请检查您的信息并重试",
          variant: "destructive",
        });
      }
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Already logged in, redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 统一的诧寂美学背景 */}
      <WabiSabiBackground />
      
      {/* 内容区域 */}
      <div className="relative z-10 flex min-h-screen px-6 md:px-10 lg:px-16 py-8">
      <div className="flex w-full flex-col md:flex-row md:items-stretch max-w-6xl mx-auto gap-2 md:gap-4 self-center"> 
        {/* Auth Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-[45%]"
        >
          <div className={`p-4 h-full rounded-3xl ${theme === "dark" ? "bg-zinc-900" : "bg-gray-100"}`}>
            {/* 内容上部区域 - WaveShift Logo 与欢迎文字 */}
            <div className="h-[170px] mb-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="56" height="56" rx="12" fill="black"/>
                  <path d="M28 21.5C28 18.4624 30.4624 16 33.5 16C36.5376 16 39 18.4624 39 21.5C39 24.5376 36.5376 27 33.5 27C30.4624 27 28 24.5376 28 21.5Z" fill="white"/>
                  <path d="M17 21.5C17 18.4624 19.4624 16 22.5 16C25.5376 16 28 18.4624 28 21.5C28 24.5376 25.5376 27 22.5 27C19.4624 27 17 24.5376 17 21.5Z" fill="white"/>
                  <path d="M28 34.5C28 31.4624 30.4624 29 33.5 29C36.5376 29 39 31.4624 39 34.5C39 37.5376 36.5376 40 33.5 40C30.4624 40 28 37.5376 28 34.5Z" fill="white"/>
                  <path d="M17 34.5C17 31.4624 19.4624 29 22.5 29C25.5376 29 28 31.4624 28 34.5C28 37.5376 25.5376 40 22.5 40C19.4624 40 17 37.5376 17 34.5Z" fill="white"/>
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-center">{t("welcomeToKrea")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("loginOrSignup")}</p>
            </div>

            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 py-5 border-border rounded-xl"
                onClick={handleGoogleLogin}
                disabled={isPending}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.1 10.2C19.1 9.31 19.02 8.66 18.86 7.98H10V11.34H15.24C15.11 12.2 14.54 13.47 13.32 14.31L13.31 14.41L16.12 16.63L16.31 16.64C18.11 15 19.1 12.82 19.1 10.2Z" fill="#4285F4"/>
                  <path d="M10.0002 19.1C12.4302 19.1 14.4602 18.29 16.0002 16.82L13.3102 14.49C12.5202 15.04 11.4502 15.42 10.0002 15.42C7.5402 15.42 5.4602 13.8 4.7202 11.59L4.6302 11.59L1.7102 13.89L1.6602 13.98C3.1902 17.07 6.3602 19.1 10.0002 19.1Z" fill="#34A853"/>
                  <path d="M4.72 11.59C4.51 11.01 4.39 10.38 4.39 9.73C4.39 9.08 4.51 8.45 4.71 7.87L4.7 7.77L1.73 5.43L1.66 5.48C0.94 6.74 0.5 8.19 0.5 9.73C0.5 11.27 0.94 12.72 1.66 13.98L4.72 11.59Z" fill="#FBBC05"/>
                  <path d="M10.0002 4.04C11.7202 4.04 12.9402 4.74 13.6702 5.4L16.0702 3.08C14.4602 1.58 12.4302 0.73 10.0002 0.73C6.3602 0.73 3.1902 2.76 1.6602 5.85L4.7102 8.24C5.4602 6.03 7.5402 4.04 10.0002 4.04Z" fill="#EA4335"/>
                </svg>
                {t("continueWithGoogle")}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'} px-2 text-muted-foreground`}>
                    {t("or")}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={language === "zh" ? "邮箱地址" : "Email address"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border bg-background"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder={language === "zh" ? "密码" : "Password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border bg-background"
                      disabled={isPending}
                    />
                  </div>
                </div>

                {isRegistering && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder={language === "zh" ? "确认密码" : "Confirm password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-border bg-background"
                        disabled={isPending}
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-xl"
                  disabled={isPending}
                >
                  {isPending 
                      ? (language === "zh" ? "处理中..." : "Processing...") 
                      : isRegistering 
                          ? (language === "zh" ? "注册" : "Sign Up") 
                          : (language === "zh" ? "登录" : "Login")}
                  {isPending && (
                    <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {isRegistering 
                      ? (language === "zh" ? "已有账户？" : "Already have an account?") 
                      : (language === "zh" ? "还没有账户？" : "Don't have an account?")}
                  </span>
                  <button
                    type="button"
                    className="text-primary ml-1 hover:underline"
                    onClick={handleToggleMode}
                    disabled={isPending}
                  >
                    {isRegistering 
                      ? (language === "zh" ? "登录" : "Login") 
                      : (language === "zh" ? "注册" : "Sign up")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Feature Preview Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex md:w-[55%] items-center justify-center"
        >
          <div className={`p-8 w-full h-full rounded-3xl ${theme === "dark" ? "bg-zinc-900" : "bg-gray-100"}`}>
            <div className="h-full flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">
                {language === "zh" ? "AI音视频处理平台" : "AI Audio & Video Platform"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "zh" 
                  ? "体验最先进的AI技术，轻松处理音频转录、文本配音、视频翻译等任务。" 
                  : "Experience cutting-edge AI technology for audio transcription, text-to-speech, video translation and more."}
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{language === "zh" ? "实时音频转录" : "Real-time Audio Transcription"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{language === "zh" ? "多语言文本配音" : "Multi-language Text-to-Speech"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>{language === "zh" ? "智能视频翻译" : "Intelligent Video Translation"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
} 