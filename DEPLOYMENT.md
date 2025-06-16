# Cloudflare Workers 部署指南

本项目已配置为使用 OpenNext 部署到 Cloudflare Workers。

## 前置要求

1. **Node.js 版本**: 需要 Node.js v20.0.0 或更高版本
2. **Cloudflare 账户**: 需要一个 Cloudflare 账户
3. **Wrangler CLI**: 已作为开发依赖安装

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.dev.vars` 文件并填入你的实际配置：
```bash
cp .dev.vars .dev.vars.local
```

编辑 `.dev.vars.local` 文件，填入你的 Supabase 和后端 API 配置。

### 3. 本地开发服务器
```bash
npm run dev
```
这将启动 Next.js 开发服务器，提供最佳的开发体验。

### 4. 本地预览（Workers 环境）
```bash
npm run preview
```
这将在 Cloudflare Workers 运行时环境中预览你的应用。

## 部署到 Cloudflare Workers

### 1. 登录 Cloudflare
```bash
npx wrangler login
```

### 2. 配置生产环境变量
在 Cloudflare Dashboard 中设置环境变量，或使用 wrangler：
```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put NEXT_PUBLIC_BACKEND_URL
```

### 3. 部署
```bash
npm run deploy
```

### 4. 上传新版本（不立即发布）
```bash
npm run upload
```

## 配置文件说明

- `wrangler.jsonc`: Wrangler 配置文件，定义 Worker 设置
- `open-next.config.ts`: OpenNext 配置文件
- `.dev.vars`: 开发环境变量模板
- `public/_headers`: 静态资源缓存配置

## 性能优化

项目已包含以下优化：
- 静态资源长期缓存（1年）
- 图片格式优化（WebP/AVIF）
- 代码分割和懒加载
- 生产环境控制台日志移除

## 故障排除

### Node.js 版本问题
如果遇到 Node.js 版本问题，请升级到 v20+：
```bash
# 使用 nvm
nvm install 20
nvm use 20

# 或使用 volta
volta install node@20
```

### Worker 大小限制
- 免费计划：3 MiB（压缩后）
- 付费计划：10 MiB（压缩后）

当前项目构建后约 1.5 MiB（压缩），在限制范围内。

### 环境变量
确保在 Cloudflare Dashboard 的 Workers & Pages > 你的项目 > Settings > Environment Variables 中设置了所有必要的环境变量。

## 监控和日志

部署后可以在 Cloudflare Dashboard 中查看：
- 实时日志
- 性能指标
- 错误报告

## 自定义域名

在 Cloudflare Dashboard 中可以为你的 Worker 配置自定义域名。 