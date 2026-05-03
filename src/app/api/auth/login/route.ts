import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/login
 * 用户登录接口
 * 1. 验证请求数据
 * 2. 查找用户（支持邮箱或用户名登录）
 * 3. 验证密码
 * 4. 检查邮箱是否已验证
 * 5. 生成Token并设置Cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求数据
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse('数据验证失败', 400, validationResult.error.errors);
    }

    const { emailOrUsername, password } = validationResult.data;

    // 查找用户（支持邮箱或用户名）
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!user) {
      return errorResponse('账号或密码错误', 401);
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse('账号或密码错误', 401);
    }

    // 检查邮箱是否已验证
    if (!user.isVerified) {
      return errorResponse('请先验证邮箱', 403, { needVerify: true });
    }

    // 生成Token并设置Cookie
    const token = generateToken(user.id);

    const response = successResponse(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        points: user.points,
        role: user.role,
      },
      '登录成功'
    );

    await setAuthCookie(token);

    return response;
  } catch (error) {
    console.error('登录失败:', error);
    return errorResponse('登录失败，请稍后重试', 500);
  }
}
