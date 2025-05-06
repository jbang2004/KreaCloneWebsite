import { useState } from "react";
import { motion } from "framer-motion";
import { Folder, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import VideoModelCard from "@/components/video-model-card";

export default function Video() {
  const [prompt, setPrompt] = useState("");

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    // Handle video generation
    console.log("Generating video with prompt:", prompt);
  };

  const videoModels = [
    {
      name: "Wan 2.1",
      description: "New fast model with live previews",
      duration: "1 min.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      ),
      features: ["Start frame"],
      bgColor: "bg-amber-100",
      textColor: "text-amber-500"
    },
    {
      name: "Hunyuan",
      description: "Fast and high-quality model",
      duration: "1 min.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-500"
    },
    {
      name: "Kling 2.0",
      description: "New frontier model",
      duration: "5 min.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      ),
      features: ["Start frame"],
      isExpensiveModel: true,
      bgColor: "bg-purple-100",
      textColor: "text-purple-500"
    }
  ];

  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl bg-gray-100 p-6 rounded-xl">
        <Textarea 
          placeholder="Describe a video and click generate..." 
          className="w-full p-4 h-24 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          value={prompt}
          onChange={handlePromptChange}
        />
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md flex items-center text-sm hover:bg-gray-300 transition-colors"
          >
            <Folder className="h-4 w-4 mr-1" />
            Start frame
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md flex items-center text-sm hover:bg-gray-300 transition-colors"
          >
            <Folder className="h-4 w-4 mr-1" />
            End frame
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md flex items-center text-sm hover:bg-gray-300 transition-colors"
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Style
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
          >
            720p
          </Button>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </div>
      </div>
      
      <div className="w-full max-w-2xl mt-8">
        <h3 className="font-medium text-lg mb-4">Models</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videoModels.map((model, index) => (
            <VideoModelCard
              key={index}
              name={model.name}
              description={model.description}
              duration={model.duration}
              icon={model.icon}
              features={model.features}
              isExpensiveModel={model.isExpensiveModel}
              bgColor={model.bgColor}
              textColor={model.textColor}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
