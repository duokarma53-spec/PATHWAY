import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Container({ children, className, ...props }: { children: ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('container-base', className)} {...props}>
      {children}
    </div>
  );
}
