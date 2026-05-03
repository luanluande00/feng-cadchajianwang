import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { handlePluginDownload } from '@/lib/points';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('请先登录', 401);
    const plugin = await prisma.plugin.findUnique({ where: { id: params.id } });
    if (!plugin) return errorResponse('插件不存在', 404);
    if (plugin.status !== 'APPROVED') return errorResponse('插件不可用', 400);
    if (plugin.userId === userId) return errorResponse('不能下载自己的插件', 400);
    const existing = await prisma.download.findFirst({ where: { userId, pluginId: params.id } });
    if (existing) return successResponse({ downloadUrl: plugin.fileUrl }, '已下载过，可直接使用');
    await handlePluginDownload(userId, plugin.userId, params.id, plugin.price);
    return successResponse({ downloadUrl: plugin.fileUrl }, '下载成功');
  } catch (error: any) {
    console.error('下载插件失败:', error);
    return errorResponse(error.message || '下载失败', 400);
  }
}
