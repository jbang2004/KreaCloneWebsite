import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useLanguage, TranslationKey } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import {
  HomeIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  FilmIcon,
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  PaintBrushIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
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
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    path: "/audio-transcription",
    labelKey: "audioTranscription",
    icon: <MicrophoneIcon className="h-5 w-5" />,
  },
  {
    path: "/text-to-speech",
    labelKey: "textToSpeech",
    icon: <SpeakerWaveIcon className="h-5 w-5" />,
  },
  {
    path: "/video-translation",
    labelKey: "videoTranslation",
    icon: <FilmIcon className="h-5 w-5" />,
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </svg>
          </Link>
        </div>

        {/* Navigation - Center aligned like Krea.ai */}
        <div className="hidden md:flex items-center bg-muted/70 rounded-full px-1.5 py-1.5 absolute left-1/2 transform -translate-x-1/2">
          {NavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={closeMenu}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-full transition-colors",
                location === item.path ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
              aria-label={t(item.labelKey)}
            >
              {item.icon}
            </Link>
          ))}
        </div>
        
        {/* Mobile menu button */}
        {isMobile && (
          <button 
            className="h-9 w-9 ml-2 flex items-center justify-center rounded-full hover:bg-muted transition-colors md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        )}

        {/* Right side menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label={t("switchLanguage")}
              >
                <GlobeAltIcon className="h-5 w-5" />
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
      
      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 space-y-2 z-50">
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
                <CurrencyDollarIcon className="h-5 w-5" />
              </span>
              <span className="font-medium">{t("pricing")}</span>
            </Link>
            <Link href="/auth" onClick={closeMenu} className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
              <span className="w-6 h-6 flex items-center justify-center">
                <UserIcon className="h-5 w-5" />
              </span>
              <span className="font-medium">{t("logIn")}</span>
            </Link>
            <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors" onClick={() => setLanguage(language === "en" ? "zh" : "en")}>
              <span className="w-6 h-6 flex items-center justify-center">
                <GlobeAltIcon className="h-5 w-5" />
              </span>
              <span className="font-medium">{t("switchLanguage")}</span>
            </div>
            <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors" onClick={toggleTheme}>
              <span className="w-6 h-6 flex items-center justify-center">
                {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </span>
              <span className="font-medium">{theme === "dark" ? t("lightMode") : t("darkMode")}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
