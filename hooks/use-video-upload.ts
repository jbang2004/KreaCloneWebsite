import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';

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
  initiateUpload: (fileToUpload: File, user: User, token: string) => Promise<void>;
  resetUploadState: () => void;
}

// 从环境变量读取 Supabase 项目 ID
const SUPABASE_PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID as string;

// 新增: 读取后端地址、端口号及存储桶名称，构建常量
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT as string;
const API_BASE_URL = BACKEND_PORT ? `${BACKEND_URL}:${BACKEND_PORT}` : BACKEND_URL;
// 新增: 从环境变量读取 Supabase 存储桶名称，默认为 'videos'
const SUPABASE_BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME ?? 'videos';

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

  const initiateUpload = async (fileToUpload: File, user: User, token: string) => {
    resetUploadState();
    setIsUploading(true);

    const fileExt = fileToUpload.name.split('.').pop();
    const objectName = `${user.id}_${Date.now()}.${fileExt}`;
    const bucketName = SUPABASE_BUCKET_NAME;
    const tusEndpoint = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/upload/resumable`;

    const upload = new tus.Upload(fileToUpload, {
      endpoint: tusEndpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${token}`,
        'x-upsert': 'true',
      },
      metadata: {
        bucketName: bucketName,
        objectName: objectName,
        contentType: fileToUpload.type,
        cacheControl: '3600',
      },
      chunkSize: 6 * 1024 * 1024,
      onError: (error) => {
        console.error("TUS Upload Failed:", error);
        setUploadError(error);
        setIsUploading(false);
        setUploadProgress(0);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
        setUploadProgress(percentage);
      },
      onSuccess: async () => {
        console.log("TUS Upload Succeeded for:", fileToUpload.name, upload.url);
        const finalObjectNameInBucket = objectName;

        // 获取视频公开 URL
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(finalObjectNameInBucket);
        if (!publicUrlData || !publicUrlData.publicUrl) {
          const err = new Error("无法获取视频的公开URL。");
          console.error(err);
          setUploadError(err);
          setIsUploading(false);
          return;
        }
        setVideoPreviewUrl(publicUrlData.publicUrl);

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
          storage_path: finalObjectNameInBucket,
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
              // 只截取返回 JSON 的 detail 字段
              let errMsg = text;
              try {
                const errJson = JSON.parse(text);
                if (errJson.detail) {
                  errMsg = errJson.detail;
                }
              } catch {
                // 非 JSON 格式时保留原文本
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
      },
    });

    upload.start();
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