'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestMultipartPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testMultipartUpload = async () => {
    if (!file) {
      setError('请选择文件');
      return;
    }

    setIsUploading(true);
    setError('');
    setProgress(0);

    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    const objectName = `test-${Date.now()}-${file.name}`;

    try {
      // 1. 初始化分块上传
      setStatus('初始化分块上传...');
      const initiateResponse = await fetch('/api/r2-presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initiate',
          objectName,
          contentType: file.type
        }),
      });

      if (!initiateResponse.ok) {
        throw new Error('初始化分块上传失败');
      }

      const { uploadId } = await initiateResponse.json();
      setStatus(`获取到 uploadId: ${uploadId}`);

      // 2. 分割文件
      const chunks: Blob[] = [];
      for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        chunks.push(file.slice(start, end));
      }
      setStatus(`文件分割为 ${chunks.length} 个分块`);

      // 3. 上传每个分块
      const uploadedParts: Array<{ partNumber: number; etag: string }> = [];
      
      for (let i = 0; i < chunks.length; i++) {
        const partNumber = i + 1;
        setStatus(`上传分块 ${partNumber}/${chunks.length}...`);

        // 获取分块上传URL
        const urlResponse = await fetch('/api/r2-presigned-url', {
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
          throw new Error(`获取分块 ${partNumber} 上传URL失败`);
        }

        const { partUrl } = await urlResponse.json();

        // 上传分块
        const uploadResponse = await fetch(partUrl, {
          method: 'PUT',
          body: chunks[i],
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });

        if (!uploadResponse.ok) {
          throw new Error(`分块 ${partNumber} 上传失败`);
        }

        const etag = uploadResponse.headers.get('ETag');
        if (!etag) {
          throw new Error(`分块 ${partNumber} 缺少ETag`);
        }

        uploadedParts.push({
          partNumber,
          etag: etag.replace(/^"(.+)"$/, '$1')
        });

        // 更新进度
        const progressValue = Math.round(((i + 1) / chunks.length) * 100);
        setProgress(progressValue);
      }

      // 4. 完成分块上传
      setStatus('完成分块上传...');
      const completeResponse = await fetch('/api/r2-presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          objectName,
          uploadId,
          parts: uploadedParts
        }),
      });

      if (!completeResponse.ok) {
        throw new Error('完成分块上传失败');
      }

      setStatus(`✅ 上传成功！文件: ${objectName}`);
      setProgress(100);

    } catch (err: any) {
      console.error('分块上传失败:', err);
      setError(err.message);
      setStatus('❌ 上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>分块上传测试</CardTitle>
          <CardDescription>
            测试 AWS S3 API 兼容的分块上传功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              选择文件
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                文件大小: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          <Button 
            onClick={testMultipartUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? '上传中...' : '开始分块上传'}
          </Button>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center">{progress}%</p>
            </div>
          )}

          {status && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">{status}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 