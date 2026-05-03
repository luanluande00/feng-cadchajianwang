'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Shield, Users, Package } from 'lucide-react';
import Link from 'next/link';

function ShieldIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.success || d.data.role !== 'ADMIN') {
          setIsAccessDenied(true);
        }
        setLoading(false);
      })
      .catch(() => { setIsAccessDenied(true); setLoading(false); });
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;

  if (isAccessDenied) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-orbitron text-4xl font-bold mb-4 text-red-500">403</h1>
        <p className="text-gray-400 mb-8">无权访问管理后台</p>
        <Link href="/">
          <button className="px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-cyber-dark font-semibold rounded">返回首页</button>
        </Link>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin/review', label: '插件审核', icon: ShieldIcon, color: 'text-cyber-blue' },
    { href: '/admin/users', label: '用户管理', icon: Users, color: 'text-cyber-pink' },
    { href: '/admin/stats', label: '数据统计', icon: Package, color: 'text-cyber-purple' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回首页
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">管理后台</GlitchText>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card glow><div className="text-center"><p className="text-gray-400 mb-1">待审核插件</p><p className="font-orbitron text-4xl font-bold text-cyber-blue">0</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-400 mb-1">总用户数</p><p className="font-orbitron text-4xl font-bold text-cyber-pink">0</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-400 mb-1">总插件数</p><p className="font-orbitron text-4xl font-bold text-cyber-purple">0</p></div></Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
