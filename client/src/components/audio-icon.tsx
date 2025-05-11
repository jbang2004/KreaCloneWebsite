import React from 'react';

interface AudioIconProps {
  icon: 'upload' | 'folder' | 'microphone' | 'trash' | 'document' | 'music-note';
  className?: string;
  size?: number;
}

export default function AudioIcon({ 
  icon, 
  className = '', 
  size = 24 
}: AudioIconProps) {
  // 处理使用麦克风图标的特殊情况，因为它在公共图标中已经存在
  const iconPath = icon === 'microphone' 
    ? `/icons/microphone-glass.svg` 
    : `/icons/audio/${icon}-glass.svg`;
  
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