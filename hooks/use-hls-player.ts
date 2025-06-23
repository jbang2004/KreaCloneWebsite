import { useState, useEffect, useRef } from 'react';

interface HLSPlayerState {
  isGenerating: boolean;
  hlsPlaylistUrl: string | null;
  canPlay: boolean;
  generatingError: Error | null;
  isVideoCompleted: boolean;
}

interface HLSPlayerActions {
  startGenerating: (taskId: string) => Promise<void>;
  resetHLSState: () => void;
}

// 后端 API 配置
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT as string;
const API_BASE_URL = BACKEND_PORT ? `${BACKEND_URL}:${BACKEND_PORT}` : BACKEND_URL;

export function useHLSPlayer(): HLSPlayerState & HLSPlayerActions {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hlsPlaylistUrl, setHlsPlaylistUrl] = useState<string | null>(null);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [generatingError, setGeneratingError] = useState<Error | null>(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState<boolean>(false);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetHLSState = () => {
    setIsGenerating(false);
    setHlsPlaylistUrl(null);
    setCanPlay(false);
    setGeneratingError(null);
    setIsVideoCompleted(false);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const startGenerating = async (taskId: string) => {
    if (!taskId) {
      setGeneratingError(new Error('任务 ID 缺失，无法触发 TTS'));
      return;
    }

    setIsGenerating(true);
    setGeneratingError(null);
    setCanPlay(false);

    try {
      // 调用后端TTS接口
      const response = await fetch(`${API_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.detail || 'TTS 请求失败');
      }

      // 开始轮询任务状态，检查HLS播放列表是否可用
      pollIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/tasks/${taskId}/status`);
          if (!response.ok) {
            console.error("轮询任务状态失败:", response.statusText);
            return;
          }

          const taskData = await response.json() as any;

          // 检查是否有HLS播放列表URL
          if (taskData.hlsPlaylistUrl && !canPlay) {
            setHlsPlaylistUrl(taskData.hlsPlaylistUrl);
            setCanPlay(true);
            // 注意：这里不设置 isGenerating 为 false，保持生成中状态
          }

          // 检查任务是否完全完成
          if (taskData.status === 'completed') {
            setIsVideoCompleted(true);
            setIsGenerating(false);
            
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
          }

          // 检查是否出错
          if (taskData.status === 'error') {
            setGeneratingError(new Error('视频生成过程中出现错误'));
            setIsGenerating(false);
            
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
          }
        } catch (error) {
          console.error("轮询过程中出错:", error);
        }
      }, 2000); // 每2秒轮询一次

    } catch (error: any) {
      setGeneratingError(error instanceof Error ? error : new Error(String(error)));
      setIsGenerating(false);
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return {
    isGenerating,
    hlsPlaylistUrl,
    canPlay,
    generatingError,
    isVideoCompleted,
    startGenerating,
    resetHLSState,
  };
} 