import Link from 'next/link';
import { Cpu, Github, Twitter, Mail } from 'lucide-react';

/**
 * 底部导航组件
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-cyber-blue/20 bg-cyber-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-6 w-6 text-cyber-blue" />
              <span className="font-orbitron text-lg font-bold text-cyber-blue">CYBERCAD</span>
            </div>
            <p className="text-gray-400 text-sm">
              赛博朋克风格的CAD插件交易平台，连接开发者与用户。
            </p>
          </div>

          <div>
            <h3 className="font-rajdhani text-cyber-blue uppercase tracking-wider mb-4">产品</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace" className="text-gray-400 hover:text-cyber-blue transition-colors">插件商城</Link></li>
              <li><Link href="/developer" className="text-gray-400 hover:text-cyber-blue transition-colors">开发者中心</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-cyber-blue transition-colors">定价</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-rajdhani text-cyber-blue uppercase tracking-wider mb-4">支持</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-gray-400 hover:text-cyber-blue transition-colors">文档</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-cyber-blue transition-colors">常见问题</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-cyber-blue transition-colors">联系我们</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-rajdhani text-cyber-blue uppercase tracking-wider mb-4">关注我们</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-cyber-blue/10 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} CyberCAD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
