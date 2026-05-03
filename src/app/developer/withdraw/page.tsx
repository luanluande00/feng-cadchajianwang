'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Wallet, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const MIN_WITHDRAW = 1000;

export default function WithdrawPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.success) setUser(d.data);
        else router.push('/login');
        setLoading(false);
      })
      .catch(() => { router.push('/login'); setLoading(false); });
  }, [router]);

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount < MIN_WITHDRAW) {
      setError(`最低提现 ${MIN_WITHDRAW} 积分`);
      return;
    }
    if (amount > (user?.points || 0)) {
      setError('积分余额不足');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/points/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('提现申请已提交，等待处理');
        router.refresh();
      } else {
        setError(data.message);
      }
    } catch {
      setError('提现失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/developer" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回开发者中心
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">收益提现</GlitchText>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card glow>
          <div className="text-center">
            <p className="text-gray-400 mb-1">可提现积分</p>
            <p className="font-orbitron text-4xl font-bold text-cyber-blue">{user.points}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-400 mb-1">可提现金额</p>
            <p className="font-orbitron text-4xl font-bold text-cyber-pink">¥{(user.points / 100).toFixed(2)}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <p className="text-yellow-500 text-sm">最低提现 {MIN_WITHDRAW} 积分（¥{(MIN_WITHDRAW / 100).toFixed(2)}）</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">提现积分</label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
            placeholder="输入提现积分数量"
            min={MIN_WITHDRAW}
          />
          <p className="text-gray-500 text-sm mt-1">
            {withdrawAmount && parseInt(withdrawAmount) ? `可提现 ¥${(parseInt(withdrawAmount) / 100).toFixed(2)}` : ''}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-500 text-sm">{success}</div>}

        <Button variant="primary" size="lg" glow loading={submitting} onClick={handleWithdraw} className="w-full">
          <Wallet className="h-5 w-5 mr-2" />
          申请提现
        </Button>
      </Card>
    </div>
  );
}
