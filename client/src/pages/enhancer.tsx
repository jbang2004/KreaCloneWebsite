import { motion } from "framer-motion";
import { ArrowRight, Upload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Enhancer() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[70vh]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 bg-gray-100 rounded-xl p-6 inline-block">
          <ArrowRight className="h-12 w-12 text-gray-600 transform rotate-45" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Enhancer</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Upscale photos and generations up to 22X. Add sharpness, depth details, and new details.
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <Button
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
          size="lg"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Image
        </Button>
        
        <Button
          variant="outline"
          className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
          size="lg"
        >
          <FolderOpen className="h-5 w-5 mr-2" />
          Select Asset
        </Button>
      </div>

      <motion.div 
        className="mt-12 text-center text-gray-500 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-sm">
          Upload any image to enhance it with our powerful AI models.
          Supported formats: JPG, PNG, WEBP.
        </p>
      </motion.div>
    </motion.div>
  );
}
