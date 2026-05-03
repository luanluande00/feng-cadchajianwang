'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Search, Filter, Download, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * 插件商城页面组件
 */
export default function MarketplacePage() {
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPlugins = async (searchTerm?: string) => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `/api/plugins?search=${encodeURIComponent(searchTerm)}`
        : '/api/plugins';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setPlugins(data.data.data || []);
      }
    } catch (error) {
      console.error('加载插件失败:', error);
      setPlugins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlugins(search);
  }, [search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <GlitchText className="font-orbitron text-4xl font-bold mb-4 glow-text text-cyber-blue">
          插件商城
        </GlitchText>
        <p className="text-gray-400">发现优质的CAD插件，提升您的工作效率</p>
      </div>

      {/* 搜索栏 */}
      <div className="flex gap-4 mb-8 max-w-2xl mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索插件..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-cyber-input border border-cyber-blue/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-5 w-5 mr-2" />
          筛选
        </Button>
      </div>

      {/* 插件列表 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} glow={false} hover={false} className="animate-pulse">
              <div className="h-48 bg-cyber-input rounded mb-4" />
              <div className="h-4 bg-cyber-input rounded w-3/4 mb-2" />
              <div className="h-3 bg-cyber-input rounded w-1/2 mb-4" />
              <div className="flex justify-between">
                <div className="h-4 bg-cyber-input rounded w-20" />
                <div className="h-8 bg-cyber-input rounded w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : plugins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.map((plugin) => (
            <Card key={plugin.id} className="flex flex-col">
              <div className="h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded mb-4 flex items-center justify-center">
                <Star className="h-12 w-12 text-cyber-blue" />
              </div>
              <h3 className="font-rajdhani text-xl font-bold mb-2">{plugin.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{plugin.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>{plugin.category}</span>
                <span className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  {plugin.downloads}
                </span>
              </div>
              <div className="mt-auto flex justify-between items-center">
                <span className="font-orbitron text-cyber-blue font-bold">{plugin.price} 积分</span>
                <Link href={`/marketplace/plugin/${plugin.id}`}>
                  <Button variant="outline" size="sm">
                    查看详情
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">暂无插件</p>
          <Link href="/developer/publish" className="mt-4 inline-block">
            <Button variant="primary">发布第一个插件</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
