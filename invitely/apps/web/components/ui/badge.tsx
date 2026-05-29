import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
}

const variantClasses = {
  default: 'bg-amber-500 text-white',
  outline: 'border border-zinc-300 text-zinc-700 dark:border-zinc-600 dark:text-zinc-300',
  secondary: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
  destructive: 'bg-red-100 text-red-800',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
