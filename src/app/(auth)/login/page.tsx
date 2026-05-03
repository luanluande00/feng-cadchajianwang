'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Cpu } from 'lucide-react';

/**
 * 登录页面组件
 */
export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || '登录失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
      <Card glow className="w-full max-w-md">
        <div className="text-center mb-8">
          <Cpu className="h-12 w-12 text-cyber-blue mx-auto mb-4" />
          <GlitchText className="font-orbitron text-3xl font-bold text-cyber-blue">
            登录
          </GlitchText>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="邮箱或用户名"
            value={emailOrUsername}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱或用户名"
            required
          />
          <Input
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            登录
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          还没有账号？{' '}
          <Link href="/register" className="text-cyber-blue hover:underline">
            立即注册
          </Link>
        </div>
      </Card>
    </div>
  );
}
