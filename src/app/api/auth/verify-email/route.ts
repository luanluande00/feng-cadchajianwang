import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { emailSchema } from '@/lib/validation';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/verify-email
 * 发送验证邮件
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = emailSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse('数据验证失败', 400, validationResult.error.errors);
    }

    const { email } = validationResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    if (user.isVerified) {
      return errorResponse('邮箱已验证', 400);
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken, verifyTokenExpiry },
    });

    await sendVerificationEmail(email, verifyToken);

    return successResponse(null, '验证邮件已发送');
  } catch (error) {
    console.error('发送验证邮件失败:', error);
    return errorResponse('发送失败，请稍后重试', 500);
  }
}
