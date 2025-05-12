import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { 
  addCircleOutline, 
  folderOpenOutline,
  videocamOutline,
  languageOutline
} from "ionicons/icons";
import { IonIcon } from "@ionic/react";
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
      <div className="w-full max-w-sm mx-auto">
        <div className={cn(
          "p-8 rounded-3xl", 
          theme === "dark" ? "bg-zinc-900" : "bg-gray-100"
        )}>
          {/* 动态图片区域 */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-36 overflow-hidden">
              <LottieAnimation 
                type="videoTranslation" 
                className="w-full h-full" 
              />
            </div>
          </div>
          
          {/* 标题和图标并排 */}
          <div className="flex items-center justify-center mb-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center mr-2",
              theme === "dark" ? "bg-zinc-800" : "bg-blue-100"
            )}>
              <IonIcon icon={videocamOutline} className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          
          {/* 描述文字 */}
          <p className="text-muted-foreground text-sm text-center mb-6">
            {description}
          </p>
          
          {/* 按钮区域 - 竖直排列 */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              className={cn(
                "w-full h-12 text-white rounded-xl transition-colors flex items-center justify-center",
                "bg-blue-600 hover:bg-blue-700"
              )}
              onClick={handleUploadClick}
            >
              <IonIcon icon={addCircleOutline} className="w-5 h-5 mr-2" />
              <span>Upload</span>
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 rounded-xl transition-colors flex items-center justify-center",
                theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-blue-50 border-blue-100 text-blue-700"
              )}
            >
              <IonIcon icon={folderOpenOutline} className="w-5 h-5 mr-2" />
              <span>Select asset</span>
            </Button>
          </div>
          
          <div className="text-center mt-3 text-xs text-muted-foreground">
            Max 75MB / 15 seconds
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