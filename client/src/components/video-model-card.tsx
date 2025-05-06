import { cn } from "@/lib/utils";

interface VideoModelCardProps {
  name: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  features?: string[];
  isExpensiveModel?: boolean;
  bgColor?: string;
  textColor?: string;
}

export default function VideoModelCard({
  name,
  description,
  duration,
  icon,
  features = [],
  isExpensiveModel = false,
  bgColor = "bg-blue-100",
  textColor = "text-blue-500"
}: VideoModelCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-2">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mr-2",
          bgColor
        )}>
          <div className={cn("h-5 w-5", textColor)}>
            {icon}
          </div>
        </div>
        <h4 className="font-medium">{name}</h4>
      </div>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <div className="flex flex-wrap gap-1">
        <div className="text-xs text-gray-400">{duration}</div>
        
        {features.map((feature, index) => (
          <div key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {feature}
          </div>
        ))}
        
        {isExpensiveModel && (
          <div className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded">
            Expensive model
          </div>
        )}
      </div>
    </div>
  );
}
