import { cn } from '@/lib/utils';
import type { CollectionEntry } from 'astro:content';

interface ContextItemProps {
  context: CollectionEntry<"contexts">
  isSelected: boolean
}

export function ContextItem({ context, isSelected }: ContextItemProps) {
  return (
    <a href={`/gh/${context.id}`} className={cn("w-full block text-left p-4 hover:bg-muted/50 transition-colors", isSelected && "bg-muted/50 border-r-2 border-r-primary")}>
      <h3 className="font-medium">{context.data.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{context.data.description}</p>
    </a>
  )
}