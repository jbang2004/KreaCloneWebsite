export interface TranslationConfig {
  model: 'deepseek' | 'gemini' | 'grok' | 'groq';
  apiKey: string;
  batchSize?: number;
  temperature?: number;
}

export interface BatchConfig {
  initialSize: number;
  minSize: number;
  requiredSuccesses: number;
  retryDelay: number;
}

export interface TranslationRequest {
  texts: Record<string, string>;
  targetLanguage: string;
}

export interface TranslationResponse {
  thinking?: string;
  output: Record<string, string>;
}

export interface SimplificationResponse {
  thinking?: string;
  minimal: Record<string, string>;
  slight: Record<string, string>;
  moderate: Record<string, string>;
  significant: Record<string, string>;
  extreme: Record<string, string>;
}

export interface Sentence {
  id: string;
  sentence_index: number;
  raw_text: string;
  trans_text?: string;
  speed?: number;
} 