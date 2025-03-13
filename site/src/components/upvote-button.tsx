import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { actions } from "astro:actions";

interface UpvoteButtonProps {
  contextId: string;
}

export const UpvoteButton = ({ contextId }: UpvoteButtonProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpvote = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await actions.upvoteContext({
        contextId,
        // We could add userId here if we implement user authentication
      });

      if (result.data?.success) {
        setIsUpvoted(true);
      }
    } catch (error) {
      console.error('Failed to upvote:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
}; 