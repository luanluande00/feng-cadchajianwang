import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plugin = await prisma.plugin.findUnique({
      where: { id: params.id },
      include: { user: { select: { id: true, username: true, avatar: true, totalEarned: true } } },
    });
    if (!plugin) return errorResponse('插件不存在', 404);
    return successResponse(plugin);
  } catch (error) {
    console.error('获取插件详情失败:', error);
    return errorResponse('获取插件详情失败', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('请先登录', 401);
    const plugin = await prisma.plugin.findUnique({ where: { id: params.id } });
    if (!plugin) return errorResponse('插件不存在', 404);
    if (plugin.userId !== userId) return errorResponse('无权操作', 403);
    const body = await request.json();
    const updatedPlugin = await prisma.plugin.update({
      where: { id: params.id },
      data: { name: body.name || plugin.name, description: body.description || plugin.description, price: body.price !== undefined ? body.price : plugin.price, coverImage: body.coverImage || plugin.coverImage },
    });
    return successResponse(updatedPlugin, '更新成功');
  } catch (error) {
    console.error('更新插件失败:', error);
    return errorResponse('更新插件失败', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('请先登录', 401);
    const plugin = await prisma.plugin.findUnique({ where: { id: params.id } });
    if (!plugin) return errorResponse('插件不存在', 404);
    if (plugin.userId !== userId) return errorResponse('无权操作', 403);
    await prisma.plugin.delete({ where: { id: params.id } });
    return successResponse(null, '删除成功');
  } catch (error) {
    console.error('删除插件失败:', error);
    return errorResponse('删除插件失败', 500);
  }
}
