import { cn } from '@/lib/utils';
import React from 'react';
import type { CollectionEntry } from 'astro:content';

interface ContextItemProps {
  context: CollectionEntry<"contexts">
  isSelected: boolean
}

export function ContextItem({ context, isSelected }: ContextItemProps) {
  const ref = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [isSelected]);

  return (
    <a ref={ref}
      href={`/gh/${context.id}`}
      className={cn("relative w-full block text-left p-4 pr-12 hover:bg-muted/50 transition-colors border-r",
        isSelected ? "bg-muted/50" : "border-border")}>
      {isSelected && (
        <div className="absolute -right-px -top-px -bottom-px border-primary border-r-3" />
      )}
      <h3 className="font-medium">{context.data.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{context.data.description}</p>
    </a>
  )
}