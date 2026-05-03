import { NextRequest } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { paymentSchema } from '@/lib/validation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('请先登录', 401);

    const body = await request.json();
    const validationResult = paymentSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse('数据验证失败', 400, validationResult.error.errors);
    }

    const { amount } = validationResult.data;
    const points = amount; // 1元 = 1积分

    const order = await prisma.paymentOrder.create({
      data: { userId, amount, points, status: 'PENDING' },
    });

    return successResponse({ orderId: order.id, amount, points }, '订单创建成功');
  } catch (error) {
    console.error('创建支付订单失败:', error);
    return errorResponse('创建支付订单失败', 500);
  }
}
