import { Button } from "@/components/ui/button";
import { ArrowUp, Check, ChevronUp } from "lucide-react";
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

  const iconClasses = cn(
    isUpvoted ? "border-black/50 disabled:opacity-100" : "",
    "flex-col divide-y divide-border px-0 pt-3 h-auto"
  );

  const classes = cn(buttonVariants({ variant: "outline" }),
    "flex cursor-pointer divide-border border",
    variant === "icon" ? iconClasses : "divide-x border-black/50 px-3"
  );

  if (variant === "icon") {
    console.log({ count })
    return (
      <button
        className={classes}
        onClick={handleUpvote}
        disabled={isUpvoted || isLoading}
      >
        <div className="p-4 pb-3 pt-0">
          <ChevronUp className="size-5" />
        </div>

        <NumberFlow className="px-4" value={count} trend={0} format={{ notation: "compact" }} />
      </button>
    );
  }

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