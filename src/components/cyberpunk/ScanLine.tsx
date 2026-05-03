'use client';

import { motion } from 'framer-motion';

/**
 * 赛博朋克扫描线效果组件
 */
export function ScanLine() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <motion.div
        className="absolute left-0 w-full h-1 bg-cyber-blue/20"
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
