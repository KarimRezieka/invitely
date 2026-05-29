import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('atelier-input flex h-11 w-full px-4 py-2 text-sm', className)}
        style={style}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
