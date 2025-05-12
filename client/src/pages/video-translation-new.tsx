import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  addCircle, 
  folderOpen,
  videocam,
  language,
  chevronDown,
  play,
  pauseCircle,
  close,
  arrowForward
} from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 一个占位视频的 Base64 数据：1x1 像素的透明视频
const PLACEHOLDER_VIDEO = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0AAACrQYF//+13EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ4OSBmYWU5NzEzMCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz0xIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAA9liIQAW//9nyv9+oSMjdVAAQK4AEcNuh5FS6RGuQSGGSVAgxrdNv3vMAAAAwAcz4AA8pAB3NbSqwG/eTafAP+e4rqIAB+zOE5AYHrqHVgAK8AAAAQAAAWDAAA7TgAAAAgADcAAAi5tZGF0AAACrgYF///etrIyVF9qvmZ/wGdUZHV9f3BpZj6Bg8A6z4AA8pAB3NbSqwG/eTafAP+e4rqIAB+zOE5MWNcAAk4AAAQAAAWDAAA7TgAAAAgADcAAAi4=";

export default function VideoTranslation() {
  const { language: currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      startUpload(file);
    }
  };

  const handleUploadClick = () => {
    if (uploadComplete && videoRef.current) {
      togglePlayback();
    } else {
      fileInputRef.current?.click();
    }
  };

  // 模拟上传过程
  const startUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // 切换视频播放状态
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("视频播放失败:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 重置和重新上传
  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setIsPlaying(false);
  };

  // 模拟翻译过程
  const startTranslation = () => {
    // 这里可以添加翻译逻辑
    alert(currentLanguage === "zh" ? "开始将字幕翻译为" + getLanguageLabel(targetLanguage) : "Starting translation to " + getLanguageLabel(targetLanguage));
  };

  // 语言选项
  const languageOptions = [
    { value: "zh", label: currentLanguage === "zh" ? "中文" : "Chinese" },
    { value: "en", label: currentLanguage === "zh" ? "英文" : "English" },
    { value: "ja", label: currentLanguage === "zh" ? "日语" : "Japanese" },
    { value: "ko", label: currentLanguage === "zh" ? "韩语" : "Korean" },
    { value: "fr", label: currentLanguage === "zh" ? "法语" : "French" },
    { value: "de", label: currentLanguage === "zh" ? "德语" : "German" },
    { value: "es", label: currentLanguage === "zh" ? "西班牙语" : "Spanish" },
  ];

  // 根据语言选择显示的文本
  const title = currentLanguage === "zh" ? "视频翻译" : "Video Translation";
  const description = currentLanguage === "zh" 
    ? "上传视频，自动提取字幕并翻译成多种语言。支持批量导出与编辑。"
    : "Upload videos, automatically extract subtitles and translate into multiple languages. Support batch export and editing.";
  const uploadVideoLabel = currentLanguage === "zh" ? "上传视频" : "Upload";
  const selectLanguageLabel = currentLanguage === "zh" ? "选择语言" : "Select language";
  const startTranslationLabel = currentLanguage === "zh" ? "开始翻译" : "Translate";
  const playVideoLabel = currentLanguage === "zh" ? "播放视频" : "Play Video";
  const pauseVideoLabel = currentLanguage === "zh" ? "暂停" : "Pause";
  const uploadingLabel = currentLanguage === "zh" ? "上传中..." : "Uploading...";
  const translatingLabel = currentLanguage === "zh" ? "翻译中..." : "Translating...";
  const processingLabel = currentLanguage === "zh" ? "处理中..." : "Processing...";

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
          "px-6 py-8 rounded-3xl", 
          theme === "dark" ? "bg-zinc-900" : "bg-gray-100"
        )}>
          {/* 内容上部区域 - 保持同样高度 */}
          <div className="h-[280px] mb-8 flex items-center justify-center">
            {/* 视频播放区域 - 上传成功后显示 */}
            {uploadComplete ? (
              <div className="w-56 h-56 rounded-xl overflow-hidden bg-black relative">
                {/* 使用本地测试视频文件 */}
                <video 
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  poster="https://i.ytimg.com/vi/Qw8Pvk2PeMk/maxresdefault.jpg"
                  playsInline
                  controls={false}
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" type="video/mp4" />
                  您的浏览器不支持视频标签。
                </video>
                
                {/* 播放按钮覆盖层 */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlayback}
                  >
                    <div className="bg-white/20 backdrop-blur-sm h-16 w-16 rounded-full flex items-center justify-center">
                      <IonIcon icon={play} className="h-10 w-10 text-white" />
                    </div>
                  </div>
                )}
                
                {/* 视频信息叠加层 */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs max-w-[70%] truncate">
                    {selectedFile?.name || "video.mp4"}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-black/60 backdrop-blur-sm text-white rounded-full" 
                    onClick={resetUpload}
                  >
                    <IonIcon icon={close} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : isUploading ? (
              // 上传进度显示
              <div className="relative w-56 h-56 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{uploadProgress}%</div>
                      <div className="text-sm text-white/80">
                        {uploadProgress < 50 ? uploadingLabel : 
                         uploadProgress < 90 ? processingLabel : translatingLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 默认静态图片区域
              <div className="relative w-56 h-56 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
                {/* 视频相关图像 */}
                <div className="relative flex justify-center">
                  <div className="absolute w-24 h-36 bg-blue-500 rounded-lg transform -rotate-6 translate-x-6"></div>
                  <div className="absolute w-24 h-36 bg-blue-600 rounded-lg transform rotate-3 -translate-x-6"></div>
                  <div className="absolute w-24 h-36 bg-blue-400 rounded-lg transform rotate-0 z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <IonIcon icon={videocam} className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 标题和图标并排 */}
          <div className="flex items-center justify-center mb-2">
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center mr-2",
              theme === "dark" ? "bg-zinc-800" : "bg-blue-100"
            )}>
              <IonIcon icon={videocam} className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          
          {/* 描述文字 */}
          <p className="text-muted-foreground text-xs text-center mb-5">
            {description}
          </p>
          
          {/* 按钮区域或进度条 */}
          {isUploading ? (
            <div className="mt-5 relative">
              <Progress 
                value={uploadProgress} 
                className="h-12 rounded-xl bg-background"
                indicatorClassName="bg-green-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {uploadProgress < 50 ? uploadingLabel : 
                   uploadProgress < 90 ? processingLabel : translatingLabel} {uploadProgress}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 w-full mt-5">
              <Button
                className={cn(
                  "flex-1 h-12 text-white rounded-xl transition-colors flex items-center justify-center",
                  uploadComplete 
                    ? (isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700") 
                    : "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={handleUploadClick}
              >
                <IonIcon icon={uploadComplete ? (isPlaying ? pauseCircle : play) : addCircle} className="w-5 h-5 mr-2" />
                <span>
                  {uploadComplete 
                    ? (isPlaying ? pauseVideoLabel : playVideoLabel) 
                    : uploadVideoLabel}
                </span>
              </Button>
              
              {!uploadComplete ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 h-12 rounded-xl transition-colors flex items-center justify-center",
                        theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-blue-50 border-blue-100 text-blue-700"
                      )}
                    >
                      <IonIcon icon={language} className="w-5 h-5 mr-2" />
                      <span>{selectLanguageLabel}</span>
                      <IonIcon icon={chevronDown} className="w-4 h-4 ml-2" />
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
              ) : (
                <Button
                  className={cn(
                    "flex-1 h-12 rounded-xl transition-colors flex items-center justify-center",
                    "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                  onClick={startTranslation}
                >
                  <IonIcon icon={language} className="w-5 h-5 mr-2" />
                  <span>{startTranslationLabel}</span>
                </Button>
              )}
            </div>
          )}
          
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Max 75MB / 15 seconds
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </motion.div>
  );
}