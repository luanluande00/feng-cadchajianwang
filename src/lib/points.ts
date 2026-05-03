import prisma from '@/lib/prisma';

/**
 * 注册奖励积分数量
 */
const REGISTER_BONUS = parseInt(process.env.REGISTER_BONUS_POINTS || '100');

/**
 * 卖家收益分成百分比（70%）
 */
const SELLER_PERCENT = parseInt(process.env.PLUGIN_SELLER_REVENUE_PERCENT || '70');

/**
 * 最小提现积分数
 */
const MIN_WITHDRAW = parseInt(process.env.MIN_WITHDRAW_POINTS || '1000');

/**
 * 为用户增加积分
 * @param userId 用户ID
 * @param amount 增加的积分数量
 * @param type 交易类型
 * @param description 交易描述
 */
export async function addPoints(
  userId: string,
  amount: number,
  type: 'RECHARGE' | 'EARN' | 'BONUS',
  description: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { points: { increment: amount } },
    });

    await tx.transaction.create({
      data: {
        userId,
        type,
        amount,
        description,
      },
    });
  });
}

/**
 * 为用户扣除积分
 * @param userId 用户ID
 * @param amount 扣除的积分数量
 * @param description 交易描述
 * @throws 积分不足时抛出错误
 */
export async function deductPoints(
  userId: string,
  amount: number,
  description: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user || user.points < amount) {
      throw new Error('积分不足');
    }

    await tx.user.update({
      where: { id: userId },
      data: { points: { decrement: amount } },
    });

    await tx.transaction.create({
      data: {
        userId,
        type: 'SPEND',
        amount: -amount,
        description,
      },
    });
  });
}

/**
 * 处理插件下载时的积分分配
 * 买家扣除积分，卖家获得70%，平台获得30%
 * @param buyerId 买家ID
 * @param sellerId 卖家ID
 * @param pluginId 插件ID
 * @param price 插件价格（积分）
 */
export async function handlePluginDownload(
  buyerId: string,
  sellerId: string,
  pluginId: string,
  price: number
): Promise<void> {
  const sellerAmount = Math.floor((price * SELLER_PERCENT) / 100);
  const platformAmount = price - sellerAmount;

  await prisma.$transaction(async (tx) => {
    // 扣除买家积分
    const buyer = await tx.user.findUnique({
      where: { id: buyerId },
      select: { points: true },
    });

    if (!buyer || buyer.points < price) {
      throw new Error('积分不足');
    }

    await tx.user.update({
      where: { id: buyerId },
      data: { points: { decrement: price } },
    });

    // 记录买家消费
    await tx.transaction.create({
      data: {
        userId: buyerId,
        type: 'SPEND',
        amount: -price,
        description: `下载插件`,
      },
    });

    // 增加卖家积分
    if (sellerAmount > 0) {
      await tx.user.update({
        where: { id: sellerId },
        data: {
          points: { increment: sellerAmount },
          totalEarned: { increment: sellerAmount },
        },
      });

      await tx.transaction.create({
        data: {
          userId: sellerId,
          type: 'EARN',
          amount: sellerAmount,
          description: `插件下载收益`,
        },
      });
    }

    // 记录下载历史
    await tx.download.create({
      data: {
        userId: buyerId,
        pluginId,
        pointsSpent: price,
      },
    });

    // 更新插件下载次数
    await tx.plugin.update({
      where: { id: pluginId },
      data: { downloads: { increment: 1 } },
    });
  });
}

/**
 * 获取用户积分余额
 * @param userId 用户ID
 * @returns 积分余额
 */
export async function getPointsBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });

  return user?.points || 0;
}

/**
 * 获取用户积分交易历史
 * @param userId 用户ID
 * @param page 页码（从1开始）
 * @param limit 每页数量
 * @returns 交易记录列表和总数
 */
export async function getPointsHistory(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ transactions: any[]; total: number }> {
  const skip = (page - 1) * limit;

  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({
      where: { userId },
    }),
  ]);

  return { transactions, total };
}

/**
 * 检查是否可以提现
 * @param userId 用户ID
 * @returns 是否可以提现
 */
export async function canWithdraw(userId: string): Promise<boolean> {
  const balance = await getPointsBalance(userId);
  return balance >= MIN_WITHDRAW;
}

export { REGISTER_BONUS, SELLER_PERCENT, MIN_WITHDRAW };
