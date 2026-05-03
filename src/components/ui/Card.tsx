import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, glow = false, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-6 bg-cyber-card rounded-lg border border-cyber-blue/20',
          glow && 'shadow-[0_0_15px_rgba(0,240,255,0.2)]',
          hover && 'transition-all duration-300 hover:border-cyber-blue/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
