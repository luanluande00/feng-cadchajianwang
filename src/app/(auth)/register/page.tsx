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
 * 注册页面组件
 */
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // 自动验证模式下直接跳转首页
        if (data.data?.autoVerified) {
          router.push('/');
        } else {
          router.push('/verify?sent=true');
        }
      } else {
        // API返回的字段是 errors，不是 details
        const validationErrors = data.errors || data.details;
        if (validationErrors && Array.isArray(validationErrors)) {
          setError(validationErrors.map((e: any) => e.message || e).join('；'));
        } else {
          setError(data.message || '注册失败');
        }
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
            注册
          </GlitchText>
          <p className="text-gray-400 mt-2">注册即送 100 积分</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <Input
            label="邮箱"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱地址"
            required
          />
          <Input
            label="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="3-20个字符，字母、数字、下划线或中文"
            minLength={3}
            maxLength={20}
            required
          />
          <Input
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少6个字符"
            minLength={6}
            required
          />
          <p className="text-xs text-gray-500 mt-1">要求：至少6个字符</p>
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            注册
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          已有账号？{' '}
          <Link href="/login" className="text-cyber-blue hover:underline">
            立即登录
          </Link>
        </div>
      </Card>
    </div>
  );
}
