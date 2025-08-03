'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, largeSize = true, ...props }) {
  const slotStyles = largeSize ? 'h-[1.5rem] w-11' : 'h-[1.15rem] w-8';
  const thumbStyles = largeSize ? 'size-6' : 'size-4';

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        `${slotStyles} peer shadow-inner data-[state=checked]:bg-brand-green data-[state=unchecked]:bg-brand-grey-lite focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border-2 border-brand-navy transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer`,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          `${thumbStyles} bg-white border-2 border-brand-navy dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0`
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
