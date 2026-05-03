'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Download, User, Star, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PluginDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plugin, setPlugin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.success) setUser(d.data); }).catch(() => {});
    fetch(`/api/plugins/${params.id}`).then(r => r.json()).then(d => {
      if (d.success) setPlugin(d.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  const handleDownload = async () => {
    if (!user) { router.push('/login'); return; }
    setDownloading(true);
    try {
      const res = await fetch(`/api/plugins/${params.id}/download`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('下载成功！');
        router.refresh();
      } else {
        setError(data.message);
      }
    } catch {
      setError('下载失败');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;
  if (!plugin) return <div className="container mx-auto px-4 py-20 text-center"><p>插件不存在</p></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回商城
      </Link>

      <Card glow className="mb-8">
        <div className="h-64 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded mb-6 flex items-center justify-center">
          <Star className="h-20 w-20 text-cyber-blue" />
        </div>

        <GlitchText className="font-orbitron text-3xl font-bold mb-4 glow-text text-cyber-blue">
          {plugin.name}
        </GlitchText>

        <p className="text-gray-300 mb-6 leading-relaxed">{plugin.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-cyber-input rounded">
            <div className="font-orbitron text-xl font-bold text-cyber-blue">{plugin.price}</div>
            <div className="text-gray-400 text-sm">积分</div>
          </div>
          <div className="text-center p-3 bg-cyber-input rounded">
            <div className="font-orbitron text-xl font-bold text-cyber-pink">{plugin.downloads}</div>
            <div className="text-gray-400 text-sm">下载</div>
          </div>
          <div className="text-center p-3 bg-cyber-input rounded">
            <div className="font-rajdhani text-cyber-purple">{plugin.category}</div>
            <div className="text-gray-400 text-sm">分类</div>
          </div>
          <div className="text-center p-3 bg-cyber-input rounded">
            <div className="flex items-center justify-center gap-2 text-cyber-yellow">
              <User className="h-4 w-4" />
              <span className="font-rajdhani">{plugin.user?.username || '未知'}</span>
            </div>
            <div className="text-gray-400 text-sm">开发者</div>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">{error}</div>}

        <div className="flex gap-4">
          <Button
            variant="primary"
            size="lg"
            glow
            onClick={handleDownload}
            loading={downloading}
            className="flex-1"
          >
            <Download className="h-5 w-5 mr-2" />
            下载插件
          </Button>
          {user?.id === plugin.userId && (
            <Link href="/developer/plugins">
              <Button variant="outline" size="lg">管理插件</Button>
            </Link>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
        <Calendar className="h-4 w-4" />
        发布于 {new Date(plugin.createdAt).toLocaleDateString('zh-CN')}
      </div>
    </div>
  );
}
