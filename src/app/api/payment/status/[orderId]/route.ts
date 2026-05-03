import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const order = await prisma.paymentOrder.findUnique({ where: { id: params.orderId } });
    if (!order) return errorResponse('订单不存在', 404);
    return successResponse(order);
  } catch (error) {
    console.error('查询订单失败:', error);
    return errorResponse('查询订单失败', 500);
  }
}
