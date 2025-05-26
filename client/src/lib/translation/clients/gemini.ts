import { BaseClient } from './base';
import { TranslationResponse } from '../types';
import { parseJSON } from '../utils';

export class GeminiClient extends BaseClient {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  async translate(systemPrompt: string, userPrompt: string): Promise<TranslationResponse> {
    const payload = {
      contents: [
        {
          parts: [
            { text: userPrompt }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          { text: systemPrompt }
        ]
      },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API请求失败: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();

      if (!responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Gemini返回了无效的响应结构');
      }

      const result = responseData.candidates[0].content.parts[0].text;
      console.log(`Gemini原始返回内容 (长度: ${result.length}):`, result);

      if (!result || !result.trim()) {
        throw new Error('Gemini返回了空响应');
      }

      const parsedResult = parseJSON(result);
      console.log('Gemini请求成功，JSON解析完成');
      return parsedResult;

    } catch (error) {
      console.error('Gemini处理失败:', error);
      throw error;
    }
  }
} 