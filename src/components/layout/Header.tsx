'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { Cpu, ShoppingBag, User, Code, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * 顶部导航栏组件
 */
export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  };

  const navItems = [
    { href: '/', label: '首页', icon: Cpu },
    { href: '/marketplace', label: '插件商城', icon: ShoppingBag },
    { href: '/developer', label: '开发者中心', icon: Code },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 w-full border-b border-cyber-blue/20 bg-cyber-dark/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Cpu className="h-8 w-8 text-cyber-blue" />
          <GlitchText className="font-orbitron text-xl font-bold text-cyber-blue">CYBERCAD</GlitchText>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 font-rajdhani uppercase tracking-wider transition-colors hover:text-cyber-blue ${
                  isActive ? 'text-cyber-blue' : 'text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:block font-rajdhani text-cyber-blue">
                积分: {user.points}
              </span>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  个人中心
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">登录</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
