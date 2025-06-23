import { integer, text, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from 'next-auth/adapters';

// 1. NextAuth.js v5 Adapter 需要的表结构
export const users = sqliteTable('users', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  hashedPassword: text('hashedPassword'), // 用于邮箱/密码登录
});

export const accounts = sqliteTable('accounts', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccount['type']>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

export const sessions = sqliteTable('sessions', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// 2. 业务数据表
export const videos = sqliteTable('videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('fileName').notNull(),
  storagePath: text('storagePath').notNull(),
  bucketName: text('bucketName').notNull(),
  status: text('status').notNull(), // 'pending', 'preprocessed', 'completed', 'error'
  videoWidth: integer('videoWidth'),
  videoHeight: integer('videoHeight'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taskId: text('taskId').notNull().unique(),
  videoId: integer('videoId').notNull().references(() => videos.id, { onDelete: 'cascade' }),
  status: text('status').notNull(), // 'pending', 'preprocessed', 'completed', 'error'
  hlsPlaylistUrl: text('hlsPlaylistUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const sentences = sqliteTable('sentences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taskId: text('taskId').notNull().references(() => tasks.taskId, { onDelete: 'cascade' }),
  sentenceIndex: integer('sentenceIndex').notNull(),
  rawText: text('rawText').notNull(),
  transText: text('transText'),
  startMs: integer('startMs').notNull(),
  endMs: integer('endMs').notNull(),
  speakerId: integer('speakerId'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
}); 