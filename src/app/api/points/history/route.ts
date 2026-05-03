import { NextRequest } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { getPointsHistory } from '@/lib/points';
import { successResponse, errorResponse, parsePagination } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/points/history
 * 获取当前用户积分交易历史
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse('请先登录', 401);
    }

    const { page, limit } = parsePagination(request.nextUrl);
    const history = await getPointsHistory(userId, page, limit);

    return successResponse(history);
  } catch (error) {
    console.error('获取积分历史失败:', error);
    return errorResponse('获取积分历史失败', 500);
  }
}
