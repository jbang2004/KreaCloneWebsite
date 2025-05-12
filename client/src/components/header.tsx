import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useLanguage, TranslationKey } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { IonIcon } from "@ionic/react";
import {
  home,
  mic,
  volumeHigh,
  videocam,
  image,
  options,
  brush,
  sunny,
  moon,
  language,
  menu,
  close,
  person,
  pricetag,
  logOut
} from "ionicons/icons";
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
    icon: <IonIcon icon={home} className="h-5 w-5" />,
  },
  {
    path: "/audio-transcription",
    labelKey: "audioTranscription",
    icon: <IonIcon icon={mic} className="h-5 w-5" />,
  },
  {
    path: "/text-to-speech",
    labelKey: "textToSpeech",
    icon: <IonIcon icon={volumeHigh} className="h-5 w-5" />,
  },
  {
    path: "/video-translation",
    labelKey: "videoTranslation",
    icon: <IonIcon icon={videocam} className="h-5 w-5" />,
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useMobile();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logoutMutation } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent px-2 sm:px-4 md:px-6 py-3">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-10">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            onClick={closeMenu} 
            className="flex items-center justify-center h-9 w-9 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-sm hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors backdrop-blur-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill={theme === 'dark' ? '#FFFFFF' : '#000000'} />
            </svg>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="ml-4 lg:ml-6 hidden md:flex items-center space-x-3">
            {NavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "px-2 py-1 rounded-lg flex items-center space-x-1 text-sm font-medium transition-colors",
                  location === item.path
                    ? "bg-white/80 dark:bg-gray-800/80 shadow-sm backdrop-blur-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:backdrop-blur-md"
                )}
              >
                <span className="text-gray-500 dark:text-gray-400">
                  {item.icon}
                </span>
                <span>{t(item.labelKey)}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile menu appears when isOpen */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 md:hidden">
            <div className="absolute top-16 left-4 right-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
              <nav className="flex flex-col space-y-2">
                {NavItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMenu}
                    className={cn(
                      "px-3 py-2 rounded-lg flex items-center space-x-3 text-base",
                      location === item.path
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <span className={location === item.path ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}>
                      {item.icon}
                    </span>
                    <span>{t(item.labelKey)}</span>
                  </Link>
                ))}

                <Link 
                  href="/pricing" 
                  onClick={closeMenu}
                  className="px-3 py-2 rounded-lg flex items-center space-x-3 text-base"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    <IonIcon icon={pricetag} className="h-5 w-5" />
                  </span>
                  <span>{t("pricing")}</span>
                </Link>

                {user ? (
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="px-3 py-2 rounded-lg flex items-center space-x-3 text-base w-full text-left"
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      <IonIcon icon={logOut} className="h-5 w-5" />
                    </span>
                    <span>Logout ({user.username})</span>
                  </button>
                ) : (
                  <Link 
                    href="/auth" 
                    onClick={closeMenu}
                    className="px-3 py-2 rounded-lg flex items-center space-x-3 text-base"
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      <IonIcon icon={person} className="h-5 w-5" />
                    </span>
                    <span>{t("signUp")}</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => {
                      setLanguage(language === "en" ? "zh" : "en");
                      closeMenu();
                    }}
                    className="px-3 py-2 w-full rounded-lg flex items-center space-x-3 text-base hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      <IonIcon icon={language} className="h-5 w-5" />
                    </span>
                    <span>{t("switchLanguage")}</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleTheme();
                      closeMenu();
                    }}
                    className="px-3 py-2 w-full rounded-lg flex items-center space-x-3 text-base hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      {theme === "dark" ? <IonIcon icon={sunny} className="h-5 w-5" /> : <IonIcon icon={moon} className="h-5 w-5" />}
                    </span>
                    <span>{theme === "dark" ? t("lightMode") : t("darkMode")}</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
        
        {/* Mobile menu button */}
        {isMobile && (
          <button 
            className="h-9 w-9 ml-2 flex items-center justify-center rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors md:hidden shadow-sm backdrop-blur-md"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <IonIcon icon={close} className="h-5 w-5" /> : <IonIcon icon={menu} className="h-5 w-5" />}
          </button>
        )}

        {/* Right side menu - Floating buttons like Krea.ai */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors shadow-sm backdrop-blur-md"
            aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
          >
            {theme === "dark" ? <IonIcon icon={sunny} className="h-5 w-5" /> : <IonIcon icon={moon} className="h-5 w-5" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors shadow-sm backdrop-blur-md"
                aria-label={t("switchLanguage")}
              >
                <IonIcon icon={language} className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem 
                onClick={() => setLanguage("en")}
                className={language === "en" ? "bg-accent text-accent-foreground" : ""}
              >
                {t("english")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage("zh")}
                className={language === "zh" ? "bg-accent text-accent-foreground" : ""}
              >
                {t("chinese")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Floating button for Pricing */}
          <Link 
            href="/pricing" 
            className="hidden md:block py-2 px-6 rounded-xl bg-gray-200/60 dark:bg-gray-700/60 text-sm font-medium hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-colors shadow-sm backdrop-blur-md"
          >
            {t("pricing")}
          </Link>
          
          {/* User authentication button - Sign Up or Logout */}
          {user ? (
            <button 
              onClick={handleLogout}
              className="py-2 px-3 sm:px-4 md:px-6 rounded-xl bg-gray-600/90 hover:bg-gray-700/90 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm backdrop-blur-md flex items-center"
            >
              <IonIcon icon={logOut} className="h-4 w-4 mr-1" />
              <span>Logout</span>
            </button>
          ) : (
            <Link 
              href="/auth" 
              className="py-2 px-3 sm:px-4 md:px-6 rounded-xl bg-blue-600/90 hover:bg-blue-700/90 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm backdrop-blur-md flex items-center"
            >
              <IonIcon icon={person} className="h-4 w-4 mr-1" />
              <span>{t("signUp")}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}