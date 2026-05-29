import * as React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-xs font-medium mb-1.5', className)}
        style={{ color: 'var(--mist)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';
