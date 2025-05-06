import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useLanguage, TranslationKey } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    path: "/audio-transcription",
    labelKey: "audioTranscription",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" fill="currentColor" />
        <path d="M7.5 15H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17.5 10V10.8333C17.5 14.055 14.8883 16.6667 11.6667 16.6667H8.33333C5.11167 16.6667 2.5 14.055 2.5 10.8333V6.66667C2.5 6.20643 2.87309 5.83334 3.33333 5.83334H4.58333C4.8134 5.83334 5 6.01993 5 6.25001V7.08334C5 7.31342 4.8134 7.50001 4.58333 7.50001H3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.1667 7.91666V6.66666M14.1667 5V6.66666M15.8333 6.66666H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="5.83333" y="1.66666" width="8.33333" height="3.33333" rx="1.66667" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    path: "/text-to-speech",
    labelKey: "textToSpeech",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 11.6667C10.9205 11.6667 11.6667 10.9205 11.6667 10C11.6667 9.07957 10.9205 8.33334 10 8.33334C9.07957 8.33334 8.33333 9.07957 8.33333 10C8.33333 10.9205 9.07957 11.6667 10 11.6667Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.83333 6.66666C6.2936 6.66666 6.66667 6.2936 6.66667 5.83333C6.66667 5.37307 6.2936 5 5.83333 5C5.37307 5 5 5.37307 5 5.83333C5 6.2936 5.37307 6.66666 5.83333 6.66666Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.8333 6.66666C16.2936 6.66666 16.6667 6.2936 16.6667 5.83333C16.6667 5.37307 16.2936 5 15.8333 5C15.3731 5 15 5.37307 15 5.83333C15 6.2936 15.3731 6.66666 15.8333 6.66666Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.3333 16.6667H11.6667C9.82572 16.6667 8.33334 15.1743 8.33334 13.3333V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.83333 10V13.3333C5.83333 13.7936 5.46026 14.1667 5 14.1667H3.33333C2.87309 14.1667 2.5 13.7936 2.5 13.3333V6.66667C2.5 6.20643 2.87309 5.83334 3.33333 5.83334H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.1667 10V13.3333C14.1667 13.7936 14.5398 14.1667 15 14.1667H16.6667C17.1269 14.1667 17.5 13.7936 17.5 13.3333V6.66667C17.5 6.20643 17.1269 5.83334 16.6667 5.83334H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 11.6667V15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12.5 15.8333L7.5 15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 8.33334V3.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: "/video-translation",
    labelKey: "videoTranslation",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 10V10.8333C17.5 14.055 14.8883 16.6667 11.6667 16.6667H8.33333C5.11167 16.6667 2.5 14.055 2.5 10.8333V6.66667C2.5 5.28596 3.61929 4.16667 5 4.16667H5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="5.83333" y="3.33334" width="6.66667" height="4.16667" rx="0.833333" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12.5 7.5V13.3333C12.5 13.7936 12.1269 14.1667 11.6667 14.1667H9.16667C8.24619 14.1667 7.5 13.4205 7.5 12.5V7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14.1667 7.91666V6.66666M14.1667 5V6.66666M15.8333 6.66666H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.8333 11.6667L17.5 12.5M17.5 12.5L15.8333 13.3333M17.5 12.5H14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.16667 11.6667L2.5 12.5M2.5 12.5L4.16667 13.3333M2.5 12.5H5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
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
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </svg>
          </Link>

          {isMobile && (
            <button 
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        <div className={cn(
          "hidden md:flex items-center justify-center space-x-1",
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
              {isMobile && isOpen && <span>{t(item.labelKey)}</span>}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
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
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex flex-col space-y-2">
            <Link href="/pricing" onClick={closeMenu} className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors">
              {t("pricing")}
            </Link>
            <Link href="/auth" onClick={closeMenu} className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors">
              {t("logIn")}
            </Link>
            <div className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setLanguage(language === "en" ? "zh" : "en")}>
              <Globe className="h-5 w-5 mr-2" />
              {t("switchLanguage")}
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
              {theme === "dark" ? t("lightMode") : t("darkMode")}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
