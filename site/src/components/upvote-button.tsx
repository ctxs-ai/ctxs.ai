import { Button } from "@/components/ui/button";
import { ArrowUp, Check, ThumbsUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { actions } from "astro:actions";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
interface UpvoteButtonProps {
  postId: string;
  variant?: "header" | "icon";
  isUpvotedInitial: boolean;
  initialVoteCount: number;
}

export const UpvoteButton = ({ variant, postId, isUpvotedInitial, initialVoteCount, ...props }: UpvoteButtonProps) => {
  const [isUpvoted, setIsUpvoted] = useState(isUpvotedInitial);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(initialVoteCount);

  const handleUpvote = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await actions.upvotePost({
        postId: parseInt(postId),
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
    "flex cursor-pointer divide-x divide-border border border-black/50 px-3",);

  const Upvote = ({ visible }: { visible: boolean }) => {
    return (
      <motion.div
        key="upvote"
        className="pr-3 absolute top-0 flex items-center gap-2"
        initial={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        Upvote
        <ArrowUp className="size-4" />
      </motion.div>
    )
  }
  const Voted = ({ visible }: { visible: boolean }) => {
    return (
      <motion.div
        key="voted"
        className="pr-3 absolute top-0 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        Voted
        <Check className="size-4" />
      </motion.div>

    )
  }

  return (
    <button className={classes} onClick={handleUpvote} disabled={isLoading}>
      <div className="relative w-20 h-full">
        <AnimatePresence>
          {isUpvoted ? <Voted key="voted" visible={isUpvoted} /> : <Upvote key="upvote" visible={!isUpvoted} />}
        </AnimatePresence>
      </div>
      <div className="w-[18px] ml-1 my-1">
        <NumberFlow value={count} trend={0} format={{ notation: "compact" }} />
      </div>
    </button>
  );
}; 