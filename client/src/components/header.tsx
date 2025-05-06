import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useLanguage, TranslationKey } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Menu, X, Globe, Sun, Moon, Home, Mic, Volume2, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  path: string;
  labelKey: TranslationKey;
  icon: React.ReactNode;
};

const NavItems: NavItem[] = [
  {
    path: "/",
    labelKey: "home",
    icon: <Home className="h-5 w-5" />,
  },
  {
    path: "/audio-transcription",
    labelKey: "audioTranscription",
    icon: <Mic className="h-5 w-5" />,
  },
  {
    path: "/text-to-speech",
    labelKey: "textToSpeech",
    icon: <Volume2 className="h-5 w-5" />,
  },
  {
    path: "/video-translation",
    labelKey: "videoTranslation",
    icon: <Video className="h-5 w-5" />,
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useMobile();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4">
      <div className="max-w-7xl mx-auto flex items-center h-16">
        <div className="flex-none flex items-center">
          <Link href="/" onClick={closeMenu} className="flex items-center mr-10">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </svg>
          </Link>

          {isMobile && (
            <button 
              className="h-10 w-10 ml-4 flex items-center justify-center rounded-full hover:bg-muted transition-colors md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        <div className={cn(
          "hidden md:flex flex-1 items-center justify-center space-x-8",
          isMobile && isOpen && "absolute top-16 left-0 right-0 flex flex-col items-start p-4 bg-background border-b border-border space-y-2 space-x-0"
        )}>
          {NavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={closeMenu}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors",
                isMobile && isOpen && "w-full justify-start space-x-2 px-2 py-2",
                location === item.path && "bg-muted"
              )}
              aria-label={t(item.labelKey)}
            >
              {item.icon}
            </Link>
          ))}
        </div>

        <div className="flex-none flex items-center space-x-4 ml-10">
          <button
            onClick={toggleTheme}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label={t("switchLanguage")}
              >
                <Globe size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                <span className={cn(language === "en" && "font-bold")}>
                  {t("english")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("zh")}>
                <span className={cn(language === "zh" && "font-bold")}>
                  {t("chinese")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/pricing" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
            {t("pricing")}
          </Link>
          <Link href="/auth" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
            {t("logIn")}
          </Link>
          <Link href="/auth" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
            {t("signUp")}
          </Link>
        </div>
      </div>
      
      {isMobile && isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 space-y-2">
          {NavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={closeMenu}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors",
                location === item.path && "bg-muted"
              )}
            >
              <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
              <span className="font-medium">{t(item.labelKey)}</span>
            </Link>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex flex-col space-y-2">
            <Link href="/pricing" onClick={closeMenu} className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
              <span className="w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </span>
              <span className="font-medium">{t("pricing")}</span>
            </Link>
            <Link href="/auth" onClick={closeMenu} className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
              <span className="w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </span>
              <span className="font-medium">{t("logIn")}</span>
            </Link>
            <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors" onClick={() => setLanguage(language === "en" ? "zh" : "en")}>
              <span className="w-6 h-6 flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </span>
              <span className="font-medium">{t("switchLanguage")}</span>
            </div>
            <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors" onClick={toggleTheme}>
              <span className="w-6 h-6 flex items-center justify-center">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </span>
              <span className="font-medium">{theme === "dark" ? t("lightMode") : t("darkMode")}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
