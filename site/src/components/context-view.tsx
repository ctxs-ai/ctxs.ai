import type { CollectionEntry } from 'astro:content';
import { Button } from "@/components/ui/button"
import { Copy, Edit, FileCode2, PencilLine, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

interface ContextViewProps {
  context: CollectionEntry<"contexts"> | null
}

export function ContextView({ context }: ContextViewProps) {
  if (!context) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a context to view details</p>
      </div>
    )
  }

  const author = context.id.split('/')[0]
  const copyToClipboard = () => {
    if (context.body) {
      navigator.clipboard.writeText(context.body)
    }
  }

  const cliCommand = `npx shadcn add "https://ctxs.ai/gh/${context.id}"`
  const editURL = `https://github.com/ctxs-ai/ctxs.ai/edit/main/contexts/${context.id}.md`

  return (
    <TooltipProvider>
      <div className="">
        <div className="sticky top-0 bg-background space-y-2 border-b border-border">
          <div className="max-w-3xl mx-auto border-x border-border px-8 py-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-medium tracking-tight">{context.data.title}</h1>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" asChild>
                      <a href={editURL} target="_blank"><PencilLine className="h-4 w-4" /></a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit on Github</TooltipContent>
                </Tooltip>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FileCode2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[300px] p-3">
                    <div className="space-y-2">
                      <div className="font-medium text-sm flex items-center gap-2"><FileCode2 className="h-4 w-4" /> Add to codebase</div>
                      <div className="text-sm">Run this command in your console</div>
                      <button className='flex items-center gap-2 w-full border border-border hover:border-primary transition-colors rounded py-2 px-3 group cursor-pointer' onClick={copyToClipboard}>
                        <div className="text-sm font-mono truncate flex-1">{cliCommand}</div>
                        <div className="text-muted-foreground group-hover:text-primary transition-colors"><Copy className="h-4 w-4" /></div>
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="inline-flex items-center gap-2">
              <img src={`https://github.com/${author}.png`} className="w-6 h-6 rounded-sm" />
              <p className="text-muted-foreground">@{author}</p>
            </div>
            <p className="text-muted-foreground max-w-lg">{context.data.description}</p>
          </div>
        </div>
        <div className="bg-muted border-b border-border px-4">
          <div className="max-w-3xl mx-auto border-border border-x p-8">
            <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto">
              {context.body}
            </pre>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

