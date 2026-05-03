'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.success) router.push('/login');
      setLoading(false);
    }).catch(() => { router.push('/login'); setLoading(false); });
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回管理后台
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">用户管理</GlitchText>

      <Card>
        <p className="text-gray-400 text-center py-12">暂无用户数据</p>
      </Card>
    </div>
  );
}
