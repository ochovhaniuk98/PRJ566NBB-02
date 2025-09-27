import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({ className, forBusinessUser = false, ...props }) {
  const styling = forBusinessUser ? 'bg-brand-blue-lite' : 'bg-brand-yellow-extralite';
  return (
    <div
      data-slot="card"
      className={cn(
        `${styling} text-black flex flex-col gap-1 lg:rounded-xl md:px-8 md:py-8 px-0 py-8 lg:w-md w-screen flex-grow`,
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-4 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return <div data-slot="card-title" className={cn('leading-none font-semibold', className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return (
    <div data-slot="card-description" className={cn('text-muted-foreground text-sm mb-4', className)} {...props} />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
