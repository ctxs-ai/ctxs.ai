import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const authorImage = (post: any) => {
  if (post.attributedGitHubUser) {
    return `https://avatars.ctxs.ai/github/${post.attributedGitHubUser}/32`;
  } else if (post.attributedXUser) {
    return `https://avatars.ctxs.ai/x/${post.attributedXUser}/32`;
  } else {
    return post.author?.image || `https://avatars.ctxs.ai/github/${post.author.githubUserName}/32`;
  }
};


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
            <p>This was submitted by someone else</p>
          </TooltipContent>
        </Tooltip>
      )}
    </span>
  );
};