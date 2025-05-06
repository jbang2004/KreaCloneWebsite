import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Languages, Upload, FolderOpen, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subtitle {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
  translation: string;
}

export default function VideoTranslation() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string>("zh");
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
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
  const selectFromAssetsLabel = language === "zh" ? "从资源库选择" : "Select from Assets";
  const supportText = language === "zh" 
    ? "上传视频文件，我们将自动提取字幕并翻译成您选择的语言。支持格式：MP4, AVI, MOV, MKV。"
    : "Upload a video file, we will automatically extract subtitles and translate to your chosen language. Supported formats: MP4, AVI, MOV, MKV.";
  const fromLanguageLabel = language === "zh" ? "源语言" : "From";
  const toLanguageLabel = language === "zh" ? "目标语言" : "To";

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[70vh]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 bg-muted rounded-xl p-6 inline-block">
          <svg className="h-12 w-12 text-foreground/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12V13C21 16.866 17.866 20 14 20H10C6.13401 20 3 16.866 3 13V8C3 6.34315 4.34315 5 6 5H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="7" y="4" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M15 9V16C15 16.5523 14.5523 17 14 17H11C9.89543 17 9 16.1046 9 15V9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M17 9.5L17 8M17 6L17 8M19 8L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19 14L21 15M21 15L19 16M21 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 14L3 15M3 15L5 16M3 15H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {description}
        </p>
      </div>
      
      <div className="w-full max-w-md mb-8">
        <div className="bg-card p-4 rounded-xl border border-border mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">{fromLanguageLabel}</div>
            <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
            <div className="text-sm font-medium">{toLanguageLabel}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={sourceLanguage}
              onValueChange={setSourceLanguage}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(lang => (
                  <SelectItem key={`source-${lang.value}`} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={targetLanguage}
              onValueChange={setTargetLanguage}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(lang => (
                  <SelectItem key={`target-${lang.value}`} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.avi,.mov,.mkv"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center gap-4 w-full">
          <Button
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center"
            size="lg"
            onClick={handleUploadClick}
          >
            <Upload className="h-5 w-5 mr-2" />
            {uploadVideoLabel}
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            size="lg"
          >
            <FolderOpen className="h-5 w-5 mr-2" />
            {selectFromAssetsLabel}
          </Button>
        </div>
      </div>

      {file && (
        <motion.div 
          className="w-full max-w-md bg-card rounded-xl border border-border p-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-lg h-16 w-16 flex items-center justify-center">
              <Video className="h-6 w-6 text-foreground/70" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{file.name}</h3>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded"
            >
              {language === "zh" ? "开始处理" : "Process"}
            </Button>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="mt-12 text-center text-muted-foreground max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-sm">
          {supportText}
        </p>
      </motion.div>
    </motion.div>
  );
}