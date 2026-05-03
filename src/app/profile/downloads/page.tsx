'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function DownloadsPage() {
  const router = useRouter();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.success) router.push('/login');
      })
      .catch(() => router.push('/login'));

    // 模拟数据（实际需要单独API）
    setDownloads([]);
    setLoading(false);
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/profile" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回个人中心
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">下载历史</GlitchText>

      {downloads.length > 0 ? (
        <div className="space-y-3">
          {downloads.map((d: any) => (
            <Card key={d.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-cyber-blue" />
                <span>{d.plugin?.name}</span>
              </div>
              <span className="text-gray-400">{new Date(d.createdAt).toLocaleDateString('zh-CN')}</span>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">暂无下载记录</p>
      )}
    </div>
  );
}
