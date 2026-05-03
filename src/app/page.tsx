import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Download, Star, Users, Code } from 'lucide-react';

/**
 * 首页组件
 * 展示平台特色、热门插件和统计数据
 */
export default function Home() {
  const stats = [
    { icon: Download, label: '总下载', value: '10,000+' },
    { icon: Star, label: '好评率', value: '99%' },
    { icon: Users, label: '注册用户', value: '5,000+' },
    { icon: Code, label: '插件数量', value: '500+' },
  ];

  const featuredPlugins = [
    { name: '自动标注工具', price: 50, downloads: 1200, category: '标注' },
    { name: '批量导出PDF', price: 80, downloads: 890, category: '导出' },
    { name: '家具生成器', price: 100, downloads: 2100, category: '定制' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-20">
        <GlitchText className="font-orbitron text-5xl md:text-7xl font-bold mb-6 glow-text text-cyber-blue">
          CYBERCAD
        </GlitchText>
        <p className="font-rajdhani text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          CAD插件交易平台
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/marketplace">
            <Button variant="primary" size="lg" glow>
              浏览插件
            </Button>
          </Link>
          <Link href="/developer/publish">
            <Button variant="outline" size="lg">
              发布插件
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} glow={false} hover={false} className="text-center">
              <stat.icon className="h-8 w-8 text-cyber-blue mx-auto mb-2" />
              <div className="font-orbitron text-2xl font-bold text-cyber-blue">{stat.value}</div>
              <div className="font-rajdhani text-gray-400 uppercase tracking-wider text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Plugins */}
      <section className="py-12">
        <h2 className="font-orbitron text-3xl font-bold text-center mb-8 glow-text text-cyber-blue">
          热门插件
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPlugins.map((plugin, i) => (
            <Card key={i}>
              <div className="h-40 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded mb-4 flex items-center justify-center">
                <Code className="h-12 w-12 text-cyber-blue" />
              </div>
              <h3 className="font-rajdhani text-xl font-bold mb-2">{plugin.name}</h3>
              <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <span>{plugin.category}</span>
                <span>{plugin.downloads} 次下载</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-orbitron text-cyber-blue font-bold">{plugin.price} 积分</span>
                <Link href="/marketplace">
                  <Button variant="outline" size="sm">
                    查看详情
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <Card glow className="max-w-2xl mx-auto">
          <h2 className="font-orbitron text-2xl font-bold mb-4 text-cyber-pink">
            成为开发者
          </h2>
          <p className="text-gray-300 mb-6">
            发布您的CAD插件，赚取积分，提现收益。注册即送100积分！
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg" glow>
              立即注册
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
