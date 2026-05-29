import * as React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1', className)}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';
