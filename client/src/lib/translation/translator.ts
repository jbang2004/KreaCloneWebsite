import { 
  TranslationConfig, 
  BatchConfig, 
  TranslationResponse, 
  SimplificationResponse,
  Sentence 
} from './types';
import { 
  TRANSLATION_SYSTEM_PROMPT, 
  TRANSLATION_USER_PROMPT, 
  SIMPLIFICATION_SYSTEM_PROMPT,
  SIMPLIFICATION_USER_PROMPT,
  LANGUAGE_MAP 
} from './prompts';
import { formatPrompt, delay } from './utils';
import { 
  BaseTranslationClient,
  DeepSeekClient, 
  GeminiClient, 
  GrokClient, 
  GroqClient 
} from './clients';
import { supabase } from '../supabaseClient';

export class FrontendTranslator {
  private client: BaseTranslationClient;
  private config: TranslationConfig;

  constructor(config: TranslationConfig) {
    this.config = config;
    this.client = this.createClient(config);
  }

  private createClient(config: TranslationConfig): BaseTranslationClient {
    switch (config.model) {
      case 'deepseek':
        return new DeepSeekClient(config.apiKey);
      case 'gemini':
        return new GeminiClient(config.apiKey);
      case 'grok':
        return new GrokClient(config.apiKey);
      case 'groq':
        return new GroqClient(config.apiKey);
      default:
        throw new Error(`不支持的翻译模型：${config.model}`);
    }
  }

  async translate(texts: Record<string, string>, targetLanguage: string = 'zh'): Promise<Record<string, string>> {
    const systemPrompt = formatPrompt(TRANSLATION_SYSTEM_PROMPT, {
      target_language: LANGUAGE_MAP[targetLanguage] || targetLanguage
    });
    
    const userPrompt = formatPrompt(TRANSLATION_USER_PROMPT, {
      target_language: LANGUAGE_MAP[targetLanguage] || targetLanguage,
      json_content: JSON.stringify(texts)
    });

    const result = await this.client.translate(systemPrompt, userPrompt);
    return result.output || {};
  }

  async simplify(texts: Record<string, string>): Promise<SimplificationResponse> {
    const systemPrompt = SIMPLIFICATION_SYSTEM_PROMPT;
    const userPrompt = formatPrompt(SIMPLIFICATION_USER_PROMPT, {
      json_content: JSON.stringify(texts)
    });

    const result = await this.client.translate(systemPrompt, userPrompt);
    return result as unknown as SimplificationResponse;
  }

  // 批处理核心逻辑
  async* processBatch<T>(
    items: T[],
    processFunc: (batch: T[]) => Promise<T[] | null>,
    config: BatchConfig,
    errorHandler?: (batch: T[]) => T[],
    reduceBatchOnError: boolean = true
  ): AsyncGenerator<T[], void> {
    if (!items.length) return;

    let i = 0;
    let batchSize = config.initialSize;
    let successCount = 0;

    while (i < items.length) {
      try {
        const batch = items.slice(i, i + batchSize);
        if (!batch.length) break;

        const results = await processFunc(batch);
        if (results) {
          successCount++;
          yield results;
          i += batch.length;

          // 连续成功后恢复初始批次大小
          if (reduceBatchOnError && batchSize < config.initialSize && successCount >= config.requiredSuccesses) {
            console.log(`连续成功${successCount}次，恢复到初始批次大小: ${config.initialSize}`);
            batchSize = config.initialSize;
            successCount = 0;
          }

          if (i < items.length) {
            await delay(config.retryDelay);
          }
        }
      } catch (error) {
        console.error('批处理失败:', error);
        if (reduceBatchOnError && batchSize > config.minSize) {
          batchSize = Math.max(Math.floor(batchSize / 2), config.minSize);
          successCount = 0;
          console.log(`出错后减小批次大小到: ${batchSize}`);
          continue;
        } else {
          const batch = items.slice(i, i + batchSize);
          if (errorHandler && batch) {
            yield errorHandler(batch);
          }
          if (batch) {
            i += batch.length;
          }
        }
      }
    }
  }

  // 翻译句子生成器
  async* translateSentences(
    taskId: string,
    targetLanguage: string,
    batchSize: number = 50,
    onProgress?: (translated: number, total: number) => void
  ): AsyncGenerator<Sentence[], void> {
    try {
      // 从supabase获取句子
      const { data: sentences, error } = await supabase
        .from('sentences')
        .select('id, sentence_index, raw_text, trans_text')
        .eq('task_id', taskId)
        .order('sentence_index', { ascending: true });

      if (error) {
        throw new Error(`获取句子失败: ${error.message}`);
      }

      if (!sentences?.length) {
        console.warn(`[${taskId}] 翻译：数据库中没有检索到句子`);
        return;
      }

      console.log(`[${taskId}] 翻译：获取到 ${sentences.length} 个句子`);

      // 更新任务状态
      await supabase
        .from('tasks')
        .update({ 
          status: 'translating', 
          target_language: targetLanguage 
        })
        .eq('task_id', taskId);

      const config: BatchConfig = {
        initialSize: Math.max(1, Math.min(batchSize, 50)),
        minSize: 1,
        requiredSuccesses: 2,
        retryDelay: 100
      };

      let translatedCount = 0;
      const total = sentences.length;

      const processFunc = async (batch: Sentence[]): Promise<Sentence[] | null> => {
        const texts = Object.fromEntries(
          batch.map((s, j) => [j.toString(), s.raw_text])
        );
        
        console.log(`翻译批次: ${Object.keys(texts).length}条文本`);
        const translated = await this.translate(texts, targetLanguage);

        if (!translated) {
          throw new Error(`[${taskId}] 翻译结果中缺少 output 字段`);
        }

        if (Object.keys(translated).length !== Object.keys(texts).length) {
          throw new Error(`[${taskId}] 翻译返回数量与输入不匹配`);
        }

        // 更新句子和数据库
        for (let j = 0; j < batch.length; j++) {
          const sentence = batch[j];
          const original = sentence.raw_text;
          const translation = translated[j.toString()];
          
          console.log(`[${taskId}] 翻译: 原文: "${original}" => 译文: "${translation}"`);
          sentence.trans_text = translation;

          // 更新数据库
          await supabase
            .from('sentences')
            .update({ trans_text: translation })
            .eq('id', sentence.id);

          translatedCount++;
          onProgress?.(translatedCount, total);
        }

        return batch;
      };

      const errorHandler = (batch: Sentence[]): Sentence[] => {
        for (const sentence of batch) {
          sentence.trans_text = sentence.raw_text;
          // 异步更新数据库，使用原文作为翻译
          (async () => {
            try {
              await supabase
                .from('sentences')
                .update({ trans_text: sentence.raw_text })
                .eq('id', sentence.id);
            } catch (error) {
              console.error(error);
            }
          })();
        }
        return batch;
      };

      for await (const batchResult of this.processBatch(
        sentences,
        processFunc,
        config,
        errorHandler,
        true
      )) {
        yield batchResult;
      }

    } catch (error) {
      console.error(`[${taskId}] 翻译句子生成器发生错误:`, error);
      throw error;
    }
  }
}