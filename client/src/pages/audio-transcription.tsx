import { useState, useRef } from "react";
import { motion } from "framer-motion";
import StaggeredAnimation from "@/components/staggered-animation";
import AudioIcon from "@/components/audio-icon";
import LottieAnimation from "@/components/lottie-animation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AudioTranscription() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [transcriptionStarted, setTranscriptionStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcriptionResult, setTranscriptionResult] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language === "zh" ? "zh-CN" : "en-US");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模拟转录过程
  const startTranscription = () => {
    if (!file) return;
    
    setTranscriptionStarted(true);
    setProgress(0);
    
    // 模拟进度条
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // 模拟转录结果
          setTranscriptionResult([
            "嗨，谢谢你点开我们的视频，今天我要介绍我们公司的产品。",
            "我们的产品是基于人工智能的创新解决方案，可以帮助客户提高效率。",
            "我本人之前在科技行业工作了10年，对这个领域非常熟悉。",
            "好了，请问有什么问题想要了解的吗？有多长？多长时间？"
          ]);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTranscriptionStarted(false);
      setTranscriptionResult([]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setTranscriptionStarted(false);
    setTranscriptionResult([]);
  };

  // 语言选项
  const languageOptions = [
    { value: "zh-CN", label: language === "zh" ? "中文（简体）" : "Chinese (Simplified)" },
    { value: "en-US", label: language === "zh" ? "英语（美国）" : "English (US)" },
    { value: "ja-JP", label: language === "zh" ? "日语" : "Japanese" },
    { value: "ko-KR", label: language === "zh" ? "韩语" : "Korean" },
    { value: "fr-FR", label: language === "zh" ? "法语" : "French" },
    { value: "de-DE", label: language === "zh" ? "德语" : "German" },
    { value: "es-ES", label: language === "zh" ? "西班牙语" : "Spanish" },
  ];

  const title = language === "zh" ? "音频转录" : "Audio Transcription";
  const description = language === "zh" 
    ? "将语音自动转换为文本，支持多种语言的精准识别和转录" 
    : "Automatically convert speech to text with accurate recognition and transcription in multiple languages";
  const uploadLabel = language === "zh" ? "上传音频文件" : "Upload Audio File";
  const selectFromAssetsLabel = language === "zh" ? "从资源库选择" : "Select from Assets";
  const recordLabel = language === "zh" ? "录制语音" : "Record Voice";
  const supportText = language === "zh" 
    ? "上传音频文件以转录成文本。支持格式：MP3, WAV, M4A, FLAC。文件大小限制：20MB。" 
    : "Upload an audio file to transcribe into text. Supported formats: MP3, WAV, M4A, FLAC. File size limit: 20MB.";
  const languageSelectorLabel = language === "zh" ? "音频语言" : "Audio Language";
  const transcribeText = language === "zh" ? "开始转录" : "Start Transcription";
  const processingText = language === "zh" ? "处理中..." : "Processing...";
  const transcriptionResultText = language === "zh" ? "转录结果" : "Transcription Result";
  const copyAllText = language === "zh" ? "复制全部" : "Copy All";
  const exportText = language === "zh" ? "导出" : "Export";

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 bg-muted rounded-xl p-4 inline-block">
          <LottieAnimation type="microphone" width={100} height={100} />
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {description}
        </p>
      </div>
      
      <div className="w-full max-w-md mb-8">
        <div className="bg-card p-4 rounded-xl border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">{languageSelectorLabel}</div>
          </div>
          
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(lang => (
                <SelectItem key={`lang-${lang.value}`} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.flac"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center gap-4 w-full">
          <Button
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center"
            size="lg"
            onClick={handleFileClick}
          >
            <AudioIcon icon="upload" size={20} className="mr-2" />
            {uploadLabel}
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            size="lg"
          >
            <AudioIcon icon="folder" size={20} className="mr-2" />
            {selectFromAssetsLabel}
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            size="lg"
          >
            <AudioIcon icon="microphone" size={20} className="mr-2" />
            {recordLabel}
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
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-muted rounded-lg h-16 w-16 flex items-center justify-center">
              <AudioIcon icon="music-note" size={24} className="text-foreground/70" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{file.name}</h3>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                {languageOptions.find(l => l.value === selectedLanguage)?.label}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="self-start"
            >
              <AudioIcon icon="trash" size={20} className="text-muted-foreground" />
            </Button>
          </div>

          {!transcriptionStarted ? (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded"
              onClick={startTranscription}
            >
              {transcribeText}
            </Button>
          ) : progress < 100 ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">{processingText} {progress}%</p>
            </div>
          ) : (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{transcriptionResultText}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {copyAllText}
                  </Button>
                  <Button variant="outline" size="sm">
                    {exportText}
                  </Button>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-4">
                {transcriptionResult.map((line, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 text-muted-foreground text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-grow">
                      <div className="p-2 bg-card rounded border border-border">
                        {line}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
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