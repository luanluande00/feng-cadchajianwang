'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

const statusLabels: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
};

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-500',
  APPROVED: 'text-green-500',
  REJECTED: 'text-red-500',
};

export default function MyPluginsPage() {
  const router = useRouter();
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.success) router.push('/login');
      })
      .catch(() => router.push('/login'));

    setPlugins([]);
    setLoading(false);
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/developer" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回开发者中心
      </Link>

      <div className="flex justify-between items-center mb-8">
        <GlitchText className="font-orbitron text-3xl font-bold glow-text text-cyber-blue">我的插件</GlitchText>
        <Link href="/developer/publish">
          <button className="px-4 py-2 bg-gradient-to-r from-cyber-blue to-cyber-purple text-cyber-dark font-semibold rounded hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
            + 发布新插件
          </button>
        </Link>
      </div>

      {plugins.length > 0 ? (
        <div className="space-y-4">
          {plugins.map((p: any) => (
            <Card key={p.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-gray-400 text-sm">{p.downloads} 次下载 · {p.price} 积分</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={statusColors[p.status] || 'text-gray-400'}>
                    {statusLabels[p.status] || p.status}
                  </span>
                  <Link href={`/developer/publish?id=${p.id}`}>
                    <button className="text-cyber-blue hover:text-cyber-pink transition-colors"><Edit className="h-4 w-4" /></button>
                  </Link>
                  <button className="text-red-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-4">暂无插件</p>
          <Link href="/developer/publish">
            <button className="px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-cyber-dark font-semibold rounded hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
              发布第一个插件
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
