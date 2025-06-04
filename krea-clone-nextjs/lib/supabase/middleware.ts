// @ts-nocheck
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value }: any) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }: any) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 获取用户信息
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 定义需要认证保护的路由（与原项目的 ProtectedRoute 逻辑一致）
  const protectedRoutes = [
    '/audio-transcription',
    '/text-to-speech', 
    '/video-translation'
  ];

  // 定义公开路由（不需要认证）
  const publicRoutes = [
    '/',
    '/auth',
    '/auth/login',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/confirm',
    '/auth/error',
    '/auth/sign-up-success',
    '/auth/update-password',
    '/pricing'
  ];

  const pathname = request.nextUrl.pathname;

  // 检查是否为受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // 如果是受保护的路由且用户未登录，重定向到认证页面
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // 如果用户已登录且访问认证页面，重定向到首页
  if (user && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/sign-up') || pathname === '/auth')) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}