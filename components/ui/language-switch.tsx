"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LanguageSwitchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function LanguageSwitch({ value, onChange, disabled, className }: LanguageSwitchProps) {
  const isEnglish = value === "en";

  const handleToggle = () => {
    if (disabled) return;
    onChange(isEnglish ? "zh" : "en");
  };

  return (
    <div 
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer",
        isEnglish ? "bg-blue-600" : "bg-red-600",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleToggle}
    >
      <div
        className={cn(
          "absolute h-6 w-6 rounded-full bg-white shadow-lg transition-transform flex items-center justify-center text-xs font-bold",
          isEnglish ? "translate-x-9" : "translate-x-1"
        )}
      >
        {isEnglish ? "EN" : "中"}
      </div>
      <div className="flex w-full justify-between px-2 text-white text-xs font-medium">
        <span className={cn("transition-opacity", !isEnglish ? "opacity-100" : "opacity-0")}>中</span>
        <span className={cn("transition-opacity", isEnglish ? "opacity-100" : "opacity-0")}>EN</span>
      </div>
    </div>
  );
} 