# 域名配置指南 - www.futureai.click

## 当前状态
- ✅ Worker 已成功部署到: https://krea-clone-website.jbang20042004.workers.dev
- 🎯 目标域名: www.futureai.click (AWS Route53)
- 📍 需要配置: DNS 记录指向 Cloudflare Workers

## 配置方案

### 方案1: 直接 CNAME 到 Workers 域名 (推荐)

在 AWS Route53 中配置以下 DNS 记录：

```
记录类型: CNAME
名称: www.futureai.click
值: krea-clone-website.jbang20042004.workers.dev
TTL: 300 (5分钟)
```

```
记录类型: CNAME  
名称: futureai.click (根域名)
值: krea-clone-website.jbang20042004.workers.dev
TTL: 300 (5分钟)
```

**注意**: 根域名 CNAME 可能不被所有 DNS 提供商支持，如果不支持，请使用方案2。

### 方案2: 将域名迁移到 Cloudflare (最佳体验)

#### 步骤1: 添加域名到 Cloudflare
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 "Add a Site"
3. 输入 `futureai.click`
4. 选择免费计划
5. Cloudflare 会扫描现有 DNS 记录

#### 步骤2: 更新 Name Servers
将 AWS Route53 的 Name Servers 更改为 Cloudflare 提供的：
```
例如:
ava.ns.cloudflare.com
bob.ns.cloudflare.com
```

#### 步骤3: 配置 DNS 记录
在 Cloudflare DNS 中添加：
```
类型: CNAME
名称: www
内容: krea-clone-website.jbang20042004.workers.dev
代理状态: 已代理 (橙色云朵)

类型: CNAME
名称: @
内容: krea-clone-website.jbang20042004.workers.dev  
代理状态: 已代理 (橙色云朵)
```

#### 步骤4: 配置 Worker 路由
在 Cloudflare Workers 中添加自定义域名：
1. 进入 Workers & Pages
2. 选择 `krea-clone-website`
3. 点击 "Settings" → "Triggers"
4. 添加自定义域名: `www.futureai.click` 和 `futureai.click`

### 方案3: 使用 A 记录 (备选)

如果 CNAME 不可行，可以使用 A 记录指向 Cloudflare 的 Anycast IP：

```
记录类型: A
名称: www.futureai.click
值: 192.0.2.1 (Cloudflare Anycast IP)
TTL: 300

记录类型: A
名称: futureai.click
值: 192.0.2.1
TTL: 300
```

然后在 Cloudflare 中配置页面规则将流量转发到 Worker。

## 验证步骤

配置完成后，使用以下命令验证：

```bash
# 检查 DNS 解析
nslookup www.futureai.click
nslookup futureai.click

# 测试 HTTP 响应
curl -I https://www.futureai.click
curl -I https://futureai.click

# 检查从中国大陆的访问
# 可以使用在线工具: https://www.17ce.com/
```

## 预期结果

配置成功后：
- ✅ https://www.futureai.click → 显示你的网站
- ✅ https://futureai.click → 显示你的网站  
- ✅ 中国大陆用户可以正常访问
- ✅ 全球 CDN 加速
- ✅ SSL 证书自动配置

## 故障排除

### DNS 传播时间
- DNS 更改可能需要 5-48 小时全球传播
- 使用 `dig` 或在线工具检查传播状态

### SSL 证书问题
- Cloudflare 会自动为自定义域名生成 SSL 证书
- 如果遇到 SSL 错误，等待几分钟后重试

### 中国大陆访问测试
- 使用 VPN 切换到中国大陆节点测试
- 或使用在线测试工具验证可访问性

## 下一步

1. **立即执行**: 在 AWS Route53 中配置 CNAME 记录
2. **等待传播**: DNS 更改生效 (通常 5-30 分钟)
3. **测试访问**: 验证域名是否正常工作
4. **优化配置**: 考虑迁移到 Cloudflare 获得更好体验

## 联系支持

如果遇到问题：
- Cloudflare 支持: https://support.cloudflare.com/
- AWS Route53 文档: https://docs.aws.amazon.com/route53/ 

## DNS配置冲突解决方案

### 问题描述
如果遇到以下错误：
```
RRSet of type CNAME with DNS name www.futureai.click. is not permitted as it conflicts with other records with the same DNS name
```

这表示DNS记录冲突 - CNAME记录不能与其他记录类型（如A记录）共存。

### 解决方案选项

#### 选项1：删除现有A记录，使用CNAME（推荐用于简单设置）

1. **登录AWS Route53控制台**
2. **选择托管区域** `futureai.click`
3. **删除冲突记录**：
   - 找到 `www.futureai.click` 的A记录（34.217.153.170）
   - 选中并删除此记录
4. **添加CNAME记录**：
   - 记录名称：`www`
   - 记录类型：`CNAME`
   - 值：`your-app-name.your-subdomain.workers.dev`
   - TTL：300秒（5分钟）

#### 选项2：转移到Cloudflare DNS管理（推荐用于完整控制）

1. **在Cloudflare中添加域名**：
   ```bash
   # 登录Cloudflare Dashboard
   # Add Site -> 输入 futureai.click
   ```

2. **获取Cloudflare名称服务器**（类似）：
   ```
   lucas.ns.cloudflare.com
   uma.ns.cloudflare.com
   ```

3. **更新Route53名称服务器**：
   - 在Route53中选择托管区域
   - 编辑NS记录
   - 替换为Cloudflare的名称服务器

4. **在Cloudflare中配置DNS**：
   - A记录：@ -> Cloudflare Workers IP
   - CNAME记录：www -> your-worker-domain.workers.dev

#### 选项3：保留现有配置，使用子域名

如果不想改动现有配置：

1. **保留现有A记录**
2. **使用不同子域名**：
   - `app.futureai.click` 
   - `cn.futureai.click`
   - `cloud.futureai.click`

3. **为新子域名添加CNAME记录**：
   ```
   记录名称: app
   记录类型: CNAME  
   值: your-worker-domain.workers.dev
   ```

### 推荐配置流程

```bash
# 1. 检查当前DNS状态
dig www.futureai.click
dig futureai.click

# 2. 测试Cloudflare Workers访问
curl -I https://your-worker-domain.workers.dev

# 3. 配置完成后验证
dig www.futureai.click
curl -I https://www.futureai.click
```

### 常见问题解决

#### DNS传播时间
- DNS更改可能需要24-48小时完全传播
- 使用TTL 300秒可加快更新速度
- 在不同地区可能看到不同结果

#### 测试命令
```bash
# 检查DNS解析
nslookup www.futureai.click

# 检查HTTP响应
curl -H "Host: www.futureai.click" https://your-worker-domain.workers.dev

# 检查SSL证书
openssl s_client -connect www.futureai.click:443 -servername www.futureai.click
```

### 验证清单

- [ ] DNS记录配置正确
- [ ] 无记录冲突
- [ ] Cloudflare Workers响应正常  
- [ ] 自定义域名解析正确
- [ ] SSL证书有效
- [ ] 中国大陆访问正常

## 域名添加到Cloudflare Workers

### 前提条件
1. Cloudflare账户
2. 已部署的Workers应用
3. 域名控制权（Route53或其他DNS提供商）

### 步骤1：在Cloudflare Workers中添加自定义域名

1. **登录Cloudflare Dashboard**
2. **进入Workers & Pages**
3. **选择您的Workers应用**
4. **点击Settings -> Triggers**
5. **点击"Add Custom Domain"**
6. **输入域名**：`www.futureai.click`
7. **点击"Add Custom Domain"**

### 步骤2：获取DNS配置信息

Cloudflare会提供两种选项：

#### 选项A：如果域名已在Cloudflare
- 自动配置DNS记录
- 无需额外操作

#### 选项B：如果域名在其他DNS提供商（如Route53）
- 显示需要添加的CNAME记录
- 目标通常为：`your-worker-name.your-subdomain.workers.dev`

### 步骤3：在Route53中配置DNS

1. **登录AWS Route53控制台**
2. **选择托管区域**：`futureai.click`
3. **创建记录**：
   - 记录名称：`www`
   - 记录类型：`CNAME`
   - 值：Cloudflare提供的目标域名
   - TTL：300（5分钟，便于测试）

### 步骤4：验证配置

```bash
# 检查DNS解析
dig www.futureai.click

# 测试HTTP访问
curl -I https://www.futureai.click

# 检查SSL证书
curl -I https://www.futureai.click
```

### 步骤5：等待SSL证书

- Cloudflare会自动为自定义域名颁发SSL证书
- 通常需要几分钟到几小时
- 可以在Workers Dashboard中查看状态

## 中国大陆访问优化

### 网络路径优化
- Cloudflare在中国有边缘节点
- 使用自定义域名可能获得更好的路由

### 测试访问速度
```bash
# 测试从不同地区的访问速度
curl -w "@curl-format.txt" -s -o /dev/null https://www.futureai.click

# 或使用在线工具测试不同地区的访问速度
```

### 备用方案
如果访问仍有问题，考虑：
1. 使用CDN加速服务
2. 配置境内备用域名
3. 使用其他边缘计算平台

## 故障排除

### 常见问题

#### DNS传播延迟
- 等待24-48小时完全传播
- 清除本地DNS缓存：`sudo systemctl flush-dns`

#### CNAME冲突
- 确保同一域名下没有其他A/AAAA记录
- CNAME记录必须是唯一的

#### SSL证书问题
- 检查Cloudflare Dashboard中的SSL状态
- 等待证书自动颁发完成

#### 访问403/404错误
- 检查Workers应用是否正常运行
- 验证自定义域名配置是否正确

### 检查脚本

创建自动检查脚本：

```bash
#!/bin/bash
# 文件名：check-domain.sh

echo "检查域名配置状态..."
echo "======================="

# 检查DNS解析
echo "1. DNS解析状态："
dig +short www.futureai.click

# 检查HTTP状态
echo "2. HTTP访问状态："
curl -I -s https://www.futureai.click | head -1

# 检查SSL证书
echo "3. SSL证书状态："
echo | openssl s_client -connect www.futureai.click:443 -servername www.futureai.click 2>/dev/null | grep -E "subject=|issuer="

echo "======================="
echo "检查完成"
```

### 联系支持

如果问题持续存在：
1. Cloudflare Support（Workers相关问题）
2. AWS Support（Route53相关问题）
3. 检查Cloudflare状态页面：https://www.cloudflarestatus.com/ 