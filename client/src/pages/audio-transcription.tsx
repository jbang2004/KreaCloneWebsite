import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Mic, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";

export default function AudioTranscription() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [transcriptionStarted, setTranscriptionStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcriptionResult, setTranscriptionResult] = useState<string[]>([]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTranscriptionStarted(false);
      setTranscriptionResult([]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setTranscriptionStarted(false);
      setTranscriptionResult([]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setTranscriptionStarted(false);
    setTranscriptionResult([]);
  };

  const title = language === "zh" ? "音频转录" : "Audio Transcription";
  const subTitle = language === "zh" 
    ? "上传音频文件或录制语音，获取精准的文字转录" 
    : "Upload audio files or record your voice to get accurate text transcriptions";
  const uploadLabel = language === "zh" ? "上传音频" : "Upload Audio";
  const recordLabel = language === "zh" ? "录制语音" : "Record Audio";
  const dropzoneText = language === "zh" ? "拖放音频文件到这里" : "Drop audio file here";
  const orText = language === "zh" ? "或" : "or";
  const browseText = language === "zh" ? "浏览文件" : "Browse Files";
  const supportedFormats = language === "zh" 
    ? "支持的格式: MP3, WAV, M4A, FLAC" 
    : "Supported formats: MP3, WAV, M4A, FLAC";
  const transcribeText = language === "zh" ? "开始转录" : "Start Transcription";
  const processingText = language === "zh" ? "处理中..." : "Processing...";
  const transcriptionResultText = language === "zh" ? "转录结果" : "Transcription Result";
  const removeFileText = language === "zh" ? "移除文件" : "Remove File";

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl w-full mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{subTitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/30 hover:border-primary/70 rounded-xl"
          >
            <Upload size={24} className="text-primary" />
            <span>{uploadLabel}</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/30 hover:border-primary/70 rounded-xl"
          >
            <Mic size={24} className="text-primary" />
            <span>{recordLabel}</span>
          </Button>
        </div>

        {!file ? (
          <div 
            className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('audio-file-input')?.click()}
          >
            <input 
              type="file" 
              id="audio-file-input" 
              className="hidden" 
              accept=".mp3,.wav,.m4a,.flac"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center">
              <FileText size={40} className="mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">{dropzoneText}</h3>
              <p className="mb-4 text-muted-foreground">{orText}</p>
              <Button variant="outline" className="mb-4">
                {browseText}
              </Button>
              <p className="text-sm text-muted-foreground">{supportedFormats}</p>
            </div>
          </div>
        ) : (
          <div className="border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FileText size={24} className="mr-2 text-primary" />
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <Trash2 size={18} className="text-muted-foreground" />
                <span className="sr-only">{removeFileText}</span>
              </Button>
            </div>

            {!transcriptionStarted ? (
              <Button 
                className="w-full" 
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
                <h3 className="font-medium mb-3">{transcriptionResultText}</h3>
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
          </div>
        )}
      </div>
    </motion.div>
  );
}