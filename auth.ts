import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const { handlers, auth, signIn, signOut } = NextAuth(async (request) => {
  // 获取Cloudflare环境
  const context = await getCloudflareContext({ async: true });
  const env = context.env as any;
  
  if (!env.DB) {
    throw new Error('D1 Database binding not found');
  }

  // 动态获取当前域名 - 优先使用request中的域名，回退到环境变量
  let baseUrl = 'https://krea-clone-website.jbang20042004.workers.dev'; // 默认worker域名
  
  // 如果有request对象，从中获取实际访问的域名
  if (request) {
    try {
      const url = new URL(request.url);
      const currentHost = url.origin;
      
      // 如果是worker默认域名或自定义域名，都使用当前域名
      if (currentHost.includes('workers.dev') || currentHost.includes('waveshift.net')) {
        baseUrl = currentHost;
      }
    } catch (error) {
      console.error('Error parsing request URL:', error);
    }
  }
  
  // 如果有环境变量设置，优先使用（用于自定义域名场景）
  if (env.AUTH_URL || env.NEXTAUTH_URL) {
    baseUrl = env.AUTH_URL || env.NEXTAUTH_URL;
  }
  
  console.log('NextAuth baseUrl:', baseUrl);

  return {
    // 移除adapter，使用JWT session支持所有provider
    // adapter: createHybridAdapter(env.DB), // JWT不需要adapter
    
    // 明确设置secret
    secret: env.AUTH_SECRET || env.NEXTAUTH_SECRET,
    
    providers: [
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET || 'placeholder-for-development',
      }),
      
      Credentials({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
          action: { label: 'Action', type: 'text' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;
          const action = credentials.action as string;

          try {
            if (action === 'register') {
              // 检查用户是否已存在 - 使用简化的用户表
              const existingUser = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
              if (existingUser) {
                throw new Error('User with this email already exists');
              }

              if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
              }

              const hashedPassword = await bcrypt.hash(password, 10);
              const userId = crypto.randomUUID();

              // 创建用户记录 - 使用简化结构
              await env.DB.prepare(`
                INSERT INTO users (id, email, name, hashedPassword)
                VALUES (?, ?, ?, ?)
              `).bind(userId, email, email.split('@')[0], hashedPassword).run();

              console.log('User registered successfully:', { userId, email });
              return {
                id: userId,
                email: email,
                name: email.split('@')[0],
              };
            } else {
              // 登录逻辑 - 查询用户表
              const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
              if (!user || !user.hashedPassword) {
                return null;
              }

              const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
              if (!isPasswordValid) {
                return null;
              }

              console.log('User logged in successfully:', { userId: user.id, email: user.email });
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              };
            }
          } catch (error) {
            console.error('Authorization error:', error);
            return null;
          }
        },
      }),
    ],
    
    // 使用JWT session策略 - 兼容所有provider
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    
    // JWT session的callbacks
    callbacks: {
      async jwt({ token, user, account, profile }) {
        // 初次登录时，将用户信息添加到token
        if (user) {
          console.log('JWT callback - Adding user to token:', { userId: user.id, email: user.email });
          token.sub = user.id; // 使用标准的sub字段存储用户ID
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image; // 使用标准的picture字段存储头像
        }
        console.log('JWT token contents:', { sub: token.sub, email: token.email, name: token.name });
        return token;
      },
      
      async session({ session, token }) {
        // 将token中的用户信息传递给session
        if (token && session.user) {
          console.log('Session callback - Adding token to session:', { tokenSub: token.sub, email: token.email });
          session.user.id = token.sub as string; // 从sub字段获取用户ID
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.image = token.picture as string;
        }
        console.log('Session user contents:', session.user);
        return session;
      },
      
      async redirect({ url, baseUrl: callbackBaseUrl }) {
        // 确保重定向URL正确
        console.log('Redirect callback:', { url, callbackBaseUrl, configuredBaseUrl: baseUrl });
        
        // 优先使用配置的baseUrl，回退到callback提供的baseUrl
        const productionBaseUrl = baseUrl || callbackBaseUrl;
        
        // 如果是相对路径，使用baseUrl
        if (url.startsWith('/')) {
          return `${productionBaseUrl}${url}`;
        }
        
        // 如果是同域名，允许重定向
        try {
          if (new URL(url).origin === productionBaseUrl) {
            return url;
          }
        } catch (e) {
          console.error('Invalid URL in redirect:', url);
        }
        
        // 默认重定向到首页
        return productionBaseUrl;
      },
    },
    
    pages: {
      signIn: '/auth',
      error: '/auth/error',
    },
    
    // 信任主机，用于Cloudflare Workers环境
    trustHost: true,
    
    // 启用调试以便排查问题
    debug: true,
  };
}); 