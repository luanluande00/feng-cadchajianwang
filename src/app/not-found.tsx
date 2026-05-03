import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <GlitchText className="font-orbitron text-9xl font-bold mb-6 glow-text text-cyber-pink">
          404
        </GlitchText>
        <h1 className="font-orbitron text-2xl font-bold text-white mb-4">页面未找到</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          该页面不存在或已被移除。请返回首页或使用搜索功能查找内容。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg" glow>
              <Home className="h-5 w-5 mr-2" />
              返回首页
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" size="lg">
              <Search className="h-5 w-5 mr-2" />
              浏览插件
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
