import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  addCircle, 
  videocam,
  language,
  chevronDown,
  document,
  close,
  play,
  pauseCircle
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

export default function VideoTranslation() {
  const { language: currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [translationStarted, setTranslationStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranslationStarted(false);
      setUploadComplete(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadClick = () => {
    if (uploadComplete && videoRef.current) {
      togglePlayback();
    } else {
      fileInputRef.current?.click();
    }
  };
  
  // 切换视频播放状态
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("播放视频时出错:", error);
          });
      }
    }
  };

  // 开始翻译处理
  const startTranslation = () => {
    if (!selectedFile) return;
    
    setTranslationStarted(true);
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

  // 重置和重新上传
  const resetUpload = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setTranslationStarted(false);
    setIsPlaying(false);
  };

  // 模拟翻译完成后的操作
  const handleTranslationComplete = () => {
    // 这里可以添加翻译完成后的逻辑
    alert(currentLanguage === "zh" ? "字幕已翻译为" + getLanguageLabel(targetLanguage) : "Subtitles translated to " + getLanguageLabel(targetLanguage));
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
  const startPreprocessingLabel = currentLanguage === "zh" ? "开始预处理" : "Start Preprocessing";
  const startTranslationLabel = currentLanguage === "zh" ? "开始翻译" : "Translate";
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
          "p-4 rounded-3xl", 
          theme === "dark" ? "bg-zinc-900" : "bg-gray-100"
        )}>
          {/* 内容上部区域 - 保持同样高度 */}
          <div className="h-[290px] mb-6 flex items-center justify-center">
            {uploadComplete ? (
              <div className="w-full h-full rounded-xl overflow-hidden bg-black relative">
                {/* 使用公共测试视频文件 */}
                <video 
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  poster="https://i.ytimg.com/vi/Qw8Pvk2PeMk/maxresdefault.jpg"
                  playsInline
                  preload="auto"
                >
                  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
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
                
                {/* 关闭按钮 - 右上角 */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 bg-black/60 backdrop-blur-sm text-white rounded-full z-10" 
                  onClick={resetUpload}
                >
                  <IonIcon icon={close} className="h-4 w-4" />
                </Button>
                
                {/* 视频名称 - 左下角 */}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs max-w-[70%] truncate z-10">
                  {selectedFile?.name || "sample-video.mp4"}
                </div>
              </div>
            ) : (
              // 默认静态图片区域 - 填充整个空间
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
                {/* 视频相关图像 */}
                <div className="relative flex justify-center scale-110">
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
          
          {/* 文件上传状态 - 与音频转录保持一致 */}
          {selectedFile && !translationStarted && !uploadComplete && (
            <div className="mb-4 p-3 bg-background rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-lg h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <IonIcon icon={document} className="h-5 w-5 text-foreground/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{selectedFile.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 text-xs"
                  onClick={startTranslation}
                >
                  {startPreprocessingLabel}
                </Button>
              </div>
            </div>
          )}
          
          {/* 处理进度条 */}
          {isUploading && (
            <div className="mb-4 p-3 bg-background rounded-xl border border-border">
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {uploadProgress < 50 ? uploadingLabel : 
                   uploadProgress < 90 ? processingLabel : translatingLabel} {uploadProgress}%
                </p>
              </div>
            </div>
          )}
          
          {/* 结果消息 */}
          {uploadComplete && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-center">
              <p>{currentLanguage === "zh" ? "视频已处理完成，可以开始翻译" : "Video processing completed, ready for translation"}</p>
            </div>
          )}
          
          {/* 按钮区域 */}
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
                  ? (isPlaying ? (currentLanguage === "zh" ? "暂停" : "Pause") : (currentLanguage === "zh" ? "播放" : "Play")) 
                  : uploadVideoLabel}
              </span>
            </Button>
            
            {uploadComplete ? (
              <Button
                className={cn(
                  "flex-1 h-12 rounded-xl transition-colors flex items-center justify-center",
                  "bg-blue-600 hover:bg-blue-700 text-white"
                )}
                onClick={handleTranslationComplete}
              >
                <IonIcon icon={language} className="w-5 h-5 mr-2" />
                <span>{startTranslationLabel}</span>
              </Button>
            ) : (
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
            )}
          </div>
          
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Max 75MB / 15 seconds
          </div>
        </div>
      </div>
      
      {/* 隐藏的文件输入 */}
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