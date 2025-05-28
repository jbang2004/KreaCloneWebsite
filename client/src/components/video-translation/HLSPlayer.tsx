import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export default function HLSPlayer({ 
  src, 
  className = "", 
  autoPlay = false, 
  controls = true, 
  muted = false 
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // 清理之前的HLS实例
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      // 使用hls.js - 使用默认配置，与HTML示例保持一致
      const hls = new Hls({
        // 使用默认配置，适合大多数HLS播放场景
        // 播放列表刷新配置 - 更频繁地检查播放列表更新
        manifestLoadingTimeOut: 10000, // 播放列表加载超时时间（毫秒）
        manifestLoadingMaxRetry: 3, // 播放列表加载最大重试次数
        manifestLoadingRetryDelay: 500, // 播放列表加载重试延迟（毫秒）
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed, ready to play');
        if (autoPlay) {
          video.play().catch(console.error);
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.log('Fatal error, destroying HLS instance');
              hls.destroy();
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // 原生支持HLS (Safari)
      video.src = src;
      if (autoPlay) {
        video.play().catch(console.error);
      }
    } else {
      console.error('HLS is not supported in this browser');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      controls={controls}
      muted={muted}
      playsInline
      style={{ width: '100%', height: '100%' }}
    >
      您的浏览器不支持视频播放。
    </video>
  );
} 