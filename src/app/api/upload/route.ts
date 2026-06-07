import { NextRequest } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB for base64 storage
const MAX_PLUGIN_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * POST /api/upload
 * 文件上传接口 - 图片转为 base64 data URL 返回
 * 前端直接将 data URL 存入数据库字段
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return errorResponse('请先登录', 401);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fileType = (formData.get('type') as string) || 'image';

    if (!file) {
      return errorResponse('请选择文件', 400);
    }

    if (fileType === 'image') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return errorResponse('图片仅支持 JPG、PNG、GIF、WebP 格式', 400);
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return errorResponse('图片大小不能超过2MB', 400);
      }

      // 转为 base64 data URL
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return Response.json({
        success: true,
        message: '上传成功',
        data: { url: dataUrl, name: file.name, size: file.size, type: file.type },
      });
    }

    if (fileType === 'video') {
      return errorResponse('视频上传需要云存储支持，请使用视频链接代替', 400);
    }

    if (fileType === 'plugin') {
      if (file.size > MAX_PLUGIN_SIZE) {
        return errorResponse('插件文件大小不能超过10MB', 400);
      }

      // 插件文件也转为 base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;

      return Response.json({
        success: true,
        message: '上传成功',
        data: { url: dataUrl, name: file.name, size: file.size, type: file.type },
      });
    }

    return errorResponse('不支持的文件类型', 400);
  } catch (error) {
    console.error('文件上传失败:', error);
    return errorResponse('文件上传失败', 500);
  }
}
