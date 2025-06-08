export interface Subtitle {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
  translation: string;
  speaker?: string;
  isEditing?: boolean;
  isPanelClosed?: boolean; // This field was in the parent component's original interface, including it for completeness, can be refined if not used by all consumers.
}

// 音视频处理功能相关的类型定义
export interface AudioVideoFeature {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon: string;
  status: 'available' | 'coming-soon';
} 