import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

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
  initiateUpload: (fileToUpload: File, user: User) => Promise<void>;
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

// 后端 API 地址（视频预处理服务）
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT as string;
const API_BASE_URL = BACKEND_PORT ? `${BACKEND_URL}:${BACKEND_PORT}` : BACKEND_URL;

// R2 存储配置
const R2_BUCKET_NAME = process.env.NEXT_PUBLIC_R2_BUCKET_NAME ?? 'videos';
const R2_CUSTOM_DOMAIN = process.env.NEXT_PUBLIC_R2_CUSTOM_DOMAIN as string;

// 分块上传 API 路径
const MULTIPART_API_PATH = '/api/r2-presigned-url';

export function useVideoUpload(): VideoUploadState & VideoUploadActions {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingComplete, setProcessingComplete] = useState<boolean>(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [processingError, setProcessingError] = useState<Error | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const supabase = createClient();

  const resetUploadState = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    setIsProcessing(false);
    setProcessingComplete(false);
    setVideoPreviewUrl(null);
    setUploadError(null);
    setProcessingError(null);
    setTaskId(null);
  };

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

      const { partUrl } = await urlResponse.json();

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

      const { uploadId: newUploadId } = await initiateResponse.json();
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

  const initiateUpload = async (fileToUpload: File, user: User) => {
    resetUploadState();
    setIsUploading(true);

    const fileExt = fileToUpload.name.split('.').pop();
    const objectName = `${user.id}_${Date.now()}.${fileExt}`;
    const bucketName = R2_BUCKET_NAME;

    try {
      // 使用分块上传
      await uploadFileInChunks(fileToUpload, objectName, setUploadProgress);

      // 生成公开 URL
      const publicUrl = `${R2_CUSTOM_DOMAIN}/${objectName}`;
      setVideoPreviewUrl(publicUrl);

      // 获取视频宽高
      const metadataUrl = URL.createObjectURL(fileToUpload);
      const tmpVideo = document.createElement('video');
      tmpVideo.preload = 'metadata';
      tmpVideo.src = metadataUrl;
      await new Promise<void>(resolve => (tmpVideo.onloadedmetadata = () => resolve()));
      const width = tmpVideo.videoWidth;
      const height = tmpVideo.videoHeight;
      URL.revokeObjectURL(metadataUrl);

      // 插入视频记录到数据库
      const videoDataToInsert = {
        user_id: user.id,
        file_name: fileToUpload.name,
        storage_path: objectName,
        bucket_name: bucketName,
        status: 'pending',
        video_width: width,
        video_height: height,
      };

      const { data: insertedData, error: dbError } = await supabase
        .from('videos')
        .insert([videoDataToInsert])
        .select('id');

      if (dbError) {
        console.error("数据库插入失败:", dbError);
        setUploadError(new Error(dbError.message));
        setIsUploading(false);
        return;
      }

      const videoId = insertedData?.[0]?.id;
      if (videoId) {
        // 上传完成，进入预处理阶段
        setIsUploading(false);
        setUploadComplete(true);
        setIsProcessing(true);
        setProcessingError(null);

        try {
          // 触发后端预处理，并获取任务 ID
          const res = await fetch(`${API_BASE_URL}/api/preprovideo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId: String(videoId) }),
          });

          if (!res.ok) {
            const text = await res.text();
            let errMsg = text;
            try {
              const errJson = JSON.parse(text);
              if (errJson.detail) {
                errMsg = errJson.detail;
              }
            } catch {
              // ignore
            }
            throw new Error(errMsg);
          }

          const respJson = await res.json();
          const newTaskId = respJson.task_id;
          setTaskId(newTaskId);

          // 轮询任务状态直到完成或发生错误
          let status = '';
          while (status !== 'preprocessed' && status !== 'error') {
            await new Promise(r => setTimeout(r, 3000));
            const { data: taskData, error: taskError } = await supabase
              .from('tasks')
              .select('status')
              .eq('task_id', newTaskId)
              .single();
            if (taskError) {
              console.error("轮询任务状态失败:", taskError);
              continue;
            }
            status = taskData.status;
          }

          if (status === 'preprocessed') {
            setProcessingComplete(true);
          } else if (status === 'error') {
            setProcessingError(new Error('TASK_ERROR'));
          }
        } catch (err: any) {
          console.error("触发预处理失败:", err);
          setProcessingError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      console.error('分块上传失败:', err);
      setUploadError(err instanceof Error ? err : new Error(String(err)));
      setIsUploading(false);
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