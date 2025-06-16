# 🚀 Cloudflare Workers 部署检查清单

## ✅ 预部署检查

### 1. 环境要求
- [ ] Node.js v20.0.0 或更高版本
- [ ] npm 或 yarn 已安装
- [ ] Cloudflare 账户已创建

### 2. 项目配置
- [x] 已安装 `@opennextjs/cloudflare`
- [x] 已安装 `wrangler` CLI
- [x] 已创建 `wrangler.jsonc` 配置文件
- [x] 已创建 `open-next.config.ts` 配置文件
- [x] 已创建 `.dev.vars` 环境变量模板
- [x] 已创建 `public/_headers` 缓存配置
- [x] 已更新 `package.json` 脚本
- [x] 已更新 `next.config.ts` 配置
- [x] 已更新 `.gitignore` 文件

### 3. 环境变量配置
- [ ] 复制 `.dev.vars` 为 `.dev.vars.local`
- [ ] 配置 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 配置 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 配置 `NEXT_PUBLIC_BACKEND_URL`

## 🔧 本地测试

### 1. 开发环境测试
```bash
npm run dev
```
- [ ] 应用正常启动
- [ ] 所有页面可访问
- [ ] 功能正常工作

### 2. Workers 环境测试
```bash
npm run preview
```
- [ ] 构建成功
- [ ] 预览服务器启动
- [ ] 应用在 Workers 环境中正常运行

## 🚀 部署流程

### 1. Cloudflare 认证
```bash
npx wrangler login
```
- [ ] 成功登录 Cloudflare 账户

### 2. 环境变量设置
在 Cloudflare Dashboard 中设置：
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_BACKEND_URL`

或使用命令行：
```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put NEXT_PUBLIC_BACKEND_URL
```

### 3. 部署
```bash
npm run deploy
```
- [ ] 构建成功
- [ ] 部署成功
- [ ] 获得部署 URL

## ✅ 部署后验证

### 1. 功能测试
- [ ] 主页正常加载
- [ ] 用户认证功能正常
- [ ] 视频上传功能正常
- [ ] 字幕翻译功能正常
- [ ] 响应式设计正常
- [ ] 主题切换正常

### 2. 性能检查
- [ ] 首屏加载时间 < 3秒
- [ ] 静态资源缓存正常
- [ ] 图片优化生效
- [ ] 无控制台错误

### 3. SEO 检查
- [ ] Meta 标签正确
- [ ] Open Graph 标签正确
- [ ] 结构化数据正确

## 🔄 CI/CD 设置（可选）

### GitHub Actions
- [x] 已创建 `.github/workflows/deploy.yml`
- [ ] 在 GitHub Secrets 中设置：
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_BACKEND_URL`

## 📊 监控设置

### Cloudflare Dashboard
- [ ] 启用 Analytics
- [ ] 设置 Alerts
- [ ] 配置 Custom Domains（如需要）

### 性能监控
- [ ] 设置 Real User Monitoring
- [ ] 配置错误追踪
- [ ] 设置日志记录

## 🛠 故障排除

### 常见问题
1. **Node.js 版本错误**
   - 升级到 v20+
   - 使用 nvm 或 volta 管理版本

2. **Worker 大小超限**
   - 检查 bundle 大小
   - 移除不必要的依赖
   - 优化代码分割

3. **环境变量问题**
   - 检查变量名拼写
   - 确认在 Cloudflare Dashboard 中设置
   - 验证变量值正确

4. **构建失败**
   - 检查 TypeScript 错误
   - 验证依赖版本兼容性
   - 清理 node_modules 重新安装

## 📝 部署记录

| 日期 | 版本 | 部署者 | 状态 | 备注 |
|------|------|--------|------|------|
| 2024-06-16 | v1.0.0 | System | ✅ | 初始 OpenNext 部署 |

## 🔗 有用链接

- [Cloudflare Workers Dashboard](https://dash.cloudflare.com/)
- [OpenNext 文档](https://opennext.js.org/cloudflare)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment) 