import { TranslationResponse, SimplificationResponse } from '../types';

export interface BaseTranslationClient {
  translate(systemPrompt: string, userPrompt: string): Promise<TranslationResponse>;
}

export abstract class BaseClient implements BaseTranslationClient {
  protected apiKey: string;
  
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API密钥不能为空');
    }
    this.apiKey = apiKey;
  }

  abstract translate(systemPrompt: string, userPrompt: string): Promise<TranslationResponse>;
} 