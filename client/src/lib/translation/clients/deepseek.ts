import { BaseClient } from './base';
import { TranslationResponse } from '../types';
import { parseJSON } from '../utils';

export class DeepSeekClient extends BaseClient {
  private readonly baseUrl = 'https://api.deepseek.com/chat/completions';

  async translate(systemPrompt: string, userPrompt: string): Promise<TranslationResponse> {
    const payload = {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 1.3,
      stream: false
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
        if (response.status === 503) {
          throw new Error('无法连接到DeepSeek API，可能是网络问题');
        }
        const errorText = await response.text();
        throw new Error(`DeepSeek API请求失败: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();

      if (!responseData?.choices?.[0]?.message?.content) {
        throw new Error('DeepSeek返回了无效的响应结构');
      }

      const result = responseData.choices[0].message.content;
      console.log(`DeepSeek原始返回内容 (长度: ${result.length}):`, result);

      if (!result || !result.trim()) {
        throw new Error('DeepSeek返回了空响应');
      }

      const parsedResult = parseJSON(result);
      console.log('DeepSeek请求成功，JSON解析完成');
      return parsedResult;

    } catch (error) {
      console.error('DeepSeek处理失败:', error);
      throw error;
    }
  }
}