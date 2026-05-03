'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, User, Pencil, Save } from 'lucide-react';
import Link from 'next/link';

export default function InfoPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setUser(d.data);
          setUsername(d.data.username);
        } else {
          router.push('/login');
        }
        setLoading(false);
      })
      .catch(() => { router.push('/login'); setLoading(false); });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setSuccess('更新成功');
        setEditing(false);
      } else {
        setError(data.message);
      }
    } catch {
      setError('更新失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/profile" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回个人中心
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">个人信息</GlitchText>

      <Card glow>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">邮箱</label>
            <div className="p-3 bg-cyber-input rounded text-white">{user.email}</div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">用户名</label>
            {editing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
                />
                <Button variant="primary" onClick={handleSave} loading={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
                <Button variant="ghost" onClick={() => { setEditing(false); setUsername(user.username); }}>
                  取消
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-cyber-input rounded">
                <span className="text-white">{user.username}</span>
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  编辑
                </Button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">账号状态</label>
            <div className={`p-3 rounded ${user.isVerified ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {user.isVerified ? '已验证' : '未验证'}
            </div>
          </div>

          {error && <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-500/20 border border-green-500 rounded text-green-500 text-sm">{success}</div>}

          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">注册时间：{new Date(user.createdAt).toLocaleDateString('zh-CN')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
