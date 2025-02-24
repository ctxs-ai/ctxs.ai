import { ContextItem } from "./context-item"
import type { CollectionEntry } from 'astro:content';

interface ContextListProps {
  contexts: CollectionEntry<"contexts">[]
}

export function ContextList({ contexts }: ContextListProps) {
  return (
    <div className="divide-y divide-[#0000000d]">
      {contexts.map((context) => (
        <ContextItem key={context.id} context={context} />
      ))}
    </div>
  )
}

