import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const authorImage = (post: any) => {
  if (post.attributedGitHubUser) {
    return `https://github.com/${post.attributedGitHubUser}.png?size=32`;
  } else {
    return post.author?.image || `https://github.com/${post.author.githubUserName}.png?size=32`;
  }
};


export const AuthorName = ({ post, showInfo = true }: { post: any, showInfo?: boolean }) => {
  console.log({ post: post })
  const displayName = post.attributedGitHubUser
    ? `@${post.attributedGitHubUser}`
    : `@${post.author?.githubUserName}`;

  const isAttributed = post.attributedGitHubUser && post.attributedGitHubUser !== post.author.githubUserName;

  return (
    <span className="inline-flex items-center gap-1">
      {displayName}
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