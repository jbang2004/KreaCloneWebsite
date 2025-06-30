'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // 获取当前用户信息（基于HttpOnly cookies）
  const fetchUser = useCallback(async (retryCount = 0) => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // 包含cookies
      });

      if (response.ok) {
        const data: { user: User } = await response.json();
        setUser(data.user);
      } else {
        // 如果是401且是首次尝试，可能是cookie同步延迟，重试一次
        if (response.status === 401 && retryCount === 0) {
          setTimeout(() => {
            fetchUser(1);
          }, 100);
          return;
        }
        // 没有有效的认证cookie
        setUser(null);
      }
    } catch (error) {
      // 如果是网络错误且是首次尝试，重试一次
      if (retryCount === 0) {
        setTimeout(() => {
          fetchUser(1);
        }, 100);
        return;
      }
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 包含cookies
        body: JSON.stringify({ email, password }),
      });

      const data: { user: User; accessToken?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // 立即设置用户状态（token已通过cookie设置）
      setUser(data.user);
      setIsLoading(false); // 确保loading状态也立即更新

      toast({
        title: '登录成功！',
        description: '欢迎回来！',
      });

      // 智能重定向：只有在登录页面或有明确回调时才重定向
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
      const currentPath = window.location.pathname;
      const isOnAuthPage = currentPath === '/auth' || currentPath.startsWith('/auth/');
      
      if (isOnAuthPage || callbackUrl) {
        // 立即重定向，不需要延迟（用户状态已经通过setUser设置）
        router.push(callbackUrl || '/');
      }
      // 如果不在登录页面，用户状态已经更新，UI会立即刷新
    } catch (error) {
      toast({
        title: '登录失败',
        description: error instanceof Error ? error.message : '请检查您的邮箱和密码',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // 注册
  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 包含cookies
        body: JSON.stringify({ email, password, name }),
      });

      const data: { user: User; accessToken?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // 设置用户状态（token已通过cookie设置）
      setUser(data.user);
      setIsLoading(false); // 确保loading状态也立即更新

      toast({
        title: '注册成功！',
        description: '正在重定向到首页...',
      });

      // 跳转到首页
      router.push('/');
    } catch (error) {
      toast({
        title: '注册失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // 包含cookies
      });

      // 清除用户状态
      setUser(null);

      toast({
        title: '已退出登录',
        description: '期待您的再次访问！',
      });

      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // 即使API调用失败，也清除用户状态
      setUser(null);
      router.push('/');
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    await fetchUser(0);
  };

  // 初始化时检查用户登录状态
  useEffect(() => {
    fetchUser(0);
  }, [fetchUser]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 使用认证上下文的钩子
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}