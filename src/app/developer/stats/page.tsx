'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function StatsPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.success) router.push('/login');
    }).catch(() => router.push('/login'));
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/developer" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回开发者中心
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">销售统计</GlitchText>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card glow><div className="text-center"><p className="text-gray-400 mb-1">总销售额</p><p className="font-orbitron text-4xl font-bold text-cyber-blue">0</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-400 mb-1">总下载</p><p className="font-orbitron text-4xl font-bold text-cyber-pink">0</p></div></Card>
        <Card><div className="text-center"><p className="text-gray-400 mb-1">插件数量</p><p className="font-orbitron text-4xl font-bold text-cyber-purple">0</p></div></Card>
      </div>

      <Card>
        <h3 className="font-orbitron text-xl font-bold mb-4 text-cyber-blue">销售趋势</h3>
        <p className="text-gray-400 text-center py-12">暂无数据，发布插件后即可查看</p>
      </Card>
    </div>
  );
}
