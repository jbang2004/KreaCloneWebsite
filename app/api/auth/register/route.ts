import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Password } from '@/lib/auth/password';
import { AuthTokens } from '@/lib/auth/jwt';
import { z } from 'zod';

// 验证注册输入
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
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
    console.log('Request body received:', body);
    
    // 验证输入
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // 初始化数据库
    const db = drizzle(env.DB);

    // 检查用户是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // 验证密码强度
    const passwordValidation = Password.isValid(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await Password.hash(password);

    // 生成用户ID
    const userId = crypto.randomUUID();

    // 创建用户
    const now = new Date();
    const newUser = {
      id: userId,
      email,
      name,
      hashedPassword,
      emailVerified: null,
      image: null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(users).values(newUser).run();

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
        sub: userId,
        email,
        name,
      },
      jwtSecret
    );

    const refreshToken = await AuthTokens.generateRefreshToken(userId, jwtSecret);

    // 返回成功响应
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: userId,
          email,
          name,
        },
        accessToken,
      },
      { status: 201 }
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}