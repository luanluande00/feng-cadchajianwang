import { NextRequest } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { errorResponse } from '@/lib/api-helpers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// 最大文件大小：图片5MB，视频10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
  };
  return map[mimeType] || '';
}

/**
 * POST /api/upload
 * 文件上传接口
 * 支持图片（jpg/png/gif/webp, 最大5MB）和视频（mp4/webm, 最大10MB）
 * FormData 字段: file, type (image|video)
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

    // 验证文件类型
    if (fileType === 'image') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return errorResponse('图片仅支持 JPG、PNG、GIF、WebP 格式', 400);
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return errorResponse('图片大小不能超过5MB', 400);
      }
    } else if (fileType === 'video') {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return errorResponse('视频仅支持 MP4、WebM 格式', 400);
      }
      if (file.size > MAX_VIDEO_SIZE) {
        return errorResponse('视频大小不能超过10MB', 400);
      }
    } else if (fileType === 'plugin') {
      // 插件文件：不限制类型，最大50MB
      if (file.size > 50 * 1024 * 1024) {
        return errorResponse('插件文件大小不能超过50MB', 400);
      }
    } else {
      return errorResponse('不支持的文件类型', 400);
    }

    // 生成唯一文件名
    const ext = getExtension(file.type) || path.extname(file.name);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${userId}_${timestamp}_${randomStr}${ext}`;

    // 确定存储目录
    const subDir = fileType === 'video' ? 'videos' : fileType === 'plugin' ? 'plugins' : 'images';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);

    // 确保目录存在
    await mkdir(uploadDir, { recursive: true });

    // 写入文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // 返回文件URL
    const url = `/uploads/${subDir}/${fileName}`;

    return Response.json({
      success: true,
      message: '上传成功',
      data: { url, name: file.name, size: file.size, type: file.type },
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    return errorResponse('文件上传失败', 500);
  }
}
