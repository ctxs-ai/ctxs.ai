import { Info, RouteIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const authorImage = (post: any) => {
  if (post.attributedGitHubUser) {
    return `https://avatars.ctxs.ai/github/${post.attributedGitHubUser}/32`;
  } else if (post.attributedXUser) {
    return `https://avatars.ctxs.ai/x/${post.attributedXUser}/32`;
  } else {
    return post.author?.image || `https://avatars.ctxs.ai/github/${post.author.githubUserName}/32`;
  }
};

export const PostProvenance = ({ provenance }: { provenance: string }) => {
  return (
    <>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger>
              <RouteIcon className="size-3 cursor-pointer text-muted-foreground hover:text-foreground" />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            Provenance Details
          </TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provenance Details</DialogTitle>
            <DialogDescription className="text-xs">
              Information about where this content is from, how it was
              processed, and any other notes that were given by the submitter.
            </DialogDescription>
          </DialogHeader>
          <div className="prose" dangerouslySetInnerHTML={{ __html: provenance }} />
        </DialogContent>
      </Dialog>
    </>
  )
}
export const AuthorName = ({ post, showInfo = true }: { post: any, showInfo?: boolean }) => {
  const displayName = post.attributedGitHubUser || post.attributedXUser || post.author?.githubUserName

  const isAttributed = post.attributedGitHubUser && post.attributedGitHubUser !== post.author.githubUserName;

  const Element = ({ children }: { children: React.ReactNode }) => {
    if (post.sourceUrl) {
      return <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">{children}</a>
    } else {
      return children
    }
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Element>
        @{displayName}
      </Element>
      {isAttributed && showInfo && (
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Community contributed</p>
          </TooltipContent>
        </Tooltip>
      )}
    </span>
  );
};