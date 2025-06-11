import { m as motion } from "@/lib/lazy-motion";
import {
  XMarkIcon,
  ClockIcon,
  PlayIcon,
  UserIcon,
  GlobeAltIcon
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { cn } from "@/lib/utils";
import { Subtitle } from "@/types";
import { Translations } from "@/lib/translations";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// 后端API配置
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT as string;
const API_BASE_URL = BACKEND_PORT ? `${BACKEND_URL}:${BACKEND_PORT}` : BACKEND_URL;

interface SubtitlesPanelProps {
  theme: string | undefined;
  subtitles: Subtitle[];
  editingSubtitleId: string | null;
  targetLanguage: string;
  translations: Translations;
  isMobile: boolean;
  isLoading: boolean;
  error: string | null;
  getLanguageLabel: (value: string) => string;
  jumpToTime: (timeString: string) => void;
  updateSubtitleTranslation: (id: string, newTranslation: string, sync?: boolean) => void | Promise<void>;
  toggleEditMode: (id: string) => void;
  setTargetLanguage: (language: string) => void;
  fetchSubtitles: (taskId: string, targetLang: string) => Promise<void>;
  closeSubtitlesPanel: () => void;
  subtitlesContainerRef: React.RefObject<HTMLDivElement>;
  currentTaskId: string;
  onTranslationStart: () => void;
  onTranslationComplete: () => void;
}

export default function SubtitlesPanel({
  theme,
  subtitles,
  editingSubtitleId,
  targetLanguage,
  translations: T,
  // isMobile,
  isLoading,
  error,
  // getLanguageLabel,
  jumpToTime,
  updateSubtitleTranslation,
  toggleEditMode,
  setTargetLanguage,
  fetchSubtitles,
  closeSubtitlesPanel,
  subtitlesContainerRef,
  currentTaskId,
  onTranslationStart,
  onTranslationComplete
}: SubtitlesPanelProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<'idle' | 'translating' | 'translated' | 'error'>('idle');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 处理语言切换，避免页面刷新
  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === targetLanguage) return;
    
    setTargetLanguage(newLanguage);
    
    // 如果有当前任务ID，立即获取新语言的字幕
    if (currentTaskId) {
      await fetchSubtitles(currentTaskId, newLanguage);
    }
  };

  // 轮询Supabase中的翻译数据
  const pollTranslationProgress = async () => {
    if (!currentTaskId) return;
    
    try {
      const { data, error } = await createClient()
        .from('sentences')
        .select('id, sentence_index, trans_text')
        .eq('task_id', currentTaskId)
        .order('sentence_index', { ascending: true });

      if (error) {
        console.error('轮询翻译数据失败:', error);
        return;
      }

      if (data) {
        // 检查翻译进度
        let hasAnyTranslation = false;
        let allTranslated = true;
        let translatedCount = 0;
        const totalCount = data.length;

        // 更新每个句子的翻译状态
        data.forEach((sentence: { id: number; sentence_index: number; trans_text: string | null }) => {
          const hasTranslation = sentence.trans_text && sentence.trans_text.trim() !== '';
          if (hasTranslation && sentence.trans_text) {
            hasAnyTranslation = true;
            translatedCount++;
            // 实时更新UI中的翻译内容，但不同步数据库（因为数据已经在数据库中了）
            updateSubtitleTranslation(sentence.id.toString(), sentence.trans_text, false);
          } else {
            allTranslated = false;
          }
        });

        // 开发环境输出翻译进度
        if (hasAnyTranslation && process.env.NODE_ENV === 'development') {
          console.log(`翻译进度: ${translatedCount}/${totalCount} (${Math.round(translatedCount/totalCount*100)}%)`);
        }

        // 如果所有句子都已翻译完成
        if (hasAnyTranslation && allTranslated) {
          if (process.env.NODE_ENV === 'development') {
            console.log('翻译完成！');
          }
          setTranslationStatus('translated');
          setIsTranslating(false);
          onTranslationComplete();
          
          // 停止轮询
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      }
    } catch (err) {
      console.error('轮询翻译进度异常:', err);
    }
  };

  const handleTranslate = async () => {
    if (!currentTaskId || !targetLanguage) return;
    
    // 检查是否已有翻译内容
    const hasExistingTranslations = subtitles.some(s => s.translation && s.translation.trim() !== '');
    
    if (hasExistingTranslations) {
      const confirmRetranslate = window.confirm(
        T.retranslateConfirmLabel || "已有翻译内容，是否重新翻译？这将覆盖现有的翻译。"
      );
      if (!confirmRetranslate) return;
    }
    
    try {
      setIsTranslating(true);
      setTranslationStatus('translating');
      onTranslationStart(); // 通知父组件翻译开始
      
      // 停止当前的轮询（如果有的话）
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('清空数据库中的翻译内容...');
      }
      
      // 清空前端显示
      subtitles.forEach(s => updateSubtitleTranslation(s.id, "", false));
      
      // 无论是否有现有翻译，都清空数据库中的翻译内容，确保轮询不会获取到旧数据
      const { error: clearError } = await createClient()
        .from('sentences')
        .update({ trans_text: null })
        .eq('task_id', currentTaskId);
        
      if (clearError) {
        console.error('清空数据库翻译内容失败:', clearError);
        throw new Error('清空现有翻译失败');
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('数据库翻译内容已清空');
      }
      
      // 稍微延迟确保数据库更新完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 调用后端翻译API
      const response = await fetch(`${API_BASE_URL}/api/translation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task_id: currentTaskId,
          target_language: targetLanguage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '翻译请求失败');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('翻译请求已发送，开始轮询结果...');
      }
      
      // 开始轮询Supabase中的翻译数据
      pollIntervalRef.current = setInterval(pollTranslationProgress, 1000); // 每1秒轮询一次

    } catch (err) {
      console.error('翻译失败:', err);
      setTranslationStatus('error');
      setIsTranslating(false);
      onTranslationComplete();
      alert(`翻译失败: ${err instanceof Error ? err.message : '未知错误'}`);
      
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }
  };

  useEffect(() => {
    // 切换到新任务或新语言时重置翻译状态
    if (process.env.NODE_ENV === 'development') {
      console.log('任务或语言变更，重置翻译状态');
    }
    setTranslationStatus('idle');
    setIsTranslating(false);
    
    // 清理轮询定时器
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, [currentTaskId, targetLanguage]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className={cn(
      "p-2 sm:p-3 rounded-3xl relative flex flex-col",
      "bg-transparent"
    )}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 z-20"
        onClick={closeSubtitlesPanel}
      >
                    <XMarkIcon className="h-4 w-4" />
        <span className="sr-only">{T.closeLabel}</span>
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pr-10">
        <h2 className="text-xl font-bold mb-2 sm:mb-0 whitespace-nowrap">{T.translatedSubtitleLabel}</h2>
        <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap mt-2 sm:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{T.languageLabel}:</span>
            <LanguageSwitch
              value={targetLanguage}
              onChange={handleLanguageChange}
              disabled={isTranslating}
            />
          </div>
          <Button
            variant="default"
            size="sm"
            className="h-8 px-4 text-sm font-medium whitespace-nowrap"
            onClick={handleTranslate}
            disabled={isLoading || isTranslating || !targetLanguage || !currentTaskId}
          >
            <GlobeAltIcon className="h-4 w-4 mr-1.5" />
            {isTranslating
              ? (T.translatingLabel || "Translating...")
              : (T.translateButtonLabel || "Translate")}
          </Button>
        </div>
      </div>
      
      <div className="h-[500px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]">
        <ScrollArea className={cn("rounded-md h-full")}>
          <div className="space-y-4 pb-4" ref={subtitlesContainerRef}>
            {subtitles.length === 0 && isLoading && (
              <div className="flex justify-center items-center h-32">
                <p>{T.loadingSubtitlesLabel || T.loadingLabel || "Loading subtitles..."}</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="flex flex-col justify-center items-center h-32 text-red-500">
                <p>{T.errorLabel || "Error"}: {error}</p>
                <Button variant="link" onClick={handleTranslate} className="mt-2">
                  {T.retryLabel || "Try Again"}
                </Button>
              </div>
            )}
            {!isLoading && !error && subtitles.length === 0 && (
              <div className="flex justify-center items-center h-32 text-muted-foreground">
                <p>{T.noSubtitlesFoundLabel || "No subtitles. Select language & click Translate."}</p>
              </div>
            )}
            {!isLoading && !error && subtitles.length > 0 && subtitles.map((subtitle) => (
              <motion.div 
                key={subtitle.id}
                className={cn(
                  "p-2 sm:p-3 rounded-xl",
                  theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-0 sm:justify-between mb-3">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-muted-foreground">
                        {subtitle.startTime} - {subtitle.endTime} 
                      </span>
                    </div>
                    {subtitle.speaker && (
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {subtitle.speaker}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      onClick={() => jumpToTime(subtitle.startTime)}
                    >
                      <PlayIcon className="h-3 w-3 mr-1" />
                      {T.jumpToLabel}
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {T.originalSubtitleLabel}
                  </label>
                  <div className={cn(
                    "p-2 sm:p-3 rounded-lg text-sm",
                    theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
                  )}>
                    {subtitle.text}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      {T.translatedSubtitleLabel}
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => toggleEditMode(subtitle.id)}
                      disabled={translationStatus !== 'translated'}
                    >
                      {editingSubtitleId === subtitle.id ? T.saveLabel : T.editLabel}
                    </Button>
                  </div>
                  
                  {editingSubtitleId === subtitle.id ? (
                    <Textarea
                      value={subtitle.translation}
                      onChange={(e) => updateSubtitleTranslation(subtitle.id, e.target.value, true)}
                      className={cn(
                        "min-h-[60px] text-sm",
                        theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white"
                      )}
                    />
                  ) : subtitle.translation ? (
                    <div className={cn(
                      "p-2 sm:p-3 rounded-lg text-sm",
                      theme === "dark" ? "bg-zinc-900 text-blue-400" : "bg-blue-50 text-blue-700"
                    )}>
                      {subtitle.translation}
                    </div>
                  ) : isTranslating ? (
                    <SkeletonTheme
                      baseColor={theme === "dark" ? "#303030" : undefined}
                      highlightColor={theme === "dark" ? "#4a4a4a" : undefined}
                    >
                      <div className="p-2 sm:p-3 rounded-lg">
                        <Skeleton height={20} width="100%" className="mb-1" />
                        <Skeleton height={20} width="80%" />
                      </div>
                    </SkeletonTheme>
                  ) : (
                    <div className={cn(
                      "p-2 sm:p-3 rounded-lg text-sm text-muted-foreground",
                      theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
                    )}>
                      {translationStatus === 'idle' ? "点击翻译按钮开始翻译" : "等待翻译..."}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 