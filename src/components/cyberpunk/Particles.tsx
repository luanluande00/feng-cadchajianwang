'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * 赛博朋克粒子背景组件
 */
export function Particles({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 20 + 10,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyber-blue"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
}
