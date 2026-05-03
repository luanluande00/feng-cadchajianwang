import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-2 text-sm font-rajdhani uppercase tracking-wider text-cyber-blue">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-cyber-input border border-cyber-blue/30 rounded text-white placeholder-gray-500',
            'focus:outline-none focus:border-cyber-blue focus:shadow-[0_0_10px_rgba(0,240,255,0.3)]',
            'transition-all duration-300',
            error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_rgba(255,0,0,0.3)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
