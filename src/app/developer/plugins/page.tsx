'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Edit, Trash2, Eye, Download } from 'lucide-react';
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
        if (!d.success) {
          router.push('/login');
          return;
        }
        // 加载该用户的插件列表
        return fetch('/api/plugins?mine=true');
      })
      .then(r => r ? r.json() : null)
      .then(d => {
        if (d?.success && d.data) {
          setPlugins(d.data.data || []);
        }
        setLoading(false);
      })
      .catch(() => { router.push('/login'); setLoading(false); });
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该插件？')) return;
    try {
      const res = await fetch(`/api/plugins/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPlugins(plugins.filter(p => p.id !== id));
      } else {
        alert(data.message || '删除失败');
      }
    } catch {
      alert('删除失败');
    }
  };

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
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <span className={`text-sm ${statusColors[p.status] || 'text-gray-400'}`}>
                      {statusLabels[p.status] || p.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{p.description?.substring(0, 80)}{p.description?.length > 80 ? '...' : ''}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {p.downloads} 次下载</span>
                    <span>{p.price} 积分</span>
                    <span>{p.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/marketplace/plugin/${p.id}`}>
                    <button className="p-2 text-cyber-blue hover:text-cyber-pink transition-colors" title="查看">
                      <Eye className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                    title="删除"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
