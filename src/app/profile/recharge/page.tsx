'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Wallet, CreditCard } from 'lucide-react';
import Link from 'next/link';

const rechargeAmounts = [10, 50, 100, 200, 500, 1000];

export default function RechargePage() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.success) router.push('/login');
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleRecharge = async () => {
    if (!selectedAmount) { setError('请选择充值金额'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedAmount }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`充值订单已创建！金额: ${selectedAmount}元, 积分: ${selectedAmount}`);
        router.push('/profile/points');
      } else {
        setError(data.message);
      }
    } catch {
      setError('创建订单失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/profile/points" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回积分页面
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">充值中心</GlitchText>

      <div className="max-w-2xl">
        <Card glow className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="h-8 w-8 text-cyber-blue" />
            <div>
              <h3 className="font-rajdhani text-xl font-bold">充值规则</h3>
              <p className="text-gray-400">1元 = 1积分，充值后即时到账</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-rajdhani text-xl font-bold mb-4">选择充值金额</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {rechargeAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAmount === amount
                    ? 'border-cyber-blue bg-cyber-blue/10 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-gray-600 hover:border-cyber-blue/50'
                }`}
              >
                <div className="font-orbitron text-2xl font-bold text-cyber-blue">¥{amount}</div>
                <div className="text-gray-400 text-sm">{amount} 积分</div>
              </button>
            ))}
          </div>

          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">{error}</div>}

          <Button
            variant="primary"
            size="lg"
            glow
            loading={loading}
            disabled={!selectedAmount}
            onClick={handleRecharge}
            className="w-full"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            立即充值 ¥{selectedAmount || '0'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
