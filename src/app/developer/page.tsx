'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Code, Plus, BarChart, Wallet } from 'lucide-react';
import Link from 'next/link';

function CodeIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function DeveloperPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;
  if (!user) return null;

  const menuItems = [
    { href: '/developer/publish', label: '发布插件', icon: Plus, color: 'text-cyber-blue' },
    { href: '/developer/plugins', label: '我的插件', icon: CodeIcon, color: 'text-cyber-pink' },
    { href: '/developer/stats', label: '销售统计', icon: BarChart, color: 'text-cyber-purple' },
    { href: '/developer/withdraw', label: '收益提现', icon: Wallet, color: 'text-cyber-yellow' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <GlitchText className="font-orbitron text-3xl font-bold mb-4 glow-text text-cyber-blue">开发者中心</GlitchText>
      <p className="text-gray-400 mb-8">发布和管理您的CAD插件，赚取积分收益</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card glow>
          <div className="text-center">
            <p className="text-gray-400 mb-1">当前积分</p>
            <p className="font-orbitron text-4xl font-bold text-cyber-blue">{user.points}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-400 mb-1">累计赚取</p>
            <p className="font-orbitron text-4xl font-bold text-cyber-pink">{user.totalEarned}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="flex items-center gap-4 cursor-pointer hover:border-cyber-blue/50">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <span className="font-rajdhani text-lg font-semibold uppercase tracking-wider">{item.label}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
