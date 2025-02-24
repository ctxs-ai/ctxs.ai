import type { Context } from "@/lib/types"

interface ContextItemProps {
  context: Context
  onClick: (context: Context) => void
}

export function ContextItem({ context }: ContextItemProps) {
  return (
    <a href={`/?ctx=${context.id}`} className="w-full block text-left p-4 hover:bg-muted/50 transition-colors">
      <h3 className="font-medium">{context.data.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{context.data.description}</p>
    </a>
  )
}

