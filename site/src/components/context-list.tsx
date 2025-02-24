import type { Context } from "@/lib/types"
import { ContextItem } from "./context-item"

interface ContextListProps {
  contexts: Context[]
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

