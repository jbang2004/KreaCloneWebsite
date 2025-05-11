import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useLanguage, TranslationKey } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { 
  IoHomeOutline, 
  IoMicOutline, 
  IoVolumeHighOutline,
  IoFilmOutline,
  IoImagesOutline,
  IoColorPaletteOutline,
  IoSettingsOutline, 
  IoSunnyOutline,
  IoMoonOutline,
  IoLanguageOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoCashOutline,
  IoGlobeOutline
} from "react-icons/io5";
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
    icon: <IoHomeOutline className="h-5 w-5" />,
  },
  {
    path: "/audio-transcription",
    labelKey: "audioTranscription",
    icon: <IoMicOutline className="h-5 w-5" />,
  },
  {
    path: "/text-to-speech",
    labelKey: "textToSpeech",
    icon: <IoVolumeHighOutline className="h-5 w-5" />,
  },
  {
    path: "/video-translation",
    labelKey: "videoTranslation",
    icon: <IoFilmOutline className="h-5 w-5" />,
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
    <header className="sticky top-0 z-50 bg-transparent px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-10">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            onClick={closeMenu} 
            className="flex items-center justify-center h-9 w-9 bg-white/60 dark:bg-gray-800/60 rounded-full shadow-sm hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors backdrop-blur-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </svg>
          </Link>
        </div>

        {/* Navigation - Floating center menu like Krea.ai */}
        <div 
          className="hidden md:flex items-center bg-gray-100/90 dark:bg-gray-800/80 rounded-full px-1.5 py-1.5 absolute left-1/2 transform -translate-x-1/2 shadow-sm backdrop-blur-md"
        >
          {NavItems.map((item) => (
            <div key={item.path} className="relative group">
              <Link 
                href={item.path}
                onClick={closeMenu}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-full transition-colors mx-0.5",
                  location === item.path 
                    ? "bg-white dark:bg-gray-700 shadow-sm" 
                    : "hover:bg-white/70 dark:hover:bg-gray-700/70"
                )}
                aria-label={t(item.labelKey)}
              >
                {item.icon}
              </Link>
              {/* 悬浮时显示的标题 */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-white/80 dark:bg-gray-700/80 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm whitespace-nowrap">
                {t(item.labelKey)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile menu button */}
        {isMobile && (
          <button 
            className="h-9 w-9 ml-2 flex items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors md:hidden shadow-sm backdrop-blur-md"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <IoCloseOutline className="h-5 w-5" /> : <IoMenuOutline className="h-5 w-5" />}
          </button>
        )}

        {/* Right side menu - Floating buttons like Krea.ai */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors shadow-sm backdrop-blur-md"
            aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
          >
            {theme === "dark" ? <IoSunnyOutline className="h-5 w-5" /> : <IoMoonOutline className="h-5 w-5" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors shadow-sm backdrop-blur-md"
                aria-label={t("switchLanguage")}
              >
                <IoLanguageOutline className="h-5 w-5" />
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

          {/* Floating button for Pricing */}
          <Link 
            href="/pricing" 
            className="hidden md:block py-2 px-6 rounded-full bg-gray-200/60 dark:bg-gray-700/60 text-sm font-medium hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-colors shadow-sm backdrop-blur-md"
          >
            {t("pricing")}
          </Link>
          
          {/* Floating button for Sign Up */}
          <Link 
            href="/auth" 
            className="py-2 px-6 rounded-full bg-blue-600/90 hover:bg-blue-700/90 text-white text-sm font-medium transition-colors shadow-sm backdrop-blur-md"
          >
            {t("signUp")}
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="md:hidden absolute top-16 left-4 right-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-lg p-4 space-y-2 z-50">
          {NavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={closeMenu}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg transition-colors",
                location === item.path 
                  ? "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm" 
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
            >
              <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
              <span className="font-medium">{t(item.labelKey)}</span>
            </Link>
          ))}
          <div className="border-t border-white/20 dark:border-gray-700/50 pt-2 mt-2 flex flex-col space-y-2">
            <Link 
              href="/pricing" 
              onClick={closeMenu} 
              className="flex items-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="w-6 h-6 flex items-center justify-center">
                <IoCashOutline className="h-5 w-5" />
              </span>
              <span className="font-medium">{t("pricing")}</span>
            </Link>
            <Link 
              href="/auth" 
              onClick={closeMenu} 
              className="flex items-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="w-6 h-6 flex items-center justify-center">
                <IoPersonOutline className="h-5 w-5" />
              </span>
              <span className="font-medium">{t("logIn")}</span>
            </Link>
            <div 
              className="flex items-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                <IoLanguageOutline className="h-5 w-5" />
              </span>
              <span className="font-medium">{t("switchLanguage")}</span>
            </div>
            <div 
              className="flex items-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={toggleTheme}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {theme === "dark" ? <IoSunnyOutline className="h-5 w-5" /> : <IoMoonOutline className="h-5 w-5" />}
              </span>
              <span className="font-medium">{theme === "dark" ? t("lightMode") : t("darkMode")}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}