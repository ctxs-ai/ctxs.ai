import { Terminal, Bot, Wind, Code, Tag } from "lucide-react";
import { ContextTagLogo } from "./context-tag-logo";

interface TagConfig {
  displayName: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const tagConfigs: Record<string, TagConfig> = {
  "tool:cursor": {
    displayName: "Cursor",
  },
  "tool:claude-code": {
    displayName: "Claude Code",
    icon: Bot,
  },
  "tool:windsurf": {
    displayName: "Windsurf",
    icon: Wind,
  },
  "lang:clojure": {
    displayName: "Clojure",
  },
  "lib:react": {
    displayName: "React",
  },
  "lib:astro": {
    displayName: "Astro",
  },
  "lib:nextjs": {
    displayName: "Next.js",
  },
};

interface ContextTagsProps {
  tags?: string[];
}

export function ContextTags({ tags }: ContextTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const config = tagConfigs[tag] || { displayName: tag, icon: Tag };
        const Icon = config.icon;

        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground border-border border-1 px-2 py-1 rounded-md"
          >
            {!config.icon ? (
              <ContextTagLogo tag={tag} className="h-3 w-3" />
            ) : Icon ? (
              <Icon className="h-3 w-3" />
            ) : null}
            <span className="font-medium">{config.displayName}</span>
          </span>
        );
      })}
    </div>
  );
} 