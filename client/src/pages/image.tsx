import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, User, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Image() {
  const [prompt, setPrompt] = useState("");

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    // Handle image generation
    console.log("Generating image with prompt:", prompt);
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[70vh]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl bg-gray-100 p-6 rounded-xl">
        <Textarea 
          placeholder="Describe an image and click generate..." 
          className="w-full p-4 h-24 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          value={prompt}
          onChange={handlePromptChange}
        />
        
        <div className="flex justify-between mt-4">
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span className="sr-only">Upload image</span>
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Add person</span>
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <Wand2 className="h-5 w-5" />
              <span className="sr-only">Apply style</span>
            </Button>
          </div>
          
          <Button 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
