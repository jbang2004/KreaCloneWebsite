import { useLanguage } from "@/hooks/use-language";

// 仅保留音视频相关数据，清理不再需要的图像生成等内容
export function useAudioVideoFeaturesData() {
  const { language } = useLanguage();
  
  return [
    {
      id: "audio-transcription",
      title: language === "zh" ? "音频转录" : "Audio Transcription",
      description: language === "zh" 
        ? "将音频文件转换为精准的文字记录，支持多种语言和音频格式。" 
        : "Convert audio files to accurate text transcripts, supporting multiple languages and audio formats.",
      buttonText: language === "zh" ? "开始转录" : "Start Transcription",
      buttonLink: "/audio-transcription",
      icon: "mic",
      status: "coming-soon" // 即将推出
    },
    {
      id: "text-to-speech",
      title: language === "zh" ? "文本配音" : "Text to Speech",
      description: language === "zh" 
        ? "将文字转换为自然流畅的语音，提供多种音色和语言选择。" 
        : "Convert text to natural, fluent speech with various voice options and language support.",
      buttonText: language === "zh" ? "生成语音" : "Generate Speech",
      buttonLink: "/text-to-speech",
      icon: "volume",
      status: "coming-soon" // 即将推出
    },
    {
      id: "video-translation",
      title: language === "zh" ? "视频翻译" : "Video Translation",
      description: language === "zh" 
        ? "智能视频翻译和配音，保持原声特色和唇形同步。" 
        : "Intelligent video translation and dubbing with voice preservation and lip synchronization.",
      buttonText: language === "zh" ? "翻译视频" : "Translate Video",
      buttonLink: "/video-translation",
      icon: "languages",
      status: "available" // 已可用
    }
  ];
}