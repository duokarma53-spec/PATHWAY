import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold' | 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'default' | 'icon';
  asChild?: boolean;
  withArrow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, withArrow, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-bold text-xs uppercase tracking-widest transition-colors duration-300 rounded-sm disabled:opacity-50 disabled:pointer-events-none';
    
    let variantStyles = 'bg-charcoal text-white hover:bg-gold hover:text-charcoal';
    if (variant === 'gold') {
      variantStyles = 'bg-gold text-charcoal hover:bg-white hover:text-charcoal';
    } else if (variant === 'secondary' || variant === 'outline') {
      variantStyles = 'border border-border text-text-primary hover:border-charcoal hover:bg-charcoal hover:text-white';
    } else if (variant === 'ghost') {
      variantStyles = 'bg-transparent text-text-primary hover:bg-black/5';
    }

    let sizeStyles = 'px-6 py-3';
    if (size === 'sm') sizeStyles = 'px-4 py-2 text-[10px]';
    if (size === 'lg') sizeStyles = 'px-8 py-4 text-sm';

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      >
        {children}
        {withArrow && <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1 duration-200" />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const buttonVariants = ({ variant = 'primary' }: { variant?: string } = {}) => {
  return 'inline-flex items-center justify-center font-sans font-bold text-xs uppercase tracking-widest transition-colors duration-300 rounded-sm';
};
