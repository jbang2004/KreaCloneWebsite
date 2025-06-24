import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Password } from '@/lib/auth/password';
import { AuthTokens } from '@/lib/auth/jwt';
import { z } from 'zod';

// 验证登录输入
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    // 获取Cloudflare环境
    const context = await getCloudflareContext({ async: true });
    const env = context.env as any;
    
    if (!env.DB) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    // 解析请求数据
    const body = await request.json();
    
    // 验证输入
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 初始化数据库
    const db = drizzle(env.DB);

    // 查找用户
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await Password.verify(password, user.hashedPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 获取JWT密钥
    const jwtSecret = env.JWT_SECRET || env.AUTH_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 生成JWT令牌
    const accessToken = await AuthTokens.generateAccessToken(
      {
        sub: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        image: user.image || undefined,
      },
      jwtSecret
    );

    const refreshToken = await AuthTokens.generateRefreshToken(user.id, jwtSecret);

    // 返回成功响应
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
        accessToken,
      },
      { status: 200 }
    );

    // 设置访问令牌为Cookie
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    // 设置刷新令牌为HttpOnly Cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}