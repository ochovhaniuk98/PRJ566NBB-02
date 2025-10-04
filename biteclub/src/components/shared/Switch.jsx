'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, largeSize = false, ...props }) {
  const slotStyles = largeSize ? 'h-[1.5rem] w-12' : 'h-[1.2rem] w-9';
  const thumbStyles = largeSize ? 'size-[16px] border-1 border-white' : 'size-[13.5px] border-1 border-white';

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        `${slotStyles} peer shadow-inner data-[state=checked]:bg-brand-green data-[state=unchecked]:bg-brand-grey focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer`,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          `${thumbStyles} bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform ${
            largeSize
              ? 'data-[state=checked]:translate-x-[calc(100%+13px)] data-[state=unchecked]:translate-x-[3px]'
              : 'data-[state=checked]:translate-x-[calc(100%+6px)] data-[state=unchecked]:translate-x-[3px]'
          } shadow`
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
