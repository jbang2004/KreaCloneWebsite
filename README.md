<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

# KreaClone Website

一个基于 Next.js 15 的现代化视频翻译和处理平台，现已配置为使用 OpenNext 部署到 Cloudflare Workers。

## 🚀 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 组件**: React 19 + Radix UI + TailwindCSS
- **动画**: Framer Motion (LazyMotion 优化)
- **状态管理**: React Query + Context API
- **认证**: Supabase Auth
- **数据库**: Supabase
- **部署**: Cloudflare Workers (OpenNext)
- **样式**: TailwindCSS + CSS Modules

## 📦 项目特性

- ✅ 视频上传和处理
- ✅ 多语言字幕翻译
- ✅ 文本转语音 (TTS)
- ✅ 音频转录
- ✅ 用户认证和授权
- ✅ 响应式设计
- ✅ 深色/浅色主题切换
- ✅ 国际化支持
- ✅ 性能优化 (SSG + 懒加载)

## 🛠 开发环境设置

### 前置要求

- Node.js v20.0.0 或更高版本
- npm 或 yarn
- Cloudflare 账户（用于部署）

### 安装依赖

```bash
npm install
```

### 环境变量配置

1. 复制环境变量模板：
```bash
cp .dev.vars .dev.vars.local
```

2. 编辑 `.dev.vars.local` 文件，填入你的配置：
```bash
NEXTJS_ENV=development
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_BACKEND_URL=your-backend-url
```

### 本地开发

```bash
# 启动 Next.js 开发服务器
npm run dev

# 在 Cloudflare Workers 环境中预览
npm run preview
```

## 🚀 部署到 Cloudflare Workers

### 1. 登录 Cloudflare

```bash
npx wrangler login
```

### 2. 配置生产环境变量

在 Cloudflare Dashboard 中设置环境变量，或使用命令行：

```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put NEXT_PUBLIC_BACKEND_URL
```

### 3. 部署

```bash
# 构建并部署
npm run deploy

# 或者只上传新版本（不立即发布）
npm run upload
```

## 📁 项目结构

```
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
├── hooks/                  # 自定义 Hooks
├── lib/                    # 工具库和配置
├── contexts/               # React Context
├── types/                  # TypeScript 类型定义
├── public/                 # 静态资源
├── wrangler.jsonc          # Cloudflare Workers 配置
├── open-next.config.ts     # OpenNext 配置
└── .dev.vars               # 开发环境变量模板
```

## 🎯 性能优化

项目已实现多项性能优化：

- **代码分割**: 动态导入重型组件
- **图片优化**: WebP/AVIF 格式支持
- **静态生成**: 大部分页面预渲染
- **懒加载**: Framer Motion LazyMotion
- **缓存策略**: 静态资源长期缓存
- **包体积优化**: 首屏 JS 仅 102KB

## 🔧 配置文件说明

- `wrangler.jsonc`: Cloudflare Workers 配置
- `open-next.config.ts`: OpenNext 适配器配置
- `next.config.ts`: Next.js 配置
- `tailwind.config.ts`: TailwindCSS 配置
- `public/_headers`: 静态资源缓存配置

## 📊 构建信息

- **First Load JS**: 102 KB (优化后)
- **Worker 大小**: ~1.5 MB (gzip 压缩后)
- **支持的 Next.js 特性**: SSG, SSR, Middleware, Image Optimization
- **兼容性**: Cloudflare Workers Node.js Runtime

## 🐛 故障排除

### Node.js 版本问题
确保使用 Node.js v20+：
```bash
node --version  # 应该 >= v20.0.0
```

### Worker 大小限制
- 免费计划: 3 MiB (压缩后)
- 付费计划: 10 MiB (压缩后)

### 环境变量
确保在 Cloudflare Dashboard 中正确设置所有环境变量。

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md)
- [Next.js 文档](https://nextjs.org/docs)
- [OpenNext 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
