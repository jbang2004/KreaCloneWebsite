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
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // 包含cookies
      });

      if (response.ok) {
        const data: { user: User } = await response.json();
        setUser(data.user);
      } else {
        // 没有有效的认证cookie
        setUser(null);
      }
    } catch (error) {
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

      // 设置用户状态（token已通过cookie设置）
      setUser(data.user);

      toast({
        title: '登录成功！',
        description: '正在重定向到首页...',
      });

      // 跳转到首页或之前访问的页面
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
      router.push(callbackUrl || '/');
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
    await fetchUser();
  };

  // 初始化时检查用户登录状态
  useEffect(() => {
    fetchUser();
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