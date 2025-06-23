import NextAuth from 'next-auth';
import { D1Adapter } from '@auth/d1-adapter';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// 查找用户
async function findUserByEmail(db: any, email: string) {
  try {
    const result = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    return result;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

async function createUserWithCredentials(db: any, userData: {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
}) {
  try {
    // 将 hashedPassword 存储在 users 表中
    await db.prepare(`
      INSERT INTO users (id, email, name, emailVerified, image, hashedPassword)
      VALUES (?, ?, ?, NULL, NULL, ?)
    `).bind(
      userData.id,
      userData.email,
      userData.name,
      userData.hashedPassword
    ).run();

    // 创建标准的 credentials account 记录（不包含 hashedPassword）
    await db.prepare(`
      INSERT INTO accounts (userId, type, provider, providerAccountId)
      VALUES (?, ?, ?, ?)
    `).bind(
      userData.id,
      'credentials',
      'credentials',
      userData.email
    ).run();

    const newUser = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userData.id).first();
    return newUser;
  } catch (error) {
    console.error('Error creating user with credentials:', error);
    throw error;
  }
}

// 延迟初始化配置
export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  try {
    const { env } = await getCloudflareContext({ async: true }) as any;
    
    if (!env?.DB) {
      console.error('D1 Database binding not found');
      throw new Error('D1 Database binding not found');
    }

    // 将数据库连接保存到变量中，供后续使用
    const database = env.DB;

    return {
      secret: env.NEXTAUTH_SECRET || env.AUTH_SECRET || 'fallback-secret-key',
      adapter: D1Adapter(database),
      
      session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      
      providers: [
        Google({
          clientId: env.GOOGLE_CLIENT_ID || '',
          clientSecret: env.GOOGLE_CLIENT_SECRET || '',
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
              // 直接使用已经获取的数据库连接，而不是重新获取Cloudflare上下文
              if (!database) {
                throw new Error('Database connection not available');
              }

              if (action === 'register') {
                // 检查用户是否已存在
                const existingUser = await findUserByEmail(database, email);
                if (existingUser) {
                  throw new Error('User with this email already exists');
                }

                if (password.length < 6) {
                  throw new Error('Password must be at least 6 characters long');
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const userId = crypto.randomUUID();

                const newUser = await createUserWithCredentials(database, {
                  id: userId,
                  email: email,
                  name: email.split('@')[0],
                  hashedPassword: hashedPassword,
                });

                return {
                  id: newUser.id,
                  email: newUser.email,
                  name: newUser.name,
                  image: newUser.image,
                };
              } else {
                // 登录逻辑
                const user = await findUserByEmail(database, email);
                if (!user) {
                  return null;
                }

                // 检查用户是否有 hashedPassword（邮箱/密码注册的用户）
                if (!user.hashedPassword) {
                  return null;
                }

                const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
                if (!isPasswordValid) {
                  return null;
                }

                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                };
              }
            } catch (error) {
              console.error('Authorization error:', error);
              throw error;
            }
          },
        }),
      ],
      
      callbacks: {
        async jwt({ token, user }) {
          // 将用户信息存储到JWT token中
          if (user) {
            token.sub = user.id;
            token.email = user.email;
            token.name = user.name;
            token.picture = user.image;
          }
          return token;
        },
        async session({ session, token }) {
          // 从JWT token中获取用户信息
          if (token) {
            session.user.id = token.sub as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            session.user.image = token.picture as string;
          }
          return session;
        },
      },
      
      pages: {
        signIn: '/auth',
        error: '/auth/error',
      },
      
      trustHost: true,
    };
  } catch (error) {
    console.error('Error creating auth config:', error);
    throw error;
  }
}); 