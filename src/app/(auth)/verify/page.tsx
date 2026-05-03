'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

/**
 * 邮箱验证页面组件
 */
function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const sent = searchParams.get('sent');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.success ? 'success' : 'error');
        })
        .catch(() => setStatus('error'));
    } else {
      setStatus('loading');
    }
  }, [token]);

  if (sent) {
    return (
      <Card glow className="w-full max-w-md text-center">
        <Mail className="h-16 w-16 text-cyber-blue mx-auto mb-4" />
        <h2 className="font-orbitron text-2xl font-bold text-cyber-blue mb-4">验证邮件已发送</h2>
        <p className="text-gray-400 mb-6">
          请检查您的邮箱，点击验证链接完成注册。
        </p>
        <Link href="/login">
          <Button variant="outline">返回登录</Button>
        </Link>
      </Card>
    );
  }

  if (status === 'loading') {
    return (
      <Card glow className="w-full max-w-md text-center">
        <div className="animate-pulse">
          <p className="text-cyber-blue font-rajdhani text-xl">验证中...</p>
        </div>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card glow className="w-full max-w-md text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="font-orbitron text-2xl font-bold text-green-500 mb-4">验证成功</h2>
        <p className="text-gray-400 mb-6">您的邮箱已验证成功，现在可以登录使用平台了。</p>
        <Link href="/login">
          <Button variant="primary">去登录</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card glow className="w-full max-w-md text-center">
      <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h2 className="font-orbitron text-2xl font-bold text-red-500 mb-4">验证失败</h2>
      <p className="text-gray-400 mb-6">验证链接已过期或无效，请重新注册。</p>
      <Link href="/register">
        <Button variant="secondary">重新注册</Button>
      </Link>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
      <Suspense>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
