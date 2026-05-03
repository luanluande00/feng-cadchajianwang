import { NextRequest } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import prisma from '@/lib/prisma';
import { deductPoints } from '@/lib/points';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('请先登录', 401);

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount < 1000) return errorResponse('最低提现1000积分', 400);

    await deductPoints(userId, amount, '提现申请');

    return successResponse(null, '提现申请已提交');
  } catch (error: any) {
    return errorResponse(error.message || '提现失败', 400);
  }
}
