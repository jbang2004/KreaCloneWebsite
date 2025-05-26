/**
 * 修复并解析JSON字符串
 */
export function parseJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (error) {
    // 简单的JSON修复逻辑
    try {
      // 移除可能的markdown代码块
      let cleaned = text.replace(/```json\s*|\s*```/g, '');
      // 移除首尾空白
      cleaned = cleaned.trim();
      return JSON.parse(cleaned);
    } catch (secondError) {
      console.error('JSON解析失败:', secondError);
      throw new Error(`JSON解析失败: ${secondError}`);
    }
  }
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化提示词
 */
export function formatPrompt(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return result;
} 