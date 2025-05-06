import { useState } from "react";
import Carousel from "@/components/carousel";
import GenerateSection from "@/components/generate-section";
import GallerySection from "@/components/gallery-section";

export default function Home() {
  const [carouselItems] = useState([
    {
      id: "enhance-models",
      title: "New Enhance Models",
      description: "Try out Krea's new powerful generative enhancer, upscale to 22k resolution with Topaz, or save credits with super fast models.",
      buttonText: "Upscale & Enhance",
      buttonLink: "/enhancer",
      imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      tag: "New model"
    },
    {
      id: "visual-compositing",
      title: "Visual Compositing with ChatGPT Paint",
      description: "Build images with our new visual canvas & let ChatGPT interpret your sketches, annotations, and collages.",
      buttonText: "Try ChatGPT Paint",
      buttonLink: "/image?gpt=1?new=true",
      imageUrl: "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      tag: "New feature"
    },
    {
      id: "chatgpt-krea",
      title: "ChatGPT x Krea",
      description: "The most powerful image generator ever. Try now in Krea Image, Krea Chat, and Krea Stage.",
      buttonText: "Generate with ChatGPT",
      buttonLink: "/image?gpt=1",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      tag: "New model"
    },
    {
      id: "video-restyle",
      title: "New: Video Restyle",
      description: "Change the style of any video. Turn videos of your friends into 3D animations, clone dances, craft totally new video styles.",
      buttonText: "Restyle Videos",
      buttonLink: "/video-restyle",
      imageUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      tag: "New tool"
    },
    {
      id: "3d-objects",
      title: "Introducing 3D Objects",
      description: "Generate 3D objects in seconds from text or images. Turn photos or generated assets into textured 3D meshes.",
      buttonText: "Generate 3D",
      buttonLink: "/3d",
      imageUrl: "https://images.unsplash.com/photo-1638959383788-58f5d2afbd4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      tag: "New Tool"
    }
  ]);

  const [galleryItems] = useState([
    {
      id: "hulk-cat",
      title: "Hulk Cat Roars",
      image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
      link: "/feed/01968f5c-c249-7333-aeb6-80aa9517913f"
    },
    {
      id: "wizard-tower",
      title: "Wizard Tower Interior",
      image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
      authorName: "plouz",
      link: "/feed/0196931d-a68c-7993-b952-d5551f73745f"
    },
    {
      id: "skull-man",
      title: "Skull Man",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
      authorName: "frowenz",
      link: "/feed/01968975-522a-7449-b20d-d750307bd5fd"
    },
    {
      id: "heart-viz",
      title: "Heart Growing Larger",
      image: "https://pixabay.com/get/g8a69788e4f2c6371ef94e8622c61f3cdf10d531bb496d80fc3fefb15add9c49497089a811239a89365e73fb84cb76e7f38819dc18455e0c334a141dd05115861_1280.jpg",
      link: "/feed/01966d1b-0627-7117-bb34-2134a4a837b3"
    },
    {
      id: "emotional-dance",
      title: "Character's Emotional Dance Transitions",
      image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
      authorName: "plouz",
      link: "/feed/019670ea-80d0-7000-a777-af168e6ada19"
    },
    {
      id: "quiff-hair",
      title: "Man with Quiff Hair",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
      link: "/feed/01965bb1-741a-7eeb-a493-b145d9f6afa3"
    }
  ]);

  return (
    <section>
      <Carousel items={carouselItems} />
      <GenerateSection />
      <GallerySection items={galleryItems} />
    </section>
  );
}
