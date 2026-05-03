import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

/**
 * JWT Token过期时间（7天）
 */
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * JWT密钥
 */
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

/**
 * Cookie名称
 */
const COOKIE_NAME = 'auth_token';

/**
 * 生成JWT Token
 * @param userId 用户ID
 * @returns JWT Token字符串
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

/**
 * 验证JWT Token
 * @param token JWT Token字符串
 * @returns 解码后的payload，验证失败返回null
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

/**
 * 密码加密
 * @param password 原始密码
 * @returns 加密后的密码哈希
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * 验证密码
 * @param password 原始密码
 * @param hashedPassword 加密后的密码哈希
 * @returns 密码是否匹配
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 设置认证Cookie
 * @param token JWT Token
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

/**
 * 清除认证Cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * 从Cookie获取Token
 * @returns JWT Token字符串或null
 */
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * 获取当前认证的用户ID
 * @returns 用户ID或null
 */
export async function getCurrentUserId(): Promise<string | null> {
  const token = await getTokenFromCookie();
  if (!token) return null;
  
  const payload = verifyToken(token);
  return payload?.userId || null;
}
