import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Particles } from '@/components/cyberpunk/Particles';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CyberCAD - CAD插件交易平台',
  description: 'CAD插件交易平台，支持插件发布、下载、积分充值',
  keywords: ['CAD', '插件', 'AutoCAD', 'LISP', '插件交易'],
};

/**
 * 根布局组件
 * 包含全局样式、字体、Header、Footer和赛博朋克特效
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="min-h-screen bg-cyber-dark flex flex-col">
        <Particles count={30} />
        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
