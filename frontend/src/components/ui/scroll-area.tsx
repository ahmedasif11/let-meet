import * as React from 'react';
import { cn } from '@/lib/utils/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, orientation = 'vertical', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative overflow-auto',
        orientation === 'horizontal' ? 'overflow-x-auto' : 'overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
