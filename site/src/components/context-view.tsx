import type { CollectionEntry } from "astro:content";
import { Button } from "@/components/ui/button";
import { Check, Copy, Edit, FileCode2, PencilLine, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import copy from "copy-to-clipboard";
import { useState } from "react";

interface ContextViewProps {
  context: CollectionEntry<"contexts"> | null;
}

export const ContextActions = ({ context }: { context: CollectionEntry<"contexts"> }) => {
  const [contextCopied, setContextCopied] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);

  const cliCommand = `npx shadcn add "https://ctxs.ai/r/gh/${context.id}.json"`;
  const editURL = `https://github.com/ctxs-ai/ctxs.ai/edit/main/contexts/${context.id}.md`;

  const copyContextToClipboard = () => {
    if (context.body) {
      copy(context.body);
      setContextCopied(true);
      setTimeout(() => {
        setContextCopied(false);
      }, 1000);
    }
  };

  const copyCommandToClipboard = () => {
    if (cliCommand) {
      copy(cliCommand);
      setCommandCopied(true);
      setTimeout(() => {
        setCommandCopied(false);
      }, 1000);
    }
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <a href={editURL} target="_blank">
                <PencilLine className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit on Github</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={copyContextToClipboard}>
              {contextCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy as Markdown</TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <FileCode2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Add to codebase</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-[300px] p-3">
            <div className="space-y-2">
              <div className="font-medium text-sm flex items-center gap-2">
                <FileCode2 className="h-4 w-4" /> Add to codebase
              </div>
              <div className="text-sm">
                Run this command in your console
              </div>
              <button
                className="flex items-center gap-2 w-full border border-border hover:border-primary transition-colors rounded py-2 px-3 group cursor-pointer"
                onClick={copyCommandToClipboard}
              >
                <div className="text-sm font-mono truncate flex-1">
                  {cliCommand}
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {commandCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </div>
              </button>
              <div className="text-xs text-muted-foreground">Note that this (for now) requires having your project setup with shadcn.</div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider >
    </div >
  );
};

export function ContextView({ context }: ContextViewProps) {
  if (!context) {
    return (
      <div className="hidden md:flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a context to view details
        </p>
      </div>
    );
  }

  const author = context.id.split("/")[0];

  return (
    <>
      <div className="sticky top-0">
        <div className="max-w-3xl mx-auto px-4 space-y-2 border-b border-border">
          <div className=" bg-background md:border-x border-border py-4 md:px-8 md:py-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-medium tracking-tight">
                {context.data.title}
              </h1>
              <div className="hidden md:block">
                <ContextActions context={context} />
              </div>
            </div>
            <p className="text-muted-foreground max-w-lg">
              {context.data.description}
            </p>
            <div className="flex mt-2 items-center gap-2">
              <Avatar>
                <AvatarImage src={`https://github.com/${author}.png`} />
                <AvatarFallback>
                  {author.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground">@{author}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-border px-4 max-w-3xl mx-auto">
        <div className="border-border border-x p-4 md:p-8">
          <div className="prose max-w-3xl
              dark:prose-invert
              font-mono
              text-sm
              prose-headings:text-base
              prose-headings:font-bold 
              prose-code:text-sm
              prose-code:border-border
              prose-inline-code:border
              prose-inline-code:rounded
              prose-inline-code:px-1
              prose-inline-code:py-px
              prose-inline-code:font-medium
              prose-pre:px-0.5
              prose-li:my-1 
              prose-li:pl-3
              prose-ul:pl-2
              prose-ul:marker:text-foreground
              prose-ul:list-(--dash-list-marker)"
            dangerouslySetInnerHTML={{ __html: context.rendered?.html || "" }} />
        </div>
      </div>
    </>
  );
}
