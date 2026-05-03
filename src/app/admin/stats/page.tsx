'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function AdminStatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.success) router.push('/login');
      setLoading(false);
    }).catch(() => { router.push('/login'); setLoading(false); });
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回管理后台
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">数据统计</GlitchText>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card glow><div className="text-center"><p className="text-gray-400 mb-1">总用户</p><p className="font-orbitron text-3xl font-bold text-cyber-blue">0</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-400 mb-1">总插件</p><p className="font-orbitron text-3xl font-bold text-cyber-pink">0</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-400 mb-1">总下载</p><p className="font-orbitron text-3xl font-bold text-cyber-purple">0</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-400 mb-1">总交易</p><p className="font-orbitron text-3xl font-bold text-cyber-yellow">0</p></div></Card>
      </div>

      <Card>
        <h3 className="font-orbitron text-xl font-bold mb-4 text-cyber-blue">平台概览</h3>
        <p className="text-gray-400 text-center py-12">暂无数据</p>
      </Card>
    </div>
  );
}
