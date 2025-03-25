import { Button } from "@/components/ui/button";
import { ArrowUp, Check, ChevronUp, ChevronsUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { actions } from "astro:actions";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { navigate } from "astro:transitions/client";
interface UpvoteButtonProps {
  postId: string;
  postSlug: string;
  variant?: "header" | "icon";
  isUpvotedInitial: boolean;
  initialVoteCount: number;
}

export const UpvoteButton = ({ variant, postId, postSlug, isUpvotedInitial, initialVoteCount, ...props }: UpvoteButtonProps) => {
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
      } else {
        const redirectTo = `/weekly/${postSlug}`
        navigate(`/signin?verb=upvote&redirectTo=${redirectTo}`)
      }
    } catch (error) {
      // TODO implement proper error handling
      console.error('Failed to upvote:', error);
      navigate("/signin?verb=upvote")
    } finally {
      setIsLoading(false);
    }
  };

  const iconClasses = cn(
    "flex-col divide-y divide-border px-0 pt-3 h-auto",
    isUpvoted ? "border-black/50 divide-black/50 disabled:opacity-100" : ""
  );

  const classes = cn(buttonVariants({ variant: "outline" }),
    "flex cursor-pointer divide-border border",
    variant === "icon" ? iconClasses : "divide-x border-black/50 px-3"
  );

  if (variant === "icon") {
    return (
      <button
        data-s:event="Post upvoted" 
        className={classes}
        onClick={handleUpvote}
        disabled={isUpvoted || isLoading}
      >
        <div className="p-4 pb-3 pt-0 relative">
          <ChevronUp className="size-5 invisible" />
          <AnimatePresence>
            <motion.div
              className="absolute top-0"
              key={isUpvoted ? "voted" : "upvote"}
              initial={isUpvoted ? { opacity: 1, y: 10, scale: 0.9 } : { opacity: 1 }}
              transition={{ type: 'spring', duration: 0.9, bounce: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.7, transition: { type: 'spring', duration: 0.5, bounce: 0 } }}
            >
              {isUpvoted ? <ChevronsUp className="size-5" /> : <ChevronUp className="size-5" />}
            </motion.div>
          </AnimatePresence>
        </div>

        <NumberFlow className="px-4 font-mono" value={count} trend={0} format={{ notation: "compact" }} />
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
    <button
      data-s:event="Post upvoted" 
      className={classes}
      onClick={handleUpvote}
      disabled={isLoading}
    >
      <div className="relative w-20 h-full">
        <AnimatePresence>
          {isUpvoted ? <Voted key="voted" visible={isUpvoted} /> : <Upvote key="upvote" visible={!isUpvoted} />}
        </AnimatePresence>
      </div>
      <div className="w-[18px] ml-1 my-1">
        <NumberFlow className="font-mono" value={count} trend={0} format={{ notation: "compact" }} />
      </div>
    </button>
  );
}; 