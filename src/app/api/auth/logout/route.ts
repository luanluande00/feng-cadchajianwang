import { NextRequest } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout
 * 用户登出接口
 * 清除认证Cookie
 */
export async function POST(request: NextRequest) {
  try {
    await clearAuthCookie();
    return successResponse(null, '登出成功');
  } catch (error) {
    console.error('登出失败:', error);
    return errorResponse('登出失败', 500);
  }
}
