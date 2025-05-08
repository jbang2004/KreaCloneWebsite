import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  LanguageIcon, 
  ArrowUpTrayIcon, 
  FolderOpenIcon, 
  FilmIcon, 
  ArrowRightIcon, 
  PlayIcon, 
  PauseIcon, 
  PencilSquareIcon, 
  ArrowDownTrayIcon, 
  ClockIcon, 
  DocumentCheckIcon, 
  SpeakerWaveIcon
} from "@heroicons/react/24/outline";
import VideoAnimation from "@/components/animations/VideoAnimation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessed, setIsProcessed] = useState(false);
  const [currentTab, setCurrentTab] = useState("original");
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      setIsProcessed(false);
      setIsProcessing(false);
      setProgress(0);
      setSubtitles([]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const startProcessing = () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // 模拟进度条
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsProcessed(true);
          // 模拟字幕提取结果
          setSubtitles([
            {
              id: "1",
              startTime: "00:00:01,200",
              endTime: "00:00:04,500",
              text: "嗨，谢谢你点开我们的视频",
              translation: "Hi, thank you for clicking on our video"
            },
            {
              id: "2",
              startTime: "00:00:05,000",
              endTime: "00:00:09,800",
              text: "今天我要介绍我们公司的产品",
              translation: "Today I'm going to introduce our company's product"
            },
            {
              id: "3",
              startTime: "00:00:10,200",
              endTime: "00:00:15,500",
              text: "我们的产品是基于人工智能的创新解决方案",
              translation: "Our product is an innovative solution based on artificial intelligence"
            },
            {
              id: "4",
              startTime: "00:00:16,000",
              endTime: "00:00:19,800",
              text: "可以帮助客户提高效率",
              translation: "It can help customers improve efficiency"
            }
          ]);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const updateSubtitleTranslation = (id: string, translation: string) => {
    setSubtitles(prev => 
      prev.map(subtitle => 
        subtitle.id === id ? { ...subtitle, translation } : subtitle
      )
    );
  };

  const updateSubtitleText = (id: string, text: string) => {
    setSubtitles(prev => 
      prev.map(subtitle => 
        subtitle.id === id ? { ...subtitle, text } : subtitle
      )
    );
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
      <div className="text-center mb-8 relative">
        <div className="mx-auto mb-4 bg-muted rounded-xl p-4 inline-block relative overflow-hidden h-[160px] w-[160px]">
          <VideoAnimation isActive={true} intensity="medium" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FilmIcon className="h-12 w-12 text-primary z-10" />
          </div>
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
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground mx-2" />
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
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            {uploadVideoLabel}
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            size="lg"
          >
            <FolderOpenIcon className="h-5 w-5 mr-2" />
            {selectFromAssetsLabel}
          </Button>
        </div>
      </div>

      {file && !isProcessing && !isProcessed && (
        <motion.div 
          className="w-full max-w-md bg-card rounded-xl border border-border p-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-lg h-16 w-16 flex items-center justify-center">
              <FilmIcon className="h-6 w-6 text-foreground/70" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{file.name}</h3>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded"
              onClick={startProcessing}
            >
              {language === "zh" ? "开始处理" : "Process"}
            </Button>
          </div>
        </motion.div>
      )}
      
      {isProcessing && (
        <motion.div 
          className="w-full max-w-md bg-card rounded-xl border border-border p-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-2 text-center">
            <p className="text-sm font-medium">{language === "zh" ? "处理中..." : "Processing..."}</p>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{language === "zh" ? "提取字幕中..." : "Extracting subtitles..."}</span>
            <span>{progress}%</span>
          </div>
        </motion.div>
      )}
      
      {isProcessed && (
        <motion.div 
          className="w-full max-w-4xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 视频播放区域 */}
            <div className="bg-card p-4 rounded-xl border border-border">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  {file && (
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHBhdGggZD0iTTExLjk2OSAyQzYuNDY1IDIgMiA2LjQ3NSAyIDEyQzIgMTcuNTM0IDYuNDc1IDIyIDEyIDIyQzE3LjUzNCAyMiAyMiAxNy41MjUgMjIgMTJDMjIgNi40NjUgMTcuNTIzIDIgMTEuOTY5IDJaTTEwIDguNzVWMTUuMjVMMTUuNSAxMkwxMCA4Ljc1WiIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==" 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover opacity-50"
                    />
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute w-16 h-16 rounded-full bg-background/20 hover:bg-background/30 text-white"
                    onClick={togglePlayback}
                  >
                    {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
                  </Button>
                </div>
                <div className="absolute bottom-4 left-0 right-0 px-4 text-center">
                  <p className="text-sm bg-background/50 backdrop-blur-sm text-white p-2 rounded">
                    {currentTab === "original" ? subtitles[0]?.text : subtitles[0]?.translation}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm">
                  <SpeakerWaveIcon className="mr-2 h-4 w-4" />
                  {language === "zh" ? "生成配音" : "Generate Voiceover"}
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    {language === "zh" ? "下载视频" : "Download Video"}
                  </Button>
                </div>
              </div>
              
              <div className="mb-2 px-2">
                <h3 className="text-sm font-medium">{file?.name}</h3>
              </div>
            </div>
            
            {/* 字幕编辑区域 */}
            <div className="bg-card p-4 rounded-xl border border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {language === "zh" ? "视频字幕" : "Video Subtitles"}
                </h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <DocumentCheckIcon className="mr-2 h-4 w-4" />
                    {language === "zh" ? "保存全部" : "Save All"}
                  </Button>
                  <Button size="sm" variant="outline">
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    {language === "zh" ? "下载SRT" : "Download SRT"}
                  </Button>
                </div>
              </div>
              
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="original" className="flex-1">{language === "zh" ? "原始字幕" : "Original Subtitles"}</TabsTrigger>
                  <TabsTrigger value="translated" className="flex-1">{language === "zh" ? "翻译字幕" : "Translated Subtitles"}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="original" className="space-y-4 max-h-[400px] overflow-y-auto">
                  {subtitles.map((subtitle) => (
                    <div key={subtitle.id} className="bg-muted p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span>{subtitle.startTime} → {subtitle.endTime}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <PencilSquareIcon className="h-3 w-3 mr-1" />
                          <span className="text-xs">{language === "zh" ? "编辑" : "Edit"}</span>
                        </Button>
                      </div>
                      <Textarea
                        value={subtitle.text}
                        onChange={(e) => updateSubtitleText(subtitle.id, e.target.value)}
                        className="min-h-0 h-14 text-sm resize-none bg-card"
                      />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="translated" className="space-y-4 max-h-[400px] overflow-y-auto">
                  {subtitles.map((subtitle) => (
                    <div key={subtitle.id} className="bg-muted p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span>{subtitle.startTime} → {subtitle.endTime}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <PencilSquareIcon className="h-3 w-3 mr-1" />
                          <span className="text-xs">{language === "zh" ? "编辑" : "Edit"}</span>
                        </Button>
                      </div>
                      <Textarea
                        value={subtitle.translation}
                        onChange={(e) => updateSubtitleTranslation(subtitle.id, e.target.value)}
                        className="min-h-0 h-14 text-sm resize-none bg-card"
                      />
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      )}

      {!isProcessed && (
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
      )}
    </motion.div>
  );
}