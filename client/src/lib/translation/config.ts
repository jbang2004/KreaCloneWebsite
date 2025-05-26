import { TranslationConfig } from './types';

// 翻译配置管理器
export class TranslationConfigManager {
  private static instance: TranslationConfigManager;
  private configs: Map<string, TranslationConfig> = new Map();

  private constructor() {}

  static getInstance(): TranslationConfigManager {
    if (!TranslationConfigManager.instance) {
      TranslationConfigManager.instance = new TranslationConfigManager();
    }
    return TranslationConfigManager.instance;
  }

  // 设置翻译配置
  setConfig(model: string, config: TranslationConfig): void {
    this.configs.set(model, config);
  }

  // 获取翻译配置
  getConfig(model: string): TranslationConfig | null {
    return this.configs.get(model) || null;
  }

  // 获取默认配置
  getDefaultConfig(): TranslationConfig | null {
    // 优先级：groq > grok > deepseek > gemini
    const priorities = ['groq', 'grok', 'deepseek', 'gemini'];
    
    for (const model of priorities) {
      const config = this.configs.get(model);
      if (config) {
        return config;
      }
    }
    
    return null;
  }

  // 从环境变量初始化配置
  initFromEnv(): void {
    const envConfigs = [
      {
        model: 'deepseek' as const,
        apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY
      },
      {
        model: 'gemini' as const,
        apiKey: import.meta.env.VITE_GEMINI_API_KEY
      },
      {
        model: 'grok' as const,
        apiKey: import.meta.env.VITE_XAI_API_KEY
      },
      {
        model: 'groq' as const,
        apiKey: import.meta.env.VITE_GROQ_API_KEY
      }
    ];

    envConfigs.forEach(({ model, apiKey }) => {
      if (apiKey) {
        this.setConfig(model, {
          model,
          apiKey,
          batchSize: 50,
          temperature: model === 'deepseek' ? 1.3 : 0.8
        });
      }
    });
  }

  // 检查是否有可用的配置
  hasValidConfig(): boolean {
    return this.configs.size > 0;
  }

  // 获取所有可用的模型
  getAvailableModels(): string[] {
    return Array.from(this.configs.keys());
  }
}

// 导出单例实例
export const translationConfigManager = TranslationConfigManager.getInstance(); 