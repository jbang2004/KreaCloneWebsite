import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define all our translation strings
export type TranslationKey = 
  | "welcomeToKrea"
  | "loginOrSignup"
  | "continueWithGoogle"
  | "continueWithEmail"
  | "or"
  | "email"
  | "bySigningUp"
  | "termsOfService"
  | "privacyPolicy"
  | "googleLoginNotAvailable"
  | "emailLoginNotAvailable"
  | "featureNotImplemented"
  | "emailRequired"
  | "pleaseEnterEmail"
  | "home"
  | "image"
  | "video"
  | "enhancer"
  | "edit"
  | "assets"
  | "pricing"
  | "logIn"
  | "signUp"
  | "switchLanguage"
  | "english"
  | "chinese"
  | "pageNotFound";

type Translations = {
  [key in TranslationKey]: string;
};

// Define the translations for English and Chinese
const translations: Record<"en" | "zh", Translations> = {
  en: {
    welcomeToKrea: "Welcome to Krea",
    loginOrSignup: "Log in or sign up",
    continueWithGoogle: "Continue with Google",
    continueWithEmail: "Continue with email",
    or: "or",
    email: "Email",
    bySigningUp: "By signing up, you agree to our",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    googleLoginNotAvailable: "Google login not available",
    emailLoginNotAvailable: "Email login not available",
    featureNotImplemented: "This feature is not implemented yet",
    emailRequired: "Email required",
    pleaseEnterEmail: "Please enter your email address",
    home: "Home",
    image: "Image",
    video: "Video",
    enhancer: "Enhancer",
    edit: "Edit",
    assets: "Assets",
    pricing: "Pricing",
    logIn: "Log In",
    signUp: "Sign Up",
    switchLanguage: "Switch Language",
    english: "English",
    chinese: "Chinese",
    pageNotFound: "Page Not Found"
  },
  zh: {
    welcomeToKrea: "欢迎来到 Krea",
    loginOrSignup: "登录或注册",
    continueWithGoogle: "使用谷歌账号继续",
    continueWithEmail: "使用邮箱继续",
    or: "或",
    email: "邮箱",
    bySigningUp: "注册即表示您同意我们的",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    googleLoginNotAvailable: "谷歌登录不可用",
    emailLoginNotAvailable: "邮箱登录不可用",
    featureNotImplemented: "此功能尚未实现",
    emailRequired: "需要邮箱",
    pleaseEnterEmail: "请输入您的邮箱地址",
    home: "首页",
    image: "图片",
    video: "视频",
    enhancer: "增强器",
    edit: "编辑",
    assets: "资源",
    pricing: "价格",
    logIn: "登录",
    signUp: "注册",
    switchLanguage: "切换语言",
    english: "英文",
    chinese: "中文",
    pageNotFound: "页面未找到"
  },
};

type LanguageContextType = {
  language: "en" | "zh";
  setLanguage: (language: "en" | "zh") => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"en" | "zh">("en");

  useEffect(() => {
    // Get the saved language preference from localStorage
    const savedLanguage = localStorage.getItem("language") as "en" | "zh";
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: "en" | "zh") => {
    setLanguage(newLanguage);
    // Save the language preference to localStorage
    localStorage.setItem("language", newLanguage);
  };

  // Function to get a translated string by key
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}