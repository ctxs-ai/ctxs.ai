import { Terminal, Bot, Wind, Code, Tag } from "lucide-react";
import { ContextTagLogo } from "./context-tag-logo";
import { buttonVariants } from "@/components/ui/button";
import { SiAnthropic } from "@icons-pack/react-simple-icons";
interface TagConfig {
  displayName: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const tagConfigs: Record<string, TagConfig> = {
  "type:prompt": {
    displayName: "Prompt",
  },
  "tool:cursor": {
    displayName: "Cursor",
  },
  "tool:claude-code": {
    displayName: "Claude Code",
    icon: SiAnthropic,
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
  "lib:tailwindcss": {
    displayName: "Tailwind CSS",
  },
  "lib:astro": {
    displayName: "Astro",
  },
  "lib:rails": {
    displayName: "Rails",
  },
  "lib:nextjs": {
    displayName: "Next.js",
  },
};

interface ContextTagsProps {
  tags?: string[];
}
export function ContextTag({ tag, href, isActive }: { tag: string, href?: string, isActive?: boolean }) {
  const config = tagConfigs[tag] || { displayName: tag, icon: Tag };
  const hrefx = href || `/weekly?tag=${tag}#search`;
  const Icon = config.icon;

  return (
    <a href={hrefx} className={buttonVariants({ variant: isActive ? "default" : "outline", size: "xs" })}
      style={{
        boxShadow: isActive ? "0 0 0 1px #ccc" : "none",
      }}>
      {!config.icon ? (
        <ContextTagLogo tag={tag} className={`size-3 ${isActive ? "text-white" : "text-foreground"}`} />
      ) : Icon ? (
        <Icon className="size-3" />
      ) : null}
      <span className="font-medium">{config.displayName}</span>
    </a>
  )
}

export function ContextTags({ tags }: ContextTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const config = tagConfigs[tag] || { displayName: tag, icon: Tag };
        const Icon = config.icon;

        return (
          <ContextTag tag={tag} />
        );
      })}
    </div>
  );
} 