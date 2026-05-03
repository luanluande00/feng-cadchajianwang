import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/verify
 * 邮箱验证接口
 * 通过URL参数中的token验证用户邮箱
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return errorResponse('验证链接无效', 400);
    }

    // 查找匹配的用户
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return errorResponse('验证链接已过期或无效', 400);
    }

    // 更新用户验证状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return successResponse({ verified: true }, '邮箱验证成功');
  } catch (error) {
    console.error('邮箱验证失败:', error);
    return errorResponse('验证失败，请稍后重试', 500);
  }
}
