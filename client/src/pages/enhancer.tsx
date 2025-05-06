import { motion } from "framer-motion";
import { ArrowRight, Upload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";

export default function Enhancer() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const title = language === "zh" ? "增强器" : "Enhancer";
  const description = language === "zh" 
    ? "将照片和生成图像放大至22倍。增加清晰度、深度细节和新细节。"
    : "Upscale photos and generations up to 22X. Add sharpness, depth details, and new details.";
  const uploadImageLabel = language === "zh" ? "上传图像" : "Upload Image";
  const selectAssetLabel = language === "zh" ? "选择资源" : "Select Asset";
  const supportText = language === "zh" 
    ? "上传任何图像，使用我们强大的AI模型增强它。支持格式：JPG、PNG、WEBP。"
    : "Upload any image to enhance it with our powerful AI models. Supported formats: JPG, PNG, WEBP.";

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[70vh]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 bg-muted rounded-xl p-6 inline-block">
          <ArrowRight className="h-12 w-12 text-foreground/70 transform rotate-45" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {description}
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <Button
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center"
          size="lg"
        >
          <Upload className="h-5 w-5 mr-2" />
          {uploadImageLabel}
        </Button>
        
        <Button
          variant="outline"
          className="w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          size="lg"
        >
          <FolderOpen className="h-5 w-5 mr-2" />
          {selectAssetLabel}
        </Button>
      </div>

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
