import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { pluginSchema } from '@/lib/validation';
import { successResponse, errorResponse, parsePagination } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/plugins
 * 获取插件列表（仅已通过审核的）
 * 支持分页、搜索、分类筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { page, limit } = parsePagination(request.nextUrl);
    const search = request.nextUrl.searchParams.get('search') || '';
    const category = request.nextUrl.searchParams.get('category') || '';

    const where: any = { status: 'APPROVED' };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const skip = (page - 1) * limit;

    const [plugins, total] = await prisma.$transaction([
      prisma.plugin.findMany({
        where,
        include: { user: { select: { username: true, avatar: true } } },
        orderBy: { downloads: 'desc' },
        skip,
        take: limit,
      }),
      prisma.plugin.count({ where }),
    ]);

    return successResponse({
      data: plugins,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('获取插件列表失败:', error);
    return successResponse({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
  }
}

/**
 * POST /api/plugins
 * 发布插件（需登录）
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse('请先登录', 401);
    }

    const body = await request.json();
    const validationResult = pluginSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse('数据验证失败', 400, validationResult.error.errors);
    }

    const { name, description, category, price } = validationResult.data;

    const plugin = await prisma.plugin.create({
      data: {
        name,
        description,
        category,
        price,
        coverImage: body.coverImage || '',
        fileUrl: body.fileUrl || '',
        userId,
        status: 'PENDING',
      },
    });

    return successResponse(plugin, '插件提交成功，等待审核', 201);
  } catch (error) {
    console.error('发布插件失败:', error);
    return errorResponse('发布插件失败', 500);
  }
}
