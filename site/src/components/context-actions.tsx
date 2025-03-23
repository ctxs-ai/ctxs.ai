import type { CollectionEntry } from "astro:content";
import { Button } from "@/components/ui/button";
import { Check, Copy, Edit, FileCode2, Link } from "lucide-react";
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
import copy from "copy-to-clipboard";
import { useState } from "react";
import { Post } from "@/db/schema";

interface ContextViewProps {
  context: CollectionEntry<"contexts"> | null;
}

export const ContextActions = ({ context }) => {
  const [contextCopied, setContextCopied] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);
  const [plaintextURLCopied, setPlaintextURLCopied] = useState(false);

  const origin = import.meta.env.MODE === 'development' ? 'http://localhost:4321' : 'https://ctxs.ai';

  const cliCommand = `npx ctxs add "${origin}/r/registry-item/${context.urn}.json"`;
  const plaintextURL = `${origin}/api/txt/${context.urn}`;

  const copyPlaintextURLToClipboard = () => {
    if (plaintextURL) {
      copy(plaintextURL);
      setPlaintextURLCopied(true);
      setTimeout(() => {
        setPlaintextURLCopied(false);
      }, 1000);
    }
  };

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
            <Button variant="outline" size="icon" onClick={copyPlaintextURLToClipboard}>
              {plaintextURLCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Link className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Copy plaintext URL</TooltipContent>
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
          <TooltipContent side="bottom">Copy as Markdown</TooltipContent>
        </Tooltip>
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <FileCode2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add to codebase</TooltipContent>
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
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider >
    </div >
  );
};