import { up } from '@auth/d1-adapter';
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: NextRequest) {
  try {
    // 获取Cloudflare环境
    const context = await getCloudflareContext({ async: true });
    const env = context.env as any;
    
    if (!env.DB) {
      throw new Error('D1 Database binding not found');
    }

    // 创建简化的用户表，支持JWT session
    try {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT,
          image TEXT,
          hashedPassword TEXT,
          emailVerified DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `).run();
      console.log('Created users table');
    } catch (error) {
      console.log('Error creating users table:', error);
    }

    return NextResponse.json({ 
      message: 'Database migration completed successfully (JWT Session)',
      tables: ['users'],
      note: 'Using JWT sessions - no session tables needed'
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}

// 获取数据库状态的辅助端点
export async function POST(request: NextRequest) {
  try {
    const context = await getCloudflareContext({ async: true });
    const env = context.env as any;
    
    if (!env.DB) {
      throw new Error('D1 Database binding not found');
    }

    // 检查用户表是否存在
    const tables = await env.DB.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name = 'users';
    `).all();

    // 检查users表结构
    const userTableInfo = await env.DB.prepare(`
      PRAGMA table_info(users);
    `).all();

    // 检查用户数量
    const userCount = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM users;
    `).first();

    return NextResponse.json({
      existingTables: tables.results.map((t: any) => t.name),
      userTableStructure: userTableInfo.results,
      userCount: userCount?.count || 0,
      sessionStrategy: 'JWT'
    });
  } catch (error: any) {
    console.error('Database check error:', error);
    return NextResponse.json({ 
      error: 'Database check failed', 
      details: error.message 
    }, { status: 500 });
  }
}