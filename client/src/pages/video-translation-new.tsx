import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  addCircle, 
  videocam,
  language,
  chevronDown,
  document,
  close,
  play,
  pauseCircle,
  save,
  pencil,
  checkmark,
  timeOutline,
  caretForwardOutline
} from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 字幕数据接口
interface Subtitle {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
  translation: string;
  isEditing?: boolean;
  isPanelClosed?: boolean;
}

// 生成模拟字幕数据
const generateMockSubtitles = (): Subtitle[] => {
  return [
    { id: "1", startTime: "00:00:02", endTime: "00:00:04", text: "Hello and welcome to this video.", translation: "您好，欢迎观看此视频。" },
    { id: "2", startTime: "00:00:05", endTime: "00:00:08", text: "Today we're going to talk about AI translation.", translation: "今天我们将讨论AI翻译。" },
    { id: "3", startTime: "00:00:09", endTime: "00:00:13", text: "This technology allows us to bridge language barriers.", translation: "这项技术使我们能够跨越语言障碍。" },
    { id: "4", startTime: "00:00:14", endTime: "00:00:17", text: "Making communication easier across the world.", translation: "使全球沟通变得更加容易。" },
    { id: "5", startTime: "00:00:18", endTime: "00:00:22", text: "Let's see how this works in practice.", translation: "让我们看看这在实践中是如何工作的。" },
    { id: "6", startTime: "00:00:23", endTime: "00:00:28", text: "The first step is to extract the audio from a video.", translation: "第一步是从视频中提取音频。" },
    { id: "7", startTime: "00:00:29", endTime: "00:00:34", text: "Then we transcribe the audio into text.", translation: "然后我们将音频转录为文本。" },
    { id: "8", startTime: "00:00:35", endTime: "00:00:39", text: "Next, we translate that text into another language.", translation: "接下来，我们将该文本翻译成另一种语言。" },
    { id: "9", startTime: "00:00:40", endTime: "00:00:45", text: "Finally, we can sync the translated text back with the video.", translation: "最后，我们可以将翻译后的文本与视频重新同步。" },
    { id: "10", startTime: "00:00:46", endTime: "00:00:50", text: "This creates a seamless experience for viewers worldwide.", translation: "这为全球观众创造了无缝体验。" },
  ];
};

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
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
  const [editingSubtitleId, setEditingSubtitleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitlesContainerRef = useRef<HTMLDivElement>(null);
  const panelClosedRef = useRef<boolean>(false);
  
  // 使用useEffect来加载模拟字幕数据
  useEffect(() => {
    // 只有当上传完成且还没有字幕数据时才加载字幕
    // 并检查面板是否被用户主动关闭
    if (uploadComplete && !showSubtitles && subtitles.length === 0 && !panelClosedRef.current) {
      // 延迟一秒后显示字幕，模拟加载过程
      const timer = setTimeout(() => {
        setSubtitles(generateMockSubtitles());
        setShowSubtitles(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadComplete, showSubtitles, subtitles.length]);
  
  // 格式化时间函数
  const formatTime = (timeString: string): string => {
    return timeString;
  };
  
  // 跳转到特定时间点
  const jumpToTime = (timeString: string) => {
    if (videoRef.current) {
      const [minutes, seconds] = timeString.split(':').map(Number);
      const totalSeconds = minutes * 60 + seconds;
      videoRef.current.currentTime = totalSeconds;
      
      if (!isPlaying) {
        togglePlayback();
      }
    }
  };
  
  // 更新字幕翻译
  const updateSubtitleTranslation = (id: string, newTranslation: string) => {
    setSubtitles(prevSubtitles => 
      prevSubtitles.map(sub => 
        sub.id === id ? { ...sub, translation: newTranslation } : sub
      )
    );
  };
  
  // 切换编辑模式
  const toggleEditMode = (id: string) => {
    if (editingSubtitleId === id) {
      setEditingSubtitleId(null);
    } else {
      setEditingSubtitleId(id);
    }
  };
  
  // 开始生成视频
  const startGenerating = () => {
    alert(currentLanguage === 'zh' ? '开始生成翻译后的视频！' : 'Starting to generate translated video!');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranslationStarted(false);
      setUploadComplete(false);
      setIsUploading(false);
      setUploadProgress(0);
      setShowSubtitles(false);
      setSubtitles([]);
      setEditingSubtitleId(null);
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
    setShowSubtitles(false);
    setSubtitles([]);
    panelClosedRef.current = false; // 重置面板关闭标记
  };
  
  // 关闭字幕面板
  const closeSubtitlesPanel = () => {
    setShowSubtitles(false);
    // 设置引用标记，防止自动重新显示字幕面板
    panelClosedRef.current = true;
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

  // 标签文本
  const playLabel = currentLanguage === "zh" ? "播放" : "Play";
  const pauseLabel = currentLanguage === "zh" ? "暂停" : "Pause";
  const editLabel = currentLanguage === "zh" ? "编辑" : "Edit";
  const saveLabel = currentLanguage === "zh" ? "保存" : "Save";
  const generateLabel = currentLanguage === "zh" ? "开始生成" : "Start Generating";
  const originalSubtitleLabel = currentLanguage === "zh" ? "原始字幕" : "Original Subtitle";
  const translatedSubtitleLabel = currentLanguage === "zh" ? "翻译字幕" : "Translated Subtitle";
  const startTimeLabel = currentLanguage === "zh" ? "开始时间" : "Start Time";
  const endTimeLabel = currentLanguage === "zh" ? "结束时间" : "End Time";
  const jumpToLabel = currentLanguage === "zh" ? "跳转" : "Jump to";
  const noSubtitlesLabel = currentLanguage === "zh" ? "视频处理完成后，字幕将显示在这里" : "Subtitles will appear here after video processing";
  const processingSubtitlesLabel = currentLanguage === "zh" ? "正在提取字幕..." : "Extracting subtitles...";
  const closeLabel = currentLanguage === "zh" ? "关闭" : "Close";

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap justify-center md:justify-start -mx-4">
        {/* 左侧视频区域 - 预处理完成后整体向左移动，但保持固定尺寸 */}
        <AnimatePresence>
          <motion.div
            className={cn(
              "px-4",
              showSubtitles 
                ? "w-full max-w-sm md:max-w-xs lg:max-w-sm transition-all duration-500 ease-in-out" 
                : "w-full max-w-sm transition-all duration-500 ease-in-out mx-auto"
            )}
            initial={false}
            animate={{ 
              x: showSubtitles ? "-5%" : "0%",
              marginLeft: showSubtitles ? "0" : "auto",
              marginRight: showSubtitles ? "0" : "auto"
            }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
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
              {uploadComplete && !showSubtitles && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-center">
                  <p>{processingSubtitlesLabel}</p>
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
                      ? (isPlaying ? pauseLabel : playLabel) 
                      : uploadVideoLabel}
                  </span>
                </Button>
                
                {uploadComplete ? (
                  showSubtitles ? (
                    <Button
                      className={cn(
                        "flex-1 h-12 rounded-xl transition-colors flex items-center justify-center",
                        "bg-purple-600 hover:bg-purple-700 text-white"
                      )}
                      onClick={startGenerating}
                    >
                      <IonIcon icon={save} className="w-5 h-5 mr-2" />
                      <span>{generateLabel}</span>
                    </Button>
                  ) : (
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
                  )
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
          </motion.div>
        </AnimatePresence>
        
        {/* 右侧字幕编辑区域 - 仅在预处理完成后显示 */}
        <AnimatePresence>
          {showSubtitles && (
            <motion.div 
              className="w-full max-w-sm md:max-w-none md:w-1/2 lg:w-3/5 px-4 mt-8 md:mt-0 mx-auto md:mx-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className={cn(
                "p-4 rounded-3xl h-full relative", 
                theme === "dark" ? "bg-zinc-900" : "bg-gray-100"
              )}>
                {/* 关闭按钮 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 z-10"
                  onClick={closeSubtitlesPanel}
                >
                  <IonIcon icon={close} className="h-4 w-4" />
                  <span className="sr-only">{closeLabel}</span>
                </Button>
                
                <div className="flex items-center justify-between mb-4 pr-10">
                  <h2 className="text-xl font-bold">{translatedSubtitleLabel}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {currentLanguage === "zh" ? "翻译语言:" : "Translation Language:"}
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                          {getLanguageLabel(targetLanguage)}
                          <IonIcon icon={chevronDown} className="ml-1 h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0" align="end">
                        <div className="p-1">
                          {languageOptions.map(lang => (
                            <Button
                              key={lang.value}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-left text-xs",
                                targetLanguage === lang.value && "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-500"
                              )}
                              onClick={() => setTargetLanguage(lang.value)}
                            >
                              {lang.label}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* 字幕列表 */}
                <ScrollArea className="h-[550px] pr-4 rounded-md">
                  <div className="space-y-4" ref={subtitlesContainerRef}>
                    {subtitles.map((subtitle) => (
                      <motion.div 
                        key={subtitle.id}
                        className={cn(
                          "p-4 rounded-xl border",
                          theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* 时间戳和跳转按钮 */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <IonIcon icon={timeOutline} className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-muted-foreground">
                                {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              onClick={() => jumpToTime(subtitle.startTime)}
                            >
                              <IonIcon icon={caretForwardOutline} className="h-3 w-3 mr-1" />
                              {jumpToLabel}
                            </Button>
                          </div>
                        </div>
                        
                        {/* 原文字幕 */}
                        <div className="mb-3">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            {originalSubtitleLabel}
                          </label>
                          <div className={cn(
                            "p-3 rounded-lg text-sm",
                            theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
                          )}>
                            {subtitle.text}
                          </div>
                        </div>
                        
                        {/* 翻译字幕 */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              {translatedSubtitleLabel}
                            </label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => toggleEditMode(subtitle.id)}
                            >
                              <IonIcon icon={editingSubtitleId === subtitle.id ? checkmark : pencil} className="h-3 w-3 mr-1" />
                              {editingSubtitleId === subtitle.id ? saveLabel : editLabel}
                            </Button>
                          </div>
                          
                          {editingSubtitleId === subtitle.id ? (
                            <Textarea
                              value={subtitle.translation}
                              onChange={(e) => updateSubtitleTranslation(subtitle.id, e.target.value)}
                              className={cn(
                                "min-h-[60px] text-sm",
                                theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white"
                              )}
                            />
                          ) : (
                            <div className={cn(
                              "p-3 rounded-lg text-sm",
                              theme === "dark" ? "bg-zinc-900 text-blue-400" : "bg-blue-50 text-blue-700"
                            )}>
                              {subtitle.translation}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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