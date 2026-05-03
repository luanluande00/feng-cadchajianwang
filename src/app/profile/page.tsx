'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { User, Wallet, Download, Settings, LogOut, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { href: '/profile', label: '账户概览', icon: User },
  { href: '/profile/info', label: '个人信息', icon: Settings },
  { href: '/profile/points', label: '我的积分', icon: Wallet },
  { href: '/profile/downloads', label: '下载历史', icon: Download },
  { href: '/profile/recharge', label: '充值中心', icon: TrendingUp },
  { href: '/developer', label: '开发者中心', icon: Code },
];

function Code(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function ProfilePage() {
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">个人中心</GlitchText>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card glow>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-orbitron text-xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between p-3 bg-cyber-input rounded">
                <span className="text-gray-400">积分</span>
                <span className="font-orbitron font-bold text-cyber-blue">{user.points}</span>
              </div>
              <div className="flex justify-between p-3 bg-cyber-input rounded">
                <span className="text-gray-400">累计赚取</span>
                <span className="font-orbitron font-bold text-cyber-pink">{user.totalEarned}</span>
              </div>
              <div className="flex justify-between p-3 bg-cyber-input rounded">
                <span className="text-gray-400">状态</span>
                <span className={user.isVerified ? 'text-green-500' : 'text-yellow-500'}>
                  {user.isVerified ? '已验证' : '未验证'}
                </span>
              </div>
            </div>
            <Button variant="danger" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="flex items-center gap-4 cursor-pointer hover:border-cyber-blue/50">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-cyber-blue" />
                    </div>
                    <span className="font-rajdhani text-lg font-semibold uppercase tracking-wider">{item.label}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
