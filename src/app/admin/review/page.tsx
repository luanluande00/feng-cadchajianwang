'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Shield, Users, Package } from 'lucide-react';
import Link from 'next/link';

function ShieldIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function AdminReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.success) router.push('/login');
        setLoading(false);
      })
      .catch(() => { router.push('/login'); setLoading(false); });
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-cyber-blue">加载中...</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回管理后台
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">插件审核</GlitchText>

      <Card>
        <p className="text-gray-400 text-center py-12">暂无待审核的插件</p>
      </Card>
    </div>
  );
}
