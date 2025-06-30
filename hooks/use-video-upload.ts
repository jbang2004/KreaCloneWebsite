import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface VideoUploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  isProcessing: boolean;
  processingComplete: boolean;
  videoPreviewUrl: string | null;
  uploadError: Error | null;
  processingError: Error | null;
  taskId: string | null;
}

interface VideoUploadActions {
  initiateUpload: (fileToUpload: File, options?: { targetLanguage?: string; style?: string }) => Promise<void>;
  resetUploadState: () => void;
}

interface UploadPart {
  partNumber: number;
  etag: string;
}

// ---------------- 分块上传配置 -----------------
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk (S3 minimum)
const MAX_CONCURRENT_UPLOADS = 3; // 并发上传数量
const RETRY_ATTEMPTS = 3; // 重试次数

// R2 存储配置
const R2_CUSTOM_DOMAIN = process.env.NEXT_PUBLIC_R2_CUSTOM_DOMAIN as string;

// 分块上传 API 路径
const MULTIPART_API_PATH = '/api/r2-presigned-url';

export function useVideoUpload(): VideoUploadState & VideoUploadActions {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingComplete, setProcessingComplete] = useState<boolean>(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [processingError, setProcessingError] = useState<Error | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // 清理 EventSource
  const cleanupEventSource = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  }, [eventSource]);

  const resetUploadState = useCallback(() => {
    cleanupEventSource();
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    setIsProcessing(false);
    setProcessingComplete(false);
    setVideoPreviewUrl(null);
    setUploadError(null);
    setProcessingError(null);
    setTaskId(null);
  }, [cleanupEventSource]);

  // 开始 SSE 监听
  const startStatusMonitoring = useCallback((taskId: string) => {
    if (!user) return;

    const es = new EventSource(`/api/workflow/${taskId}/status`);

    es.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        
        if (update.error) {
          setProcessingError(new Error(update.error));
          setIsProcessing(false);
          es.close();
          return;
        }

        // 根据状态更新处理状态
        if (update.status === 'completed') {
          setIsProcessing(false);
          setProcessingComplete(true);
          
          // 设置视频预览URL
          if (update.videoUrl) {
            setVideoPreviewUrl(update.videoUrl);
          }
          
          es.close();
        } else if (update.status === 'failed') {
          setProcessingError(new Error(update.error || 'Task failed'));
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
      setProcessingError(new Error('Connection error'));
      setIsProcessing(false);
      es.close();
    };

    setEventSource(es);
  }, [user]);

  // 上传单个分块
  const uploadChunk = async (
    chunk: Blob,
    partNumber: number,
    uploadId: string,
    objectName: string,
    retryCount = 0
  ): Promise<UploadPart> => {
    try {
      // 获取分块上传URL
      const urlResponse = await fetch(MULTIPART_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getPartUrl',
          objectName,
          uploadId,
          partNumber
        }),
      });

      if (!urlResponse.ok) {
        throw new Error(`获取分块上传URL失败: ${urlResponse.statusText}`);
      }

      const { partUrl } = await urlResponse.json() as any;

      // 上传分块
      const uploadResponse = await fetch(partUrl, {
        method: 'PUT',
        body: chunk,
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(`分块上传失败: ${uploadResponse.statusText}`);
      }

      const etag = uploadResponse.headers.get('ETag');
      if (!etag) {
        throw new Error('上传响应中缺少ETag');
      }

      return {
        partNumber,
        etag: etag.replace(/^"(.+)"$/, '$1') // 移除首尾引号
      };
    } catch (error) {
      if (retryCount < RETRY_ATTEMPTS) {
        console.warn(`分块 ${partNumber} 上传失败，正在重试 ${retryCount + 1}/${RETRY_ATTEMPTS}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount))); // 指数退避
        return uploadChunk(chunk, partNumber, uploadId, objectName, retryCount + 1);
      }
      throw error;
    }
  };

  // 分块上传管理器
  const uploadFileInChunks = async (
    file: File,
    objectName: string,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    let uploadId = '';

    try {
      // 1. 初始化分块上传
      const initiateResponse = await fetch(MULTIPART_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initiate',
          objectName
        }),
      });

      if (!initiateResponse.ok) {
        throw new Error('初始化分块上传失败');
      }

      const { uploadId: newUploadId } = await initiateResponse.json() as any;
      uploadId = newUploadId;

      // 2. 分割文件为块
      const chunks: Blob[] = [];
      for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        chunks.push(file.slice(start, end));
      }

      // 3. 并发上传分块
      const uploadedParts: UploadPart[] = new Array(chunks.length);
      let completedChunks = 0;

      // 使用 Promise 控制并发
      const uploadChunkWithIndex = async (chunkIndex: number) => {
        const chunk = chunks[chunkIndex];
        const partNumber = chunkIndex + 1;

        try {
          const uploadedPart = await uploadChunk(chunk, partNumber, uploadId, objectName);
          uploadedParts[chunkIndex] = uploadedPart;
          completedChunks++;
          
          // 更新进度
          const progress = Math.round((completedChunks / chunks.length) * 100);
          onProgress(progress);
        } catch (error) {
          console.error(`分块 ${partNumber} 上传失败:`, error);
          throw error;
        }
      };

      // 分批并发上传
      for (let i = 0; i < chunks.length; i += MAX_CONCURRENT_UPLOADS) {
        const batch = [];
        for (let j = i; j < Math.min(i + MAX_CONCURRENT_UPLOADS, chunks.length); j++) {
          batch.push(uploadChunkWithIndex(j));
        }
        await Promise.all(batch);
      }

      // 4. 完成分块上传
      const completeResponse = await fetch(MULTIPART_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          objectName,
          uploadId,
          parts: uploadedParts.sort((a, b) => a.partNumber - b.partNumber)
        }),
      });

      if (!completeResponse.ok) {
        throw new Error('完成分块上传失败');
      }

    } catch (error) {
      // 上传失败时中止分块上传
      if (uploadId) {
        try {
          await fetch(MULTIPART_API_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'abort',
              objectName,
              uploadId
            }),
          });
        } catch (abortError) {
          console.error('中止分块上传失败:', abortError);
        }
      }
      throw error;
    }
  };

  const initiateUpload = async (
    fileToUpload: File,
    options: { targetLanguage?: string; style?: string } = {}
  ) => {
    if (!user?.id) {
      setUploadError(new Error('User not authenticated'));
      return;
    }

    resetUploadState();
    setIsUploading(true);

    try {
      // 1. 创建任务并获取上传信息（使用新的workflow API）
      const createResponse = await fetch('/api/workflow/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileToUpload.name,
          fileSize: fileToUpload.size,
          mimeType: fileToUpload.type,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to create task');
      }

      const result = await createResponse.json() as { taskId: string; uploadUrl: string; objectName: string };
      const { taskId, uploadUrl, objectName } = result;
      setTaskId(taskId);

      // 2. 使用现有的分块上传逻辑到R2
      await uploadFileInChunks(fileToUpload, objectName, setUploadProgress);

      // 3. 生成公开 URL
      const publicUrl = `${R2_CUSTOM_DOMAIN}/${objectName}`;
      setVideoPreviewUrl(publicUrl);

      // 4. 上传完成，进入处理阶段
      setIsUploading(false);
      setUploadComplete(true);
      setIsProcessing(true);
      setProcessingError(null);

      // 5. 触发工作流处理（使用新的workflow API）
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

      // 6. 开始SSE实时状态监听（替代轮询）
      startStatusMonitoring(taskId);

    } catch (err: any) {
      console.error('上传或处理失败:', err);
      setUploadError(err instanceof Error ? err : new Error(String(err)));
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadComplete,
    isProcessing,
    processingComplete,
    videoPreviewUrl,
    uploadError,
    processingError,
    taskId,
    initiateUpload,
    resetUploadState,
  };
} 