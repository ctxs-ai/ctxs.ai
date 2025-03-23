import { Button } from "@/components/ui/button";
import { ArrowUp, Check, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { actions } from "astro:actions";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
interface UpvoteButtonProps {
  postId: string;
  variant?: "header" | "icon";
}

export const UpvoteButton = ({ variant, postId, children, ...props }: UpvoteButtonProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const handleUpvote = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await actions.upvotePost({
        postId: parseInt(postId),
        // We could add userId here if we implement user authentication
      });

      if (result.data?.success) {
        setIsUpvoted(true);
        setCount(count + 1);
      }
    } catch (error) {
      // TODO implement proper error handling
      console.error('Failed to upvote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleUpvote}
        disabled={isUpvoted || isLoading}
        className={isUpvoted ? "text-primary border-primary" : ""}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
    );
  }

  const classes = cn(buttonVariants({ variant: "outline" }),
    "flex cursor-pointer divide-x divide-border border border-black/50",);

  const Upvote = ({ visible }: { visible: boolean }) => {
    return (
      <div className={cn("py-1 pr-4 flex items-center gap-2 transition-opacity duration-300", { "opacity-0": !visible })}>
        Upvote
        <ArrowUp className="size-4" />
      </div>
    )
  }
  const Upvoted = ({ visible }: { visible: boolean }) => {
    return (
      <div className={cn("transition:an py-1 pr-4 flex items-center gap-2 transition-opacity duration-300", { "opacity-0": !visible })}>
        Upvoted
        <Check className="size-4" />
      </div>

    )
  }

  return (
    <button className={classes} onClick={handleUpvote} disabled={isLoading}>
      {isUpvoted ? <Upvoted visible={isUpvoted} /> : <Upvote visible={!isUpvoted} />}
      <div className="w-[18px] ml-1 my-1">
        <NumberFlow value={count} trend={0} format={{ notation: "compact" }} />
      </div>
    </button>
  );
}; 