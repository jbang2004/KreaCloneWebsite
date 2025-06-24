import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { AuthTokens } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // 获取Cloudflare环境
    const context = await getCloudflareContext({ async: true });
    const env = context.env as any;
    
    // 获取当前认证状态
    const token = request.cookies.get('access_token')?.value;
    let authInfo = null;
    
    if (token) {
      const jwtSecret = env.JWT_SECRET || env.AUTH_SECRET;
      if (jwtSecret) {
        const payload = await AuthTokens.verifyAccessToken(token, jwtSecret);
        if (payload) {
          authInfo = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            image: payload.image,
          };
        }
      }
    }
    
    // 获取请求headers
    const headers = Object.fromEntries(request.headers.entries());
    
    // 获取cookies
    const cookies = request.headers.get('cookie');
    
    // 获取URL信息
    const url = new URL(request.url);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authInfo: authInfo,
      hasAuth: !!authInfo,
      hasToken: !!token,
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
        hasJwtSecret: !!(env.JWT_SECRET || env.AUTH_SECRET),
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