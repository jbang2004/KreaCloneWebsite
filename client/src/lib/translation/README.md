# 前端翻译模块

本模块实现了完全在前端进行字幕翻译的功能，支持多种AI翻译服务。

## 支持的翻译服务

- **DeepSeek**: 高质量中文翻译
- **Gemini**: Google的多语言翻译
- **Grok**: X.AI的翻译服务
- **Groq**: 快速推理翻译

## 环境变量配置

在 `.env` 文件中配置以下环境变量（至少配置一个）：

```env
# DeepSeek API
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key

# Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Grok (X.AI) API
VITE_XAI_API_KEY=your_xai_api_key

# Groq API
VITE_GROQ_API_KEY=your_groq_api_key
```

## 使用方法

### 基本翻译

```typescript
import { FrontendTranslator, translationConfigManager } from '@/lib/translation';

// 初始化配置
translationConfigManager.initFromEnv();
const config = translationConfigManager.getDefaultConfig();

if (config) {
  const translator = new FrontendTranslator(config);
  
  // 翻译文本
  const texts = { "0": "Hello world", "1": "How are you?" };
  const translated = await translator.translate(texts, 'zh');
  console.log(translated); // { "0": "你好世界", "1": "你好吗？" }
}
```

### 批量翻译句子

```typescript
// 翻译任务中的所有句子
for await (const batch of translator.translateSentences(taskId, 'zh', 50)) {
  console.log(`翻译了 ${batch.length} 个句子`);
  // 批次结果会自动保存到数据库
}
```

## 特性

- **批处理**: 支持批量翻译以提高效率
- **错误恢复**: 自动重试和错误处理
- **进度回调**: 实时翻译进度反馈
- **数据库同步**: 自动将翻译结果保存到Supabase
- **多模型支持**: 自动选择可用的翻译模型

## 架构

```
translation/
├── types.ts          # 类型定义
├── prompts.ts        # 翻译提示词
├── utils.ts          # 工具函数
├── config.ts         # 配置管理
├── translator.ts     # 主翻译器
├── clients/          # API客户端
│   ├── base.ts       # 基础客户端
│   ├── deepseek.ts   # DeepSeek客户端
│   ├── gemini.ts     # Gemini客户端
│   ├── grok.ts       # Grok客户端
│   └── groq.ts       # Groq客户端
└── index.ts          # 模块导出
```

## 从后端迁移的功能

- ✅ 批处理翻译逻辑
- ✅ 多种AI模型支持
- ✅ 错误处理和重试
- ✅ 翻译提示词
- ✅ 数据库同步
- ✅ 进度跟踪 