'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Wallet, TrendingUp, TrendingDown, Gift, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const typeIcons: Record<string, any> = {
  RECHARGE: TrendingUp,
  SPEND: TrendingDown,
  EARN: Wallet,
  BONUS: Gift,
  WITHDRAW: TrendingDown,
};

const typeLabels: Record<string, string> = {
  RECHARGE: '充值',
  SPEND: '消费',
  EARN: '赚取',
  BONUS: '奖励',
  WITHDRAW: '提现',
};

export default function PointsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.success) setUser(d.data);
        else router.push('/login');
      })
      .catch(() => router.push('/login'));

    fetch('/api/points/history')
      .then(r => r.json())
      .then(d => {
        if (d.success) setHistory(d.data.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/profile" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回个人中心
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">我的积分</GlitchText>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-1">当前余额</p>
              <p className="font-orbitron text-4xl font-bold text-cyber-blue">{user.points}</p>
            </div>
            <Wallet className="h-12 w-12 text-cyber-blue" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-1">累计赚取</p>
              <p className="font-orbitron text-4xl font-bold text-cyber-pink">{user.totalEarned}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-cyber-pink" />
          </div>
        </Card>
      </div>

      <Link href="/profile/recharge">
        <Button variant="primary" size="lg" className="mb-8" glow>
          充值积分
        </Button>
      </Link>

      <h3 className="font-orbitron text-xl font-bold mb-4 text-cyber-blue">交易记录</h3>
      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item: any) => {
            const Icon = typeIcons[item.type] || Wallet;
            return (
              <Card key={item.id} glow={false} hover={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      <Icon className={`h-5 w-5 ${item.amount > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{typeLabels[item.type] || '未知'}</p>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-orbitron font-bold ${item.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </p>
                    <p className="text-gray-500 text-xs">{new Date(item.createdAt).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">暂无交易记录</p>
      )}
    </div>
  );
}
