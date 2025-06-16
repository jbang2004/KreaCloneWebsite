# 中国大陆访问解决方案指南

## 问题分析

当前网站部署在 Cloudflare Workers 上，使用 `.workers.dev` 域名，在中国大陆可能无法正常访问。

### 当前状态
- **部署平台**: Cloudflare Workers (全球分布式)
- **访问域名**: https://krea-clone-website.jbang20042004.workers.dev
- **IP地址**: 192.133.77.191 (美国西雅图)
- **实际处理节点**: 新加坡 (SIN) - 根据CF-Ray头信息

## 解决方案

### 方案1: 自定义域名 (推荐)

1. **购买域名**
   - 选择 `.com`、`.cn`、`.net` 等常见后缀
   - 避免使用可能被屏蔽的特殊后缀

2. **配置DNS**
   ```bash
   # 添加自定义域名到Cloudflare Workers
   npx wrangler domains add your-domain.com
   ```

3. **更新配置**
   在 `wrangler.jsonc` 中添加：
   ```json
   {
     "routes": [
       {
         "pattern": "your-domain.com/*",
         "custom_domain": true
       }
     ]
   }
   ```

### 方案2: 多CDN策略

1. **主CDN**: Cloudflare (海外用户)
2. **备用CDN**: 阿里云/腾讯云 (中国大陆用户)
3. **智能DNS**: 根据用户地理位置分流

### 方案3: 镜像部署

在中国友好的平台创建镜像：

#### Vercel部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署到Vercel
vercel --prod
```

#### 阿里云函数计算
```bash
# 使用Serverless Devs部署
npm install @serverless-devs/s -g
s deploy
```

### 方案4: 代理服务

设置反向代理服务器：
- 在中国大陆的服务器上部署Nginx
- 配置反向代理到Cloudflare Workers
- 使用中国大陆的域名访问

## 实施步骤

### 立即可行的解决方案

1. **购买域名** (如 krea-clone.com)
2. **配置Cloudflare DNS**:
   ```
   A记录: @ -> 192.0.2.1 (Cloudflare代理)
   CNAME记录: www -> krea-clone-website.jbang20042004.workers.dev
   ```
3. **更新Workers配置**
4. **测试访问**

### 长期优化方案

1. **ICP备案** (如使用.cn域名)
2. **CDN优化**
3. **性能监控**
4. **用户体验优化**

## 注意事项

1. **合规性**: 确保内容符合中国大陆相关法规
2. **备案要求**: 使用中国大陆服务器需要ICP备案
3. **成本考虑**: 多平台部署会增加维护成本
4. **同步问题**: 多个部署需要保持内容同步

## 测试方法

```bash
# 测试不同地区的访问速度
curl -w "@curl-format.txt" -o /dev/null -s "https://your-domain.com"

# 使用不同DNS测试解析
nslookup your-domain.com 8.8.8.8
nslookup your-domain.com 114.114.114.114
```

## 推荐工具

- **DNS检测**: https://www.whatsmydns.net/
- **网站测速**: https://www.17ce.com/
- **可用性监控**: https://uptimerobot.com/ 