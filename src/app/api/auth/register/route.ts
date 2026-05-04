import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { sendVerificationEmail } from '@/lib/email';
import { addPoints, REGISTER_BONUS } from '@/lib/points';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse('数据验证失败', 400, validationResult.error.errors);
    }

    const { email, username, password } = validationResult.data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return errorResponse('该邮箱已被注册', 409);
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return errorResponse('该用户名已被使用', 409);
    }

    const hashedPassword = await hashPassword(password);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiry,
      },
    });

    await addPoints(user.id, REGISTER_BONUS, 'BONUS', '注册奖励');

    let emailSent = false;
    try {
      const result = await Promise.race([
        sendVerificationEmail(email, verifyToken).then(() => 'sent'),
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error('EMAIL_TIMEOUT')), 3000)),
      ]);
      emailSent = result === 'sent';
    } catch {
      emailSent = false;
    }

    if (!emailSent) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verifyToken: null, verifyTokenExpiry: null },
      });
    }

    const token = generateToken(user.id);
    const response = successResponse(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        points: REGISTER_BONUS,
        autoVerified: !emailSent,
      },
      emailSent ? '注册成功，请查收验证邮件' : '注册成功（开发模式自动验证）'
    );

    await setAuthCookie(token);
    return response;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('注册失败:', errMsg);
    return errorResponse(`注册失败: ${errMsg}`, 500);
  }
}
