import { NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { AuthTokens, type JWTPayload } from './jwt';

export async function verifyAuth(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // 获取Cloudflare环境
    const context = await getCloudflareContext({ async: true });
    const env = context.env as any;
    
    // 从cookies获取令牌
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      return null;
    }
    
    // 验证令牌
    const jwtSecret = env.JWT_SECRET || env.AUTH_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return null;
    }
    
    const payload = await AuthTokens.verifyAccessToken(token, jwtSecret);
    return payload;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}