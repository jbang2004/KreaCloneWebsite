import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useLanguage, TranslationKey } from "@/hooks/use-language";
import { Menu, X, Globe } from "lucide-react";
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
    path: "/image",
    labelKey: "image",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    path: "/video",
    labelKey: "video",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    ),
  },
  {
    path: "/enhancer",
    labelKey: "enhancer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useMobile();
  const { t, language, setLanguage } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#000000" />
            </svg>
          </Link>

          {isMobile && (
            <button 
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        <div className={cn(
          "hidden md:flex items-center justify-center space-x-1",
          isMobile && isOpen && "absolute top-16 left-0 right-0 flex flex-col items-start p-4 bg-white border-b border-gray-200 space-y-2 space-x-0"
        )}>
          {NavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={closeMenu}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors",
                isMobile && isOpen && "w-full justify-start space-x-2 px-2 py-2",
                location === item.path && "bg-gray-100"
              )}
              aria-label={t(item.labelKey)}
            >
              {item.icon}
              {isMobile && isOpen && <span>{t(item.labelKey)}</span>}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
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

          <Link href="/pricing" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">
            {t("pricing")}
          </Link>
          <Link href="/auth" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">
            {t("logIn")}
          </Link>
          <Link href="/auth" className="text-sm font-medium bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
            {t("signUp")}
          </Link>
        </div>
      </div>
      
      {isMobile && isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 space-y-2">
          {NavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2 flex flex-col space-y-2">
            <Link href="/pricing" onClick={closeMenu} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              {t("pricing")}
            </Link>
            <Link href="/auth" onClick={closeMenu} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              {t("logIn")}
            </Link>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-100" onClick={() => setLanguage(language === "en" ? "zh" : "en")}>
              <Globe className="h-5 w-5 mr-2" />
              {t("switchLanguage")}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
