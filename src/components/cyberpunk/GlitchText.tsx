'use client';

import { motion } from 'framer-motion';

/**
 * 赛博朋克故障文字效果组件
 */
export function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        className="relative z-10"
        animate={{
          x: [0, -2, 2, -1, 1, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {children}
      </motion.span>
      <span className="absolute top-0 left-0 -z-10 text-cyber-pink opacity-70" aria-hidden="true">
        {children}
      </span>
      <span className="absolute top-0 left-0 -z-10 text-cyber-blue opacity-70 translate-x-[2px]" aria-hidden="true">
        {children}
      </span>
    </div>
  );
}
