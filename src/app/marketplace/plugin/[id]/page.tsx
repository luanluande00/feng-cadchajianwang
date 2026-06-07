'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Download, User, Star, Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PluginDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plugin, setPlugin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        if (data.data?.downloadUrl) {
          window.open(data.data.downloadUrl, '_blank');
        }
        alert('下载成功！');
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

  const productImages = plugin.productImages ? plugin.productImages.split(',').filter(Boolean) : [];
  const hasMedia = plugin.coverImage || productImages.length > 0 || plugin.productVideo;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回商城
      </Link>

      <Card glow className="mb-8">
        {/* 封面图或产品图轮播 */}
        {hasMedia && (
          <div className="mb-6">
            {/* 主图展示区 */}
            <div className="relative rounded overflow-hidden bg-cyber-input" style={{ minHeight: '200px' }}>
              {productImages.length > 0 ? (
                <>
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`${plugin.name} - 图片${currentImageIndex + 1}`}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(i => i > 0 ? i - 1 : productImages.length - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(i => i < productImages.length - 1 ? i + 1 : 0)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {productImages.map((_: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-cyber-blue' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : plugin.coverImage ? (
                <img src={plugin.coverImage} alt={plugin.name} className="w-full h-auto max-h-[500px] object-contain" />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <Star className="h-20 w-20 text-cyber-blue/30" />
                </div>
              )}
            </div>

            {/* 产品图片缩略图 */}
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {productImages.map((url: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                      i === currentImageIndex ? 'border-cyber-blue' : 'border-transparent hover:border-cyber-blue/50'
                    }`}
                  >
                    <img src={url} alt={`缩略图${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 产品介绍视频 */}
            {plugin.productVideo && (
              <div className="mt-4">
                <h3 className="font-rajdhani text-lg font-semibold text-cyber-blue mb-2">产品演示</h3>
                <video
                  src={plugin.productVideo}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full rounded border border-cyber-blue/30"
                  style={{ maxHeight: '400px' }}
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
            )}
          </div>
        )}

        <GlitchText className="font-orbitron text-3xl font-bold mb-4 glow-text text-cyber-blue">
          {plugin.name}
        </GlitchText>

        <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">{plugin.description}</p>

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
            {plugin.price > 0 ? `下载插件 (${plugin.price}积分)` : '免费下载'}
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
