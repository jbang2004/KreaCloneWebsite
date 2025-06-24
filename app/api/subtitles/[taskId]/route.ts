import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '@/db/drizzle';
import { sentences } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { verifyAuth } from '@/lib/auth/verify-request';

function getDb() {
  if (typeof globalThis.process === 'undefined') {
    // @ts-expect-error - Cloudflare Workers global variables
    return createDb(globalThis.DB || globalThis.env?.DB);
  }
  return createDb({} as any);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { taskId } = await params;
    const subtitles = await db.query.sentences.findMany({
      where: eq(sentences.taskId, taskId),
      orderBy: [asc(sentences.sentenceIndex)],
    });

    return NextResponse.json({ sentences: subtitles });
  } catch (error) {
    console.error('Get subtitles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as any;
    const { taskId } = await params;
    const db = getDb();
    const now = new Date();
    
    // 如果是清空操作
    if (body.action === 'clear') {
      await db.update(sentences)
        .set({ 
          transText: null,
          updatedAt: now
        })
        .where(eq(sentences.taskId, taskId));
      
      return NextResponse.json({ success: true });
    }
    
    // 如果是更新单个字幕
    const { sentenceId, newTranslation } = body;
    
    if (!sentenceId || typeof newTranslation !== 'string') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    
    await db.update(sentences)
      .set({ 
        transText: newTranslation,
        updatedAt: now
      })
      .where(eq(sentences.id, sentenceId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update subtitle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 