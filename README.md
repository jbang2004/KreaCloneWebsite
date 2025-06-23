# 声渡 (WaveShift) - AI音视频处理平台

专业的AI音视频处理平台，提供音频转录、文本配音、视频翻译等服务。声之所至，渡见世界。

## ✨ 特性

- 🎵 **音频转录** - 高精度语音转文字
- 🗣️ **文本配音** - 自然语音合成
- 🎬 **视频翻译** - 多语言视频翻译
- 🔐 **用户认证** - 支持邮箱和Google登录
- 🌍 **多语言** - 中英文界面支持
- 🎨 **现代UI** - 诧寂美学设计风格

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **认证**: NextAuth.js v5 (JWT策略)
- **数据库**: Cloudflare D1 + Drizzle ORM
- **存储**: Cloudflare R2
- **部署**: Cloudflare Workers
- **样式**: Tailwind CSS + shadcn/ui
- **语言**: TypeScript

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm
- Cloudflare 账户

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd KreaCloneWebsite
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp env.example .dev.vars
# 编辑 .dev.vars 文件，填入必要的环境变量
```

4. **初始化数据库**
```bash
npm run dev
# 访问 http://localhost:3001/api/setup 初始化数据库
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3001](http://localhost:3001) 查看应用。

## 📁 项目结构

```
KreaCloneWebsite/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── auth/              # 认证相关页面
│   ├── actions.ts         # Server Actions
│   └── ...
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── ...
├── db/                   # 数据库相关
│   ├── schema.ts         # 数据库模式
│   └── migrations/       # 数据库迁移
├── hooks/                # 自定义 Hooks
├── lib/                  # 工具函数
├── auth.ts              # NextAuth 配置
└── wrangler.jsonc       # Cloudflare Workers 配置
```

## 🌐 部署

### Cloudflare Workers 部署

1. **构建项目**
```bash
npm run build
```

2. **部署到 Cloudflare**
```bash
npm run deploy
```

3. **设置环境变量**
在 Cloudflare Workers 控制台中设置所需的环境变量。

### 环境变量配置

```bash
# NextAuth.js 配置
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Google OAuth (可选)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudflare R2 配置
NEXT_PUBLIC_R2_CUSTOM_DOMAIN=your-r2-domain
NEXT_PUBLIC_R2_BUCKET_NAME=your-bucket-name

# 后端服务配置
NEXT_PUBLIC_BACKEND_URL=your-backend-url
NEXT_PUBLIC_BACKEND_PORT=your-backend-port
```

## 🔧 开发指南

### 数据库操作

```bash
# 查看数据库状态
npx wrangler d1 execute DB --local --command="SELECT * FROM users"

# 重建数据库
npm run db:rebuild
```

### 认证系统

- 使用 NextAuth.js v5 的 JWT 策略
- 支持邮箱/密码和 Google OAuth 登录
- 用户数据存储在 Cloudflare D1 数据库

### API 路由

- `/api/auth/*` - NextAuth.js 认证路由
- `/api/setup` - 数据库初始化
- `/api/tasks/*` - 任务管理
- `/api/subtitles/*` - 字幕处理

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**声渡团队** - 声之所至，渡见世界
