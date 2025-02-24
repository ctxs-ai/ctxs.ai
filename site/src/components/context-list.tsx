import { ContextItem } from "./context-item"
import type { CollectionEntry } from 'astro:content';

interface ContextListProps {
  contexts: CollectionEntry<"contexts">[]
  selectedId: string | null
}

export function ContextList({ contexts, selectedId }: ContextListProps) {
  return (
    <div className="divide-y divide-[#0000000d]">
      {contexts.map((context) => (
        <ContextItem key={context.id} context={context} isSelected={context.id === selectedId} />
      ))}
    </div>
  )
}

