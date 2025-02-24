import { ChevronLeft } from "lucide-react"
import type { Context } from "@/lib/types"

interface ContextViewProps {
  context: Context | null
}

export function ContextView({ context }: ContextViewProps) {
  if (!context) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a context to view details</p>
      </div>
    )
  }

  console.log(context)

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{context.data.title}</h1>
          <p className="text-muted-foreground">{context.data.description}</p>
        </div>
        <div className="max-w-3xl mx-auto p-4 bg-secondary/50 rounded-lg">
          <div
            className="prose dark:prose-invert prose-h1:font-medium prose-h2:font-medium prose-h3:font-medium prose-h4:font-medium prose-h5:font-medium prose-h6:font-medium"
            dangerouslySetInnerHTML={{ __html: context.rendered.html }} />
        </div>
      </div>
    </>
  )
}

