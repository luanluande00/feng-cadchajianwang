'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, glow = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-rajdhani font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-cyber-dark hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]',
      secondary: 'bg-cyber-pink text-white hover:bg-cyber-pink/80 hover:shadow-[0_0_20px_rgba(255,0,110,0.5)]',
      outline: 'border-2 border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]',
      ghost: 'text-cyber-blue hover:bg-cyber-blue/10',
      danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], glow && 'animate-glow-pulse', className)}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...(props as any)}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            加载中...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
