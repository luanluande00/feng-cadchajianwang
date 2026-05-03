import { z } from 'zod';

/**
 * 用户注册验证Schema
 */
export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名只能包含字母、数字、下划线和中文'),
  password: z
    .string()
    .min(6, '密码至少6个字符')
    .max(50, '密码最多50个字符'),
});

/**
 * 用户登录验证Schema
 */
export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, '请输入邮箱或用户名'),
  password: z.string().min(1, '请输入密码'),
});

/**
 * 邮箱验证Schema
 */
export const emailSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

/**
 * 插件发布验证Schema
 */
export const pluginSchema = z.object({
  name: z
    .string()
    .min(3, '插件名称至少3个字符')
    .max(100, '插件名称最多100个字符'),
  description: z
    .string()
    .min(10, '插件描述至少10个字符')
    .max(5000, '插件描述最多5000个字符'),
  category: z.string().min(1, '请选择插件分类'),
  price: z
    .number()
    .int('价格必须是整数')
    .min(0, '价格不能为负数')
    .max(100000, '价格不能超过100000'),
});

/**
 * 充值订单验证Schema
 */
export const paymentSchema = z.object({
  amount: z
    .number()
    .int('金额必须是整数')
    .min(1, '金额至少1元')
    .max(100000, '金额不能超过100000元'),
});

/**
 * 积分转账验证Schema
 */
export const pointsTransferSchema = z.object({
  targetUserId: z.string().min(1, '请输入目标用户ID'),
  amount: z
    .number()
    .int('积分必须是整数')
    .min(1, '积分至少1'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PluginInput = z.infer<typeof pluginSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type PointsTransferInput = z.infer<typeof pointsTransferSchema>;
