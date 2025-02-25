import { cn } from '@/lib/utils';
import React from 'react';
import type { CollectionEntry } from 'astro:content';

interface ContextItemProps {
  context: CollectionEntry<"contexts">
  isSelected: boolean
}

function scrollIntoViewIfNotVisible(target: HTMLElement) {
  if (target.getBoundingClientRect().bottom > window.innerHeight) {
    target.scrollIntoView(false);
  }

  if (target.getBoundingClientRect().top < 0) {
    target.scrollIntoView();
  }
}

export function ContextItem({ context, isSelected }: ContextItemProps) {
  const ref = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (isSelected && ref.current) {
      scrollIntoViewIfNotVisible(ref.current);
    }
  }, [isSelected]);

  return (
    <a ref={ref}
      href={`/gh/${context.id}`}
      className={cn("relative w-full block cursor-pointer text-left p-4 pr-12 hover:bg-muted/50 transition-colors border-r",
        isSelected ? "bg-muted/80" : "border-border")}>
      {isSelected && (
        <div className="absolute -right-px -top-px -bottom-px border-primary border-r-3" />
      )}
      <h3 className="font-medium">{context.data.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{context.data.description}</p>
    </a>
  )
}