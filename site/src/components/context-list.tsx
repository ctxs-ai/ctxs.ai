import { ContextItem } from "./context-item";
import type { CollectionEntry } from "astro:content";

interface ContextListProps {
  contexts: CollectionEntry<"contexts">[];
  selectedId: string | null;
}

export function ContextList({ contexts, selectedId }: ContextListProps) {
  const isSelected = (id: string) => id === selectedId;

  return (
    <div className="divide-y divide-border">
      {contexts.map((context) => (
        <ContextItem
          key={context.id}
          context={context}
          isSelected={isSelected(context.id)}
        />
      ))}
    </div>
  );
}
