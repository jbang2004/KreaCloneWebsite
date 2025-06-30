import { type NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { mediaTasks, transcriptions, transcriptionSegments } from '@/db/schema-media';
import { eq } from 'drizzle-orm';

interface CallbackPayload {
  taskId: string;
  status: 'completed' | 'failed';
  result?: {
    videoUrl: string;
    audioUrl: string;
    transcription: {
      targetLanguage: string;
      style: string;
      model?: string;
      segments: Array<{
        sequence: number;
        start: string;
        end: string;
        contentType: string;
        speaker: string;
        original: string;
        translation: string;
      }>;
      metadata?: any;
    };
  };
  error?: {
    message: string;
    stack?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 验证工作流回调认证
    const authHeader = request.headers.get('x-workflow-auth');
    const expectedSecret = process.env.WORKFLOW_CALLBACK_SECRET || 'waveshift-callback-secret-2025';
    
    if (authHeader !== expectedSecret) {
      console.error('Workflow callback authentication failed');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 获取 Cloudflare 环境
    const context = await getCloudflareContext({ async: true });
    const env = context.env as any;
    const db = drizzle(env.DB);
    
    const payload = await request.json() as CallbackPayload;
    const { taskId, status, result, error } = payload;
    
    console.log(`收到工作流回调: ${taskId}, 状态: ${status}`);
    
    // 验证任务存在
    const [task] = await db.select()
      .from(mediaTasks)
      .where(eq(mediaTasks.id, taskId))
      .limit(1);
    
    if (!task) {
      console.error(`任务不存在: ${taskId}`);
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    
    if (status === 'completed' && result) {
      // 处理成功完成的回调
      const now = Date.now();
      
      // 更新媒体任务状态
      await db.update(mediaTasks)
        .set({
          status: 'completed',
          progress: 100,
          videoUrl: result.videoUrl,
          audioUrl: result.audioUrl,
          completedAt: now,
          updatedAt: now
        })
        .where(eq(mediaTasks.id, taskId));
      
      // 如果有转录结果，创建转录记录
      if (result.transcription && result.transcription.segments.length > 0) {
        const transcriptionId = crypto.randomUUID();
        
        // 创建转录记录
        await db.insert(transcriptions).values({
          id: transcriptionId,
          taskId: taskId,
          targetLanguage: result.transcription.targetLanguage,
          style: result.transcription.style,
          totalSegments: result.transcription.segments.length,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          createdAt: now
        });
        
        // 更新媒体任务的转录ID
        await db.update(mediaTasks)
          .set({
            transcriptionId: transcriptionId,
            updatedAt: now
          })
          .where(eq(mediaTasks.id, taskId));
        
        // 批量插入转录片段
        const segments = result.transcription.segments.map(segment => ({
          transcriptionId: transcriptionId,
          sequence: segment.sequence,
          start: segment.start,
          end: segment.end,
          contentType: segment.contentType,
          speaker: segment.speaker,
          original: segment.original,
          translation: segment.translation,
          createdAt: now
        }));
        
        // 分批插入以避免单次插入过多数据
        const batchSize = 50;
        for (let i = 0; i < segments.length; i += batchSize) {
          const batch = segments.slice(i, i + batchSize);
          await db.insert(transcriptionSegments).values(batch);
        }
        
        console.log(`转录结果已保存: ${segments.length} 个片段`);
      }
      
    } else if (status === 'failed') {
      // 处理失败的回调
      const now = Date.now();
      
      await db.update(mediaTasks)
        .set({
          status: 'failed',
          progress: 0,
          error: error?.message || 'Workflow processing failed',
          errorDetails: error?.stack || null,
          updatedAt: now
        })
        .where(eq(mediaTasks.id, taskId));
      
      console.error(`任务失败: ${taskId}, 错误: ${error?.message}`);
    }
    
    return Response.json({ success: true });
    
  } catch (error) {
    console.error('Workflow callback error:', error);
    return Response.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}