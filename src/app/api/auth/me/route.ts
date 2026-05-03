import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, getCurrentUserId } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/me
 * 获取当前登录用户信息
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('未登录', 401);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        points: true,
        totalEarned: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) return errorResponse('用户不存在', 404);
    return successResponse(user);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return errorResponse('获取用户信息失败', 500);
  }
}

const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

/**
 * PUT /api/auth/me
 * 更新当前用户信息
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse('未登录', 401);
    }

    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse('数据验证失败', 400, validationResult.error.errors);
    }

    const { username, avatar, currentPassword, newPassword } = validationResult.data;
    const updateData: any = {};

    // 检查用户名是否可用
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, id: { not: userId } },
      });
      if (existing) {
        return errorResponse('该用户名已被使用', 409);
      }
      updateData.username = username;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar || null;
    }

    // 修改密码
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse('请输入当前密码', 400);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user) {
        return errorResponse('用户不存在', 404);
      }

      const bcrypt = await import('bcryptjs');
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return errorResponse('当前密码错误', 401);
      }

      updateData.password = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        points: true,
        role: true,
      },
    });

    return successResponse(updatedUser, '更新成功');
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return errorResponse('更新失败，请稍后重试', 500);
  }
}
