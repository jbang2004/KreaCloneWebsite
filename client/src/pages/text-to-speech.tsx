import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Volume2, User, Settings, Wand2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: string;
}

export default function TextToSpeech() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [text, setText] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("voice1");
  const [speed, setSpeed] = useState<number[]>([1]);
  const [pitch, setPitch] = useState<number[]>([1]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);

  // 示例的语音列表
  const voices: Voice[] = [
    { id: "voice1", name: "王小明", language: "zh-CN", gender: "male" },
    { id: "voice2", name: "李小花", language: "zh-CN", gender: "female" },
    { id: "voice3", name: "John", language: "en-US", gender: "male" },
    { id: "voice4", name: "Sarah", language: "en-US", gender: "female" },
    { id: "voice5", name: "智能女声", language: "zh-CN", gender: "female" },
    { id: "voice6", name: "智能男声", language: "zh-CN", gender: "male" },
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // 如果有生成的音频，当文本改变时重置
    if (generatedAudioUrl) {
      setGeneratedAudioUrl(null);
      setIsPlaying(false);
    }
  };

  const generateSpeech = () => {
    if (text.trim() === "") return;
    
    setIsGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      // 这里只是模拟URL，实际应用中会从API获取真实的音频URL
      setGeneratedAudioUrl("https://example.com/generated-audio.mp3");
      setIsGenerating(false);
      setIsPlaying(true);
    }, 2000);
  };

  const togglePlayback = () => {
    if (generatedAudioUrl) {
      setIsPlaying(!isPlaying);
    }
  };

  // 根据语言选择显示的文本
  const title = language === "zh" ? "文本配音" : "Text to Speech";
  const subTitle = language === "zh" 
    ? "将文本转换为逼真的语音，提供多种声音和风格选择" 
    : "Convert text to realistic speech with multiple voices and styles";
  const textPlaceholder = language === "zh" 
    ? "在此输入您想要转换成语音的文字..." 
    : "Enter text you want to convert to speech here...";
  const generateButtonText = language === "zh" ? "生成语音" : "Generate Speech";
  const processingText = language === "zh" ? "处理中..." : "Processing...";
  const voiceTitleText = language === "zh" ? "选择声音" : "Select Voice";
  const speedText = language === "zh" ? "速度" : "Speed";
  const pitchText = language === "zh" ? "音高" : "Pitch";
  const downloadText = language === "zh" ? "下载音频" : "Download Audio";
  const characterCountText = language === "zh" ? "字符数" : "Character Count";

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl w-full mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{subTitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="relative">
              <Textarea 
                value={text}
                onChange={handleTextChange}
                placeholder={textPlaceholder}
                className="min-h-[200px] resize-y p-4"
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {characterCountText}: {text.length}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={generateSpeech}
                disabled={text.trim() === "" || isGenerating}
                className="w-full"
              >
                {isGenerating ? processingText : generateButtonText}
              </Button>
            </div>

            {generatedAudioUrl && (
              <motion.div 
                className="bg-card p-4 rounded-lg border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-12 h-12 text-primary"
                      onClick={togglePlayback}
                    >
                      <PlayCircle size={32} />
                    </Button>
                    <div className="ml-2">
                      <h3 className="font-medium">
                        {voices.find(v => v.id === selectedVoice)?.name || "Audio"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon">
                    <Download size={18} />
                    <span className="sr-only">{downloadText}</span>
                  </Button>
                </div>
                
                <div className="w-full h-16 bg-muted rounded flex items-center justify-center">
                  <Volume2 className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground ml-2">
                    {isPlaying ? "播放中..." : "音频已生成"}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">{voiceTitleText}</h3>
              <Select 
                value={selectedVoice} 
                onValueChange={setSelectedVoice}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map(voice => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{voice.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({voice.language})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm">{speedText}</label>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {speed[0].toFixed(1)}x
                </span>
              </div>
              <Slider
                value={speed}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={setSpeed}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm">{pitchText}</label>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {pitch[0].toFixed(1)}
                </span>
              </div>
              <Slider
                value={pitch}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={setPitch}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                <Settings size={16} className="mr-2" />
                <span>高级设置</span>
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                <Wand2 size={16} className="mr-2" />
                <span>AI优化</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}