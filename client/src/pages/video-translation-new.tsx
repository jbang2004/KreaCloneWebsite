import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  LanguageIcon, 
  ArrowUpTrayIcon, 
  FolderOpenIcon,
  ChevronDownIcon,
  FilmIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import LottieAnimation from "@/components/lottie-animation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function VideoTranslation() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 处理文件上传逻辑
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 语言选项
  const languageOptions = [
    { value: "zh", label: language === "zh" ? "中文" : "Chinese" },
    { value: "en", label: language === "zh" ? "英文" : "English" },
    { value: "ja", label: language === "zh" ? "日语" : "Japanese" },
    { value: "ko", label: language === "zh" ? "韩语" : "Korean" },
    { value: "fr", label: language === "zh" ? "法语" : "French" },
    { value: "de", label: language === "zh" ? "德语" : "German" },
    { value: "es", label: language === "zh" ? "西班牙语" : "Spanish" },
  ];

  // 根据语言选择显示的文本
  const title = language === "zh" ? "视频翻译" : "Video Translation";
  const description = language === "zh" 
    ? "上传视频，自动提取字幕并翻译成多种语言。支持批量导出与编辑。"
    : "Upload videos, automatically extract subtitles and translate into multiple languages. Support batch export and editing.";
  const uploadVideoLabel = language === "zh" ? "上传视频" : "Upload Video";
  const selectLanguageLabel = language === "zh" ? "选择翻译语言" : "Select Language";
  const maxSizeLabel = language === "zh" ? "最大" : "Max";

  // 获取目标语言显示名称
  const getLanguageLabel = (value: string) => {
    const option = languageOptions.find(lang => lang.value === value);
    return option?.label || "";
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[70vh]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-3xl mx-auto">
        <div className={cn(
          "p-8 md:p-12 rounded-2xl", 
          theme === "dark" ? "bg-zinc-900" : "bg-gray-100"
        )}>
          <div className="flex flex-col items-center text-center mb-10">
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
              theme === "dark" ? "bg-zinc-800" : "bg-white"
            )}>
              <FilmIcon className="h-10 w-10" />
            </div>
            
            <h1 className="text-3xl font-bold mb-3">{title}</h1>
            <p className="text-muted-foreground max-w-lg">
              {description}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Button
              className={cn(
                "flex-1 py-6 px-4 text-white rounded-xl transition-colors flex items-center justify-center",
                "bg-blue-600 hover:bg-blue-700"
              )}
              onClick={handleUploadClick}
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              <span>{uploadVideoLabel}</span>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 py-6 px-4 rounded-xl transition-colors flex items-center justify-center",
                    theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-blue-50 border-blue-100 text-blue-700"
                  )}
                >
                  <TranslateIcon className="h-5 w-5 mr-2" />
                  <span>{selectLanguageLabel}</span>
                  <ChevronDownIcon className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-52 p-2 rounded-xl"
                align="end"
              >
                <div className="space-y-1">
                  {languageOptions.map(lang => (
                    <Button
                      key={lang.value}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        targetLanguage === lang.value && "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-500"
                      )}
                      onClick={() => setTargetLanguage(lang.value)}
                    >
                      {lang.label}
                      {targetLanguage === lang.value && (
                        <svg className="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {maxSizeLabel} 75MB / 15 {language === "zh" ? "秒" : "seconds"}
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.avi,.mov,.mkv"
        className="hidden"
        onChange={handleFileChange}
      />
    </motion.div>
  );
}