import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/payment/callback
 * 支付回调处理接口
 */
export async function POST() {
  try {
    return successResponse(null, '回调处理成功');
  } catch (error) {
    console.error('支付回调失败:', error);
    return errorResponse('回调处理失败', 500);
  }
}
