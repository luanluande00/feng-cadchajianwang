'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

export default function PublishPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '工具',
    price: 0,
    coverImage: '',
    fileUrl: '',
  });

  const categories = ['工具', '标注', '导出', '定制', '渲染', '参数化', '其他'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/plugins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('插件提交成功，等待审核');
        setTimeout(() => router.push('/developer/plugins'), 2000);
      } else {
        setError(data.message);
      }
    } catch {
      setError('提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/developer" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回开发者中心
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">发布插件</GlitchText>

      <Card glow>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">插件名称</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              placeholder="请输入插件名称"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">插件描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              rows={4}
              placeholder="请输入插件描述"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">分类</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">价格（积分）</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">封面图URL</label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">插件文件URL</label>
            <input
              type="url"
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              placeholder="https://example.com/plugin.lsp"
            />
            <p className="text-gray-500 text-sm mt-1">支持 .lsp, .dll, .vlx, .fas 等格式</p>
          </div>

          {error && <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-500/20 border border-green-500 rounded text-green-500 text-sm">{success}</div>}

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            <Upload className="h-5 w-5 mr-2" />
            提交审核
          </Button>
        </form>
      </Card>
    </div>
  );
}
