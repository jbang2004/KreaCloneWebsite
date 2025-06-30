import { type NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify-request';

export async function GET(request: NextRequest) {
  console.log('🔍 [DEBUG AUTH] Checking authentication status');
  
  // 检查cookies
  const cookies = request.cookies.getAll();
  console.log('🍪 [DEBUG AUTH] All cookies:', cookies);
  
  const accessToken = request.cookies.get('access_token')?.value;
  console.log('🔑 [DEBUG AUTH] Access token present:', !!accessToken);
  console.log('🔑 [DEBUG AUTH] Access token length:', accessToken?.length || 0);
  
  // 验证认证
  const authResult = await verifyAuth(request);
  console.log('✅ [DEBUG AUTH] Auth result:', authResult);
  
  return Response.json({
    hasAccessToken: !!accessToken,
    tokenLength: accessToken?.length || 0,
    authenticated: authResult.authenticated,
    user: authResult.user ? {
      id: authResult.user.id,
      email: authResult.user.email,
      name: authResult.user.name
    } : null,
    allCookies: cookies.map(c => ({ name: c.name, hasValue: !!c.value }))
  });
}