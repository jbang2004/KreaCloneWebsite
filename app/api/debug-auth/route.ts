import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // 获取当前session
    const session = await auth();
    
    // 获取请求headers
    const headers = Object.fromEntries(request.headers.entries());
    
    // 获取cookies
    const cookies = request.headers.get('cookie');
    
    // 获取URL信息
    const url = new URL(request.url);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: session,
      hasSession: !!session,
      hasUser: !!session?.user,
      userInfo: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      } : null,
      request: {
        url: url.href,
        origin: url.origin,
        pathname: url.pathname,
        userAgent: headers['user-agent'],
        referer: headers['referer'],
      },
      cookies: {
        raw: cookies,
        parsed: cookies ? Object.fromEntries(
          cookies.split(';').map(c => {
            const [key, ...value] = c.trim().split('=');
            return [key, value.join('=')];
          })
        ) : {},
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextjsEnv: process.env.NEXTJS_ENV,
      }
    });
  } catch (error: any) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}