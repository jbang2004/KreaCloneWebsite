import { useState } from "react";
import { motion } from "framer-motion";
import { 
  PlayIcon, 
  SpeakerWaveIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import SpeechAnimation from "@/components/animations/SpeechAnimation";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: string;
  avatar?: string;
}

export default function TextToSpeech() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [text, setText] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number[]>([1]);
  const [pitch, setPitch] = useState<number[]>([1]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);

  // 示例的语音列表
  const voices: Voice[] = [
    { id: "voice1", name: "王小明", language: "zh-CN", gender: "male", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Felix&eyesColor=0a0a0a" },
    { id: "voice2", name: "李小花", language: "zh-CN", gender: "female", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Lilly&eyesColor=0a0a0a" },
    { id: "voice3", name: "John", language: "en-US", gender: "male", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=John&eyesColor=0a0a0a" },
    { id: "voice4", name: "Sarah", language: "en-US", gender: "female", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Sarah&eyesColor=0a0a0a" },
    { id: "voice5", name: "智能女声", language: "zh-CN", gender: "female", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=AI1&eyesColor=0a0a0a" },
    { id: "voice6", name: "智能男声", language: "zh-CN", gender: "male", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=AI2&eyesColor=0a0a0a" },
    { id: "voice7", name: "田中", language: "ja-JP", gender: "male", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Tanaka&eyesColor=0a0a0a" },
    { id: "voice8", name: "さくら", language: "ja-JP", gender: "female", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Sakura&eyesColor=0a0a0a" },
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // 如果有生成的音频，当文本改变时重置
    if (generatedAudioUrl) {
      setGeneratedAudioUrl(null);
      setIsPlaying(false);
    }
  };

  const selectVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
  };

  const generateSpeech = () => {
    if (text.trim() === "" || !selectedVoice) return;
    
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
  const maleCategoryText = language === "zh" ? "男声" : "Male";
  const femaleCategoryText = language === "zh" ? "女声" : "Female";
  const aiCategoryText = language === "zh" ? "AI声音" : "AI Voices";
  const downloadText = language === "zh" ? "下载音频" : "Download Audio";
  const characterCountText = language === "zh" ? "字符数" : "Character Count";
  const selectVoiceText = language === "zh" ? "请选择一个语音" : "Please select a voice";

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8 relative">
        <div className="mx-auto mb-4 bg-muted rounded-xl p-4 inline-block relative overflow-hidden h-[160px] w-[160px]">
          <SpeechAnimation isActive={true} intensity="medium" />
          <div className="absolute inset-0 flex items-center justify-center">
            <SpeakerWaveIcon className="h-12 w-12 text-primary z-10" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {subTitle}
        </p>
      </div>

      <div className="max-w-3xl w-full mx-auto px-4">
        <div className="w-full bg-muted p-6 rounded-xl mb-8">
          <Textarea 
            value={text}
            onChange={handleTextChange}
            placeholder={textPlaceholder}
            className="w-full p-4 h-28 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          
          <div className="flex justify-between mt-4 items-center">
            <div className="text-xs text-muted-foreground">
              {characterCountText}: {text.length}
            </div>
            
            <Button 
              onClick={generateSpeech}
              disabled={text.trim() === "" || isGenerating || !selectedVoice}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isGenerating ? processingText : generateButtonText}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{language === "zh" ? "选择声音" : "Select Voice"}</h3>
          
          {/* 分类：男声 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">{maleCategoryText}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {voices.filter(voice => voice.gender === "male").map(voice => (
                <TooltipProvider key={voice.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`cursor-pointer rounded-lg p-2 text-center transition-all ${
                          selectedVoice === voice.id 
                            ? "bg-primary/10 ring-2 ring-primary" 
                            : "bg-card hover:bg-muted"
                        }`}
                        onClick={() => selectVoice(voice.id)}
                      >
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-background">
                          {voice.avatar ? (
                            <img src={voice.avatar} alt={voice.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-full h-full p-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">{voice.name}</p>
                        <p className="text-xs text-muted-foreground">{voice.language}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{voice.name} - {voice.language}</p>
                      <p className="text-xs text-muted-foreground">{language === "zh" ? "点击选择" : "Click to select"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
          
          {/* 分类：女声 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">{femaleCategoryText}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {voices.filter(voice => voice.gender === "female").map(voice => (
                <TooltipProvider key={voice.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`cursor-pointer rounded-lg p-2 text-center transition-all ${
                          selectedVoice === voice.id 
                            ? "bg-primary/10 ring-2 ring-primary" 
                            : "bg-card hover:bg-muted"
                        }`}
                        onClick={() => selectVoice(voice.id)}
                      >
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-background">
                          {voice.avatar ? (
                            <img src={voice.avatar} alt={voice.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-full h-full p-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">{voice.name}</p>
                        <p className="text-xs text-muted-foreground">{voice.language}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{voice.name} - {voice.language}</p>
                      <p className="text-xs text-muted-foreground">{language === "zh" ? "点击选择" : "Click to select"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>

        {generatedAudioUrl && (
          <motion.div 
            className="bg-card p-4 rounded-lg border border-border mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-12 h-12 text-primary"
                  onClick={togglePlayback}
                >
                  <PlayIcon className="h-8 w-8" />
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
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span className="sr-only">{downloadText}</span>
              </Button>
            </div>
            
            <div className="w-full h-16 bg-muted rounded flex items-center justify-center">
              <SpeakerWaveIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground ml-2">
                {isPlaying 
                  ? (language === "zh" ? "播放中..." : "Playing...") 
                  : (language === "zh" ? "音频已生成" : "Audio generated")}
              </span>
            </div>
          </motion.div>
        )}

        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-sm font-medium mb-3">{language === "zh" ? "语音设置" : "Voice Settings"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm">{language === "zh" ? "速度" : "Speed"}</label>
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
                <label className="text-sm">{language === "zh" ? "音高" : "Pitch"}</label>
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}