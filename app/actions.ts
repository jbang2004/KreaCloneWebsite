'use server';

import { signIn, signOut, auth } from '@/auth';
import { createDb } from '@/db/drizzle';
import { videos, tasks, sentences } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// NextAuth.js Server Actions for authentication and data operations

// 获取数据库实例（用于业务逻辑，不用于认证）
function getDb() {
  if (typeof globalThis.process === 'undefined') {
    // 在 Cloudflare Workers 环境中
    // @ts-expect-error - Cloudflare Workers global variables
    const d1Instance = globalThis.env?.DB || globalThis.DB;
    if (!d1Instance) {
      throw new Error('D1 database not available');
    }
    return createDb(d1Instance);
  }
  
  // 开发环境模拟
  // @ts-expect-error - Development environment global variables
  if (!globalThis.__db) {
    throw new Error('D1 database not available in development environment');
  }
  // @ts-expect-error - Development environment global variables
  return createDb(globalThis.__db);
}

// 认证相关 Actions

export async function signInWithGoogle() {
  await signIn('google', { redirectTo: '/' });
}

export async function doSignOut() {
  await signOut({
    redirectTo: '/',
  });
}

export async function signInWithCredentials(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      action: 'login',
      redirectTo: '/',
    });
    
    return { success: false, error: 'Invalid credentials' };
  } catch (error: any) {
    // 如果是NextAuth的重定向，这是成功的情况
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      return;
    }
    
    // 处理具体的认证错误
    if (error?.type === 'CredentialsSignin') {
      return { 
        success: false, 
        error: 'Invalid email or password' 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}

export async function signUpWithCredentials(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      action: 'register',
      redirectTo: '/',
    });
    
    return { success: false, error: 'Registration failed' };
  } catch (error: any) {
    // 如果是NextAuth的重定向，这是成功的情况
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      return;
    }
    
    // 处理具体的注册错误
    if (error?.type === 'CallbackRouteError' || error?.name === 'CallbackRouteError') {
      const cause = error?.cause;
      const errorMessage = cause?.message || error?.message || '';
      
      if (errorMessage.includes('User with this email already exists') || 
          errorMessage.includes('already exists')) {
        return { 
          success: false, 
          error: 'An account with this email already exists' 
        };
      }
      if (errorMessage.includes('Password must be at least')) {
        return { 
          success: false, 
          error: 'Password must be at least 6 characters long' 
        };
      }
      
      return { 
        success: false, 
        error: cause?.message || error?.message || 'Registration failed' 
      };
    }
    
    // 检查错误消息内容，即使不是CallbackRouteError
    const errorMessage = error?.message || '';
    if (errorMessage.includes('User with this email already exists') || 
        errorMessage.includes('already exists')) {
      return { 
        success: false, 
        error: 'An account with this email already exists' 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    };
  }
}

// 视频相关 Actions

export async function createVideoRecord(videoData: {
  fileName: string;
  storagePath: string;
  bucketName: string;
  videoWidth?: number;
  videoHeight?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    const db = getDb();
    const now = new Date();
    
    const result = await db.insert(videos).values({
      userId: session.user.id,
      fileName: videoData.fileName,
      storagePath: videoData.storagePath,
      bucketName: videoData.bucketName,
      status: 'pending',
      videoWidth: videoData.videoWidth,
      videoHeight: videoData.videoHeight,
      createdAt: now,
      updatedAt: now,
    }).returning({ id: videos.id });

    return { success: true, videoId: result[0].id };
  } catch (error) {
    console.error('Create video record error:', error);
    return { error: 'Database error' };
  }
}

export async function getVideosByUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    const db = getDb();
    const userVideos = await db.query.videos.findMany({
      where: eq(videos.userId, session.user.id),
      orderBy: [desc(videos.createdAt)],
    });

    return { success: true, videos: userVideos };
  } catch (error) {
    console.error('Get videos error:', error);
    return { error: 'Database error' };
  }
}

// 任务相关 Actions

export async function createTask(taskData: {
  taskId: string;
  videoId: number;
  status: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    const db = getDb();
    const now = new Date();
    
    const result = await db.insert(tasks).values({
      taskId: taskData.taskId,
      videoId: taskData.videoId,
      status: taskData.status,
      createdAt: now,
      updatedAt: now,
    }).returning({ id: tasks.id });

    return { success: true, taskId: result[0].id };
  } catch (error) {
    console.error('Create task error:', error);
    return { error: 'Database error' };
  }
}

export async function updateTaskStatus(taskId: string, status: string, hlsPlaylistUrl?: string) {
  try {
    const db = getDb();
    const now = new Date();
    
    await db.update(tasks)
      .set({ 
        status, 
        hlsPlaylistUrl,
        updatedAt: now 
      })
      .where(eq(tasks.taskId, taskId));

    return { success: true };
  } catch (error) {
    console.error('Update task status error:', error);
    return { error: 'Database error' };
  }
}

// 字幕相关 Actions

export async function updateSubtitleTranslation(id: number, newTranslation: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    const db = getDb();
    const now = new Date();
    
    await db.update(sentences)
      .set({ 
        transText: newTranslation,
        updatedAt: now
      })
      .where(eq(sentences.id, id));

    return { success: true };
  } catch (error) {
    console.error('Update subtitle error:', error);
    return { error: 'Database error' };
  }
}

 