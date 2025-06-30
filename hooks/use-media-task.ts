import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { MediaTask, Transcription, TranscriptionSegment } from '@/db/schema-media';

export interface MediaTaskWithTranscription extends MediaTask {
  transcription?: Transcription & {
    segments: TranscriptionSegment[];
  };
}

interface MediaTaskState {
  task: MediaTaskWithTranscription | null;
  isCreating: boolean;
  isProcessing: boolean;
  error: Error | null;
  progress: number;
}

interface MediaTaskActions {
  createTask: (file: File, options?: { targetLanguage?: string; style?: string }) => Promise<void>;
  resetTask: () => void;
}

export function useMediaTask(): MediaTaskState & MediaTaskActions {
  const { user } = useAuth();
  const [task, setTask] = useState<MediaTaskWithTranscription | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // 清理 EventSource
  const cleanupEventSource = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  }, [eventSource]);

  // 重置任务状态
  const resetTask = useCallback(() => {
    cleanupEventSource();
    setTask(null);
    setIsCreating(false);
    setIsProcessing(false);
    setError(null);
    setProgress(0);
  }, [cleanupEventSource]);

  // 开始 SSE 监听
  const startStatusMonitoring = useCallback((taskId: string) => {
    if (!user) return;

    const es = new EventSource(`/api/workflow/${taskId}/status`, {
      // 设置 Accept 头部以获取 SSE 流
    });

    es.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        
        if (update.error) {
          setError(new Error(update.error));
          setIsProcessing(false);
          es.close();
          return;
        }

        setTask(update);
        setProgress(update.progress || 0);

        // 根据状态更新处理状态
        if (update.status === 'completed') {
          setIsProcessing(false);
          setProgress(100);
          es.close();
        } else if (update.status === 'failed') {
          setError(new Error(update.error || 'Task failed'));
          setIsProcessing(false);
          es.close();
        } else if (update.status === 'separating' || update.status === 'transcribing') {
          setIsProcessing(true);
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    es.onerror = (err) => {
      console.error('EventSource error:', err);
      setError(new Error('Connection error'));
      setIsProcessing(false);
      es.close();
    };

    setEventSource(es);
  }, [user]);

  // 上传文件到 R2
  const uploadFile = async (file: File, uploadUrl: string): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  };

  // 创建任务
  const createTask = useCallback(async (
    file: File,
    options: { targetLanguage?: string; style?: string } = {}
  ) => {
    if (!user) {
      setError(new Error('User not authenticated'));
      return;
    }

    resetTask();
    setIsCreating(true);

    try {
      // 1. 创建任务并获取上传 URL
      const createResponse = await fetch('/api/workflow/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to create task');
      }

      const result = await createResponse.json() as { taskId: string; uploadUrl: string };
      const { taskId, uploadUrl } = result;

      // 2. 上传文件
      setProgress(10);
      await uploadFile(file, uploadUrl);
      setProgress(30);

      // 3. 触发处理
      const processResponse = await fetch(`/api/workflow/${taskId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage: options.targetLanguage || 'chinese',
          style: options.style || 'normal',
        }),
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to start processing');
      }

      setProgress(50);
      setIsCreating(false);
      setIsProcessing(true);

      // 4. 开始状态监听
      startStatusMonitoring(taskId);

    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsCreating(false);
      setIsProcessing(false);
    }
  }, [user, resetTask, startStatusMonitoring]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupEventSource();
    };
  }, [cleanupEventSource]);

  return {
    task,
    isCreating,
    isProcessing,
    error,
    progress,
    createTask,
    resetTask,
  };
}