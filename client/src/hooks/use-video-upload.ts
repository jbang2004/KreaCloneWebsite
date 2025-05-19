import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';

interface VideoUploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  videoPreviewUrl: string | null;
  uploadError: Error | null;
}

interface VideoUploadActions {
  initiateUpload: (fileToUpload: File, user: User, token: string) => Promise<void>;
  resetUploadState: () => void;
}

// 从环境变量读取 Supabase 项目 ID
const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;

// 新增: 读取后端地址、端口号及存储桶名称，构建常量
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT as string;
const API_BASE_URL = BACKEND_PORT ? `${BACKEND_URL}:${BACKEND_PORT}` : BACKEND_URL;
// 新增: 从环境变量读取 Supabase 存储桶名称，默认为 'videos'
const SUPABASE_BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET_NAME ?? 'videos';

export function useVideoUpload(): VideoUploadState & VideoUploadActions {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const resetUploadState = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    setVideoPreviewUrl(null);
    setUploadError(null);
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

        // 新增: 获取视频宽高
        const metadataUrl = URL.createObjectURL(fileToUpload);
        const tmpVideo = document.createElement('video');
        tmpVideo.preload = 'metadata';
        tmpVideo.src = metadataUrl;
        await new Promise<void>(resolve => (tmpVideo.onloadedmetadata = () => resolve()));
        const width = tmpVideo.videoWidth;
        const height = tmpVideo.videoHeight;
        URL.revokeObjectURL(metadataUrl);

        const videoDataToInsert = {
          user_id: user.id,
          file_name: fileToUpload.name,
          storage_path: finalObjectNameInBucket,
          bucket_name: bucketName,
          status: 'uploaded',
          video_width: width,
          video_height: height,
        };

        // 插入视频元数据到数据库，并返回生成的 video_id
        const { data: insertedData, error: dbError } = await supabase
          .from('videos')
          .insert([videoDataToInsert])
          .select('id');

        if (dbError) {
          console.error("数据库插入失败:", dbError);
          setUploadError(new Error(dbError.message));
          setIsUploading(false); // Keep URL for preview but flag DB error
          return;
        }

        // 新增: 通知后端开始处理视频，传递 video_id, storagePath 与存储桶信息
        const videoId = insertedData?.[0]?.id;
        if (videoId) {
          fetch(`${API_BASE_URL}/api/preprovideo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId: String(videoId) }),
          }).catch(err => console.error('Notify backend failed:', err));
        }

        setIsUploading(false);
        setUploadComplete(true);
      },
    });

    upload.start();
  };

  return {
    isUploading,
    uploadProgress,
    uploadComplete,
    videoPreviewUrl,
    uploadError,
    initiateUpload,
    resetUploadState,
  };
} 