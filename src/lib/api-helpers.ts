/**
 * API响应成功辅助函数
 * @param data 响应数据
 * @param message 响应消息
 * @param status HTTP状态码
 * @returns Response对象
 */
export function successResponse(data: any, message = 'success', status = 200): Response {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * API响应错误辅助函数
 * @param message 错误消息
 * @param status HTTP状态码
 * @param errors 详细错误信息
 * @returns Response对象
 */
export function errorResponse(
  message: string,
  status = 400,
  errors?: any
): Response {
  return Response.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}

/**
 * 从URL提取查询参数
 * @param url URL对象
 * @param key 参数名
 * @returns 参数值或null
 */
export function getQueryParam(url: URL, key: string): string | null {
  return url.searchParams.get(key);
}

/**
 * 分页参数解析
 * @param url URL对象
 * @returns { page, limit }
 */
export function parsePagination(url: URL): { page: number; limit: number } {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
  };
}
