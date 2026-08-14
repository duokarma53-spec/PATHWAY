import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Section = forwardRef<HTMLDivElement, { children: ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <section ref={ref} className={cn('relative', className)} {...props}>
        {children}
      </section>
    );
  }
);
Section.displayName = 'Section';
