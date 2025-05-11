import React from 'react';

interface GlassmorphicIconProps {
  icon: 'home' | 'microphone' | 'speech' | 'video' | 'sun' | 'moon' | 'globe';
  className?: string;
  size?: number;
}

export default function GlassmorphicIcon({ 
  icon, 
  className = '', 
  size = 24 
}: GlassmorphicIconProps) {
  const iconPath = `/icons/${icon}-glass.svg`;
  
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src={iconPath} 
        alt={`${icon} icon`} 
        width={size} 
        height={size} 
        className="w-full h-full" 
      />
    </div>
  );
}