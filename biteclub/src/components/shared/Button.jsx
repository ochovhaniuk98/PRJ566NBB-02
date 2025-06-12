import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-brand-navy text-sm font-primary font-semibold cursor-pointer shadow-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-brand-green-lite text-black border border-brand-navy rounded-sm hover:bg-brand-green/50 ',
        destructive:
          'bg-destructive text-white shadow-xs rounded-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs rounded-sm hover:bg-accent hover:bg-secondary/80 dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-brand-peach rounded-sm',
        ghost: 'hover:bg-accent rounded-sm hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 rounded-sm hover:underline',
        googlebtn: 'border bg-brand-google text-white rounded-sm',
        danger: 'bg-brand-red text-white uppercase rounded-sm',
        third: 'bg-brand-blue-lite border border-brand-blue rounded-sm',
        roundTab:
          'bg-brand-blue-lite rounded-full border border-brand-blue-lite hover:bg-brand-aqua-lite hover:border-brand-aqua',
        roundTabActive:
          'bg-brand-aqua-lite rounded-full border border-brand-aqua hover:bg-brand-aqua-lite hover:border-brand-aqua',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={[buttonVariants({ variant, size }), className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

export { Button, buttonVariants };
