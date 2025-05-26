import { BaseClient } from './base';
import { TranslationResponse } from '../types';
import { parseJSON } from '../utils';

export class GroqClient extends BaseClient {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly modelName: string;

  constructor(apiKey: string, modelName: string = 'llama-3.3-70b-versatile') {
    super(apiKey);
    this.modelName = modelName;
  }

  async translate(systemPrompt: string, userPrompt: string): Promise<TranslationResponse> {
    const payload = {
      model: this.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API请求失败: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();

      if (!responseData?.choices?.[0]?.message?.content) {
        throw new Error('Groq返回了无效的响应结构');
      }

      const result = responseData.choices[0].message.content;
      console.log(`Groq原始返回内容 (长度: ${result.length}):`, result);

      if (!result || !result.trim()) {
        throw new Error('Groq返回了空响应');
      }

      const parsedResult = parseJSON(result);
      console.log('Groq请求成功，JSON解析完成');
      return parsedResult;

    } catch (error) {
      console.error('Groq处理失败:', error);
      throw error;
    }
  }
}