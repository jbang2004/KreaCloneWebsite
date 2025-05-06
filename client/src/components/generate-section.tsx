import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface GenerateCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  isNew?: boolean;
}

function GenerateCard({ title, description, icon, link, isNew }: GenerateCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{description}</p>
          {isNew && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Link 
          href={link}
          className="bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 text-sm font-medium transition-colors"
        >
          Open
        </Link>
      </div>
    </div>
  );
}

export default function GenerateSection() {
  const cards = [
    {
      title: "Image",
      description: "Generate images with custom styles in Flux and Ideogram.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: "/image",
      isNew: true,
      bgColor: "bg-blue-100",
      textColor: "text-blue-500"
    },
    {
      title: "Video",
      description: "Generate videos with Hailuo, Pika, Runway, Luma, and more.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      link: "/video",
      bgColor: "bg-amber-100",
      textColor: "text-amber-500"
    },
    {
      title: "Realtime",
      description: "Realtime AI rendering on a canvas. Instant feedback loops.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      link: "/realtime",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-500"
    },
    {
      title: "Enhancer",
      description: "Upscale and enhance real and generated images up to 4K.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      link: "/enhancer",
      isNew: true,
      bgColor: "bg-purple-100",
      textColor: "text-purple-500"
    }
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Generate</h2>
        <Link 
          href="/tools" 
          className="text-sm text-blue-500 flex items-center"
        >
          Show all
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <GenerateCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            link={card.link}
            isNew={card.isNew}
          />
        ))}
      </div>
    </div>
  );
}
