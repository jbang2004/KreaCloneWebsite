# 分块上传功能

## 概述

本项目已升级为使用 AWS S3 API 兼容的分块上传（Multipart Upload）方式，相比传统的单一文件上传，具有以下优势：

## 优势

### 1. 提升上传速度
- **并发上传**: 多个分块可以并行上传，充分利用带宽
- **网络优化**: 针对大陆用户的网络环境优化，提供更稳定的上传体验
- **断点续传**: 支持失败重试机制，单个分块失败不影响整体上传

### 2. 提高可靠性
- **错误隔离**: 单个分块失败只需重传该分块，不影响已上传的部分
- **自动重试**: 内置指数退避重试机制，网络波动时自动恢复
- **优雅降级**: 上传失败时自动清理资源，避免产生垃圾数据

### 3. 更好的用户体验
- **实时进度**: 精确显示上传进度百分比
- **状态反馈**: 详细的上传状态信息和错误提示
- **性能监控**: 可以监控每个分块的上传性能

## 技术实现

### 配置参数
```typescript
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk (S3 minimum)
const MAX_CONCURRENT_UPLOADS = 3;   // 并发上传数量
const RETRY_ATTEMPTS = 3;           // 重试次数
```

### API 端点

#### 1. 初始化分块上传
```
POST /api/r2-presigned-url
{
  "action": "initiate",
  "objectName": "filename.mp4",
  "contentType": "video/mp4"
}
```

#### 2. 获取分块上传URL
```
POST /api/r2-presigned-url
{
  "action": "getPartUrl",
  "objectName": "filename.mp4",
  "uploadId": "upload-id",
  "partNumber": 1
}
```

#### 3. 完成分块上传
```
POST /api/r2-presigned-url
{
  "action": "complete",
  "objectName": "filename.mp4",
  "uploadId": "upload-id",
  "parts": [
    { "partNumber": 1, "etag": "etag1" },
    { "partNumber": 2, "etag": "etag2" }
  ]
}
```

#### 4. 中止分块上传
```
POST /api/r2-presigned-url
{
  "action": "abort",
  "objectName": "filename.mp4",
  "uploadId": "upload-id"
}
```

## 上传流程

1. **文件分析**: 将大文件按5MB分割成多个分块
2. **初始化**: 调用 initiate API 获取 uploadId
3. **并发上传**: 最多3个分块并发上传，包含重试机制
4. **进度更新**: 实时更新上传进度
5. **完成上传**: 所有分块成功后调用 complete API
6. **错误处理**: 失败时自动调用 abort API 清理资源

## 性能优化

### 对大陆用户的优化
- **智能分块**: 5MB分块大小平衡传输效率和重试成本
- **限制并发**: 3个并发连接避免网络拥堵
- **指数退避**: 网络不稳定时智能重试

### 内存优化
- **流式处理**: 分块上传避免大文件一次性加载到内存
- **及时清理**: 上传完成后立即释放分块数据

## 测试

分块上传功能已集成到项目的视频上传页面中：
- `/video-translation` - 视频翻译上传
- `/audio-transcription` - 音频转录上传

## 兼容性

- ✅ Cloudflare R2 (完全兼容)
- ✅ Amazon S3 (原生支持)
- ✅ 其他 S3 兼容存储服务

## 纯分块上传架构

项目已完全迁移到分块上传架构，移除了所有单文件上传逻辑，确保：
- 所有上传都使用分块方式，提供最佳性能
- API端点只支持分块上传操作
- 代码库更简洁、维护性更好 