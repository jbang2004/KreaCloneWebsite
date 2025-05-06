import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Play, Pause, RotateCw, Languages, Copy, CheckCheck, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingComplete, setProcessingComplete] = useState<boolean>(false);
  const [translationLanguage, setTranslationLanguage] = useState<string>("en");
  const videoRef = useRef<HTMLVideoElement>(null);

  // 为演示添加一些示例字幕
  useEffect(() => {
    if (processingComplete) {
      setSubtitles([
        {
          id: "subtitle1",
          startTime: "00:00:10.090",
          endTime: "00:00:13.151",
          text: "嗨，谢谢你点开我们的视频，今天我要介绍我们公司的产品。",
          translation: "Hi, and thank you for clicking on our video, today I want to introduce our company's product."
        },
        {
          id: "subtitle2",
          startTime: "00:00:13.151",
          endTime: "00:00:17.123",
          text: "我们的产品是基于人工智能的创新解决方案，可以帮助客户提高效率。",
          translation: "Our product is an innovative AI-based solution that helps customers improve efficiency."
        },
        {
          id: "subtitle3",
          startTime: "00:00:17.562",
          endTime: "00:00:19.919",
          text: "我本人之前在科技行业工作了10年，对这个领域非常熟悉。",
          translation: "I've personally worked in the tech industry for 10 years, so I'm very familiar with this field."
        },
        {
          id: "subtitle4",
          startTime: "00:00:20.353",
          endTime: "00:00:24.699",
          text: "好了，请问有什么问题想要了解的吗？有多长？多长时间？",
          translation: "Well, do you have any questions? How long? How much time?"
        },
      ]);
    }
  }, [processingComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      setIsProcessing(false);
      setProcessingComplete(false);
      setSubtitles([]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setVideoUrl(url);
      setIsProcessing(false);
      setProcessingComplete(false);
      setSubtitles([]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateTime = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startProcessing = () => {
    if (!videoUrl) return;
    
    setIsProcessing(true);
    
    // 模拟处理过程
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingComplete(true);
    }, 3000);
  };

  const handleSubtitleClick = (id: string) => {
    setSelectedSubtitle(id);
    const subtitle = subtitles.find(s => s.id === id);
    if (subtitle) {
      // 从格式为"00:00:10.090"的时间字符串提取秒数
      const [minutes, seconds] = subtitle.startTime.split(':').slice(1);
      const timeInSeconds = parseInt(minutes) * 60 + parseFloat(seconds);
      seekTo(timeInSeconds);
    }
  };

  const translateAll = () => {
    // 模拟批量翻译
    // 实际应用中这里会调用API进行翻译
    console.log("Translating all subtitles");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const updateSubtitleText = (id: string, text: string) => {
    setSubtitles(prev => prev.map(subtitle => 
      subtitle.id === id ? { ...subtitle, text } : subtitle
    ));
  };

  const updateSubtitleTranslation = (id: string, translation: string) => {
    setSubtitles(prev => prev.map(subtitle => 
      subtitle.id === id ? { ...subtitle, translation } : subtitle
    ));
  };

  // 根据语言选择显示的文本
  const title = language === "zh" ? "视频翻译" : "Video Translation";
  const subTitle = language === "zh" 
    ? "上传视频并自动生成字幕，一键翻译为多种语言" 
    : "Upload videos and automatically generate subtitles, translate to multiple languages with one click";
  const uploadLabel = language === "zh" ? "上传视频" : "Upload Video";
  const dropzoneText = language === "zh" ? "拖放视频文件到这里" : "Drop video file here";
  const orText = language === "zh" ? "或" : "or";
  const browseText = language === "zh" ? "浏览文件" : "Browse Files";
  const supportedFormats = language === "zh" 
    ? "支持的格式: MP4, AVI, MOV, MKV" 
    : "Supported formats: MP4, AVI, MOV, MKV";
  const processButtonText = language === "zh" ? "提取字幕" : "Extract Subtitles";
  const processingText = language === "zh" ? "处理中..." : "Processing...";
  const subtitleText = language === "zh" ? "字幕" : "Subtitles";
  const translationText = language === "zh" ? "翻译" : "Translation";
  const autoTranslateText = language === "zh" ? "自动翻译" : "Auto Translate";
  const sourceLanguageText = language === "zh" ? "源语言" : "Source Language";
  const targetLanguageText = language === "zh" ? "目标语言" : "Target Language";
  const translateAllText = language === "zh" ? "翻译全部" : "Translate All";

  // 模拟的语言选项
  const languageOptions = [
    { value: "zh", label: "中文" },
    { value: "en", label: "English" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" },
  ];

  // 动画变体
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      } 
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl w-full mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{subTitle}</p>
        </div>

        {!videoUrl ? (
          <div 
            className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('video-file-input')?.click()}
          >
            <input 
              type="file" 
              id="video-file-input" 
              className="hidden" 
              accept=".mp4,.avi,.mov,.mkv"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center">
              <Upload size={40} className="mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">{dropzoneText}</h3>
              <p className="mb-4 text-muted-foreground">{orText}</p>
              <Button variant="outline" className="mb-4">
                {browseText}
              </Button>
              <p className="text-sm text-muted-foreground">{supportedFormats}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlayback}
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="relative w-full h-1 bg-white/30 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <input 
                      type="range"
                      min={0}
                      max={duration}
                      value={currentTime}
                      onChange={(e) => seekTo(parseFloat(e.target.value))}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              {!processingComplete && (
                <Button 
                  className="w-full"
                  onClick={startProcessing}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RotateCw size={16} className="mr-2 animate-spin" />
                      {processingText}
                    </>
                  ) : processButtonText}
                </Button>
              )}
            </div>
            
            <div className="lg:col-span-5">
              {processingComplete && (
                <Tabs defaultValue="subtitles" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="subtitles" className="flex-1">{subtitleText}</TabsTrigger>
                    <TabsTrigger value="translation" className="flex-1">{translationText}</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-translate" />
                      <Label htmlFor="auto-translate">{autoTranslateText}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Select defaultValue="zh">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder={sourceLanguageText} />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <ArrowRightLeft size={16} />
                      
                      <Select 
                        value={translationLanguage}
                        onValueChange={setTranslationLanguage}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder={targetLanguageText} />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <TabsContent value="subtitles" className="mt-2">
                    <div className="mb-4">
                      <Button variant="outline" className="w-full" onClick={translateAll}>
                        <Languages size={16} className="mr-2" />
                        {translateAllText}
                      </Button>
                    </div>
                    
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 border-b border-border bg-muted text-xs font-medium p-2">
                        <div className="col-span-1">时间</div>
                        <div className="col-span-3">文本</div>
                      </div>
                      
                      <motion.div 
                        className="h-[400px] overflow-y-auto"
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {subtitles.map(subtitle => (
                          <motion.div 
                            key={subtitle.id}
                            className={`grid grid-cols-4 p-2 hover:bg-muted/50 cursor-pointer ${selectedSubtitle === subtitle.id ? 'bg-muted' : ''}`}
                            onClick={() => handleSubtitleClick(subtitle.id)}
                            variants={itemVariants}
                          >
                            <div className="col-span-1 text-xs text-muted-foreground">
                              <div>{subtitle.startTime.substring(3)}</div>
                              <div>{subtitle.endTime.substring(3)}</div>
                            </div>
                            <div className="col-span-3">
                              <Textarea 
                                value={subtitle.text}
                                onChange={(e) => updateSubtitleText(subtitle.id, e.target.value)}
                                className="min-h-[60px] text-sm"
                              />
                              <div className="flex justify-end mt-1">
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(subtitle.text)}>
                                  <Copy size={14} />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="translation" className="mt-2">
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 border-b border-border bg-muted text-xs font-medium p-2">
                        <div className="col-span-1">时间</div>
                        <div className="col-span-3">翻译</div>
                      </div>
                      
                      <motion.div 
                        className="h-[400px] overflow-y-auto"
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {subtitles.map(subtitle => (
                          <motion.div 
                            key={subtitle.id}
                            className={`grid grid-cols-4 p-2 hover:bg-muted/50 cursor-pointer ${selectedSubtitle === subtitle.id ? 'bg-muted' : ''}`}
                            onClick={() => handleSubtitleClick(subtitle.id)}
                            variants={itemVariants}
                          >
                            <div className="col-span-1 text-xs text-muted-foreground">
                              <div>{subtitle.startTime.substring(3)}</div>
                              <div>{subtitle.endTime.substring(3)}</div>
                            </div>
                            <div className="col-span-3">
                              <Textarea 
                                value={subtitle.translation}
                                onChange={(e) => updateSubtitleTranslation(subtitle.id, e.target.value)}
                                className="min-h-[60px] text-sm"
                              />
                              <div className="flex justify-end mt-1">
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(subtitle.translation)}>
                                  <Copy size={14} />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}