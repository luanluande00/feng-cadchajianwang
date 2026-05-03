import { NextRequest } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { getPointsBalance } from '@/lib/points';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('请先登录', 401);
    const balance = await getPointsBalance(userId);
    return successResponse({ balance });
  } catch (error) {
    console.error('获取积分余额失败:', error);
    return errorResponse('获取积分余额失败', 500);
  }
}
