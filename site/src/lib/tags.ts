import { MessageCircle, Wind, Cloud } from "lucide-react";
import {
  SiAnthropic,
  SiClojure,
  SiReact,
  SiTailwindcss,
  SiAstro,
  SiRubyonrails,
  SiNextdotjs,
  SiVite,
  SiCloudflare
} from "@icons-pack/react-simple-icons";

export interface TagConfig {
  displayName: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// All tags defined in a single object
export const tagConfigs: Record<string, TagConfig> = {
  // Language/Library tags
  "lang:clojure": {
    displayName: "Clojure",
    icon: SiClojure
  },
  "lib:react": {
    displayName: "React",
    icon: SiReact
  },
  "lib:tailwindcss": {
    displayName: "Tailwind CSS",
    icon: SiTailwindcss
  },
  "lib:astro": {
    displayName: "Astro",
    icon: SiAstro
  },
  "lib:rails": {
    displayName: "Ruby on Rails",
    icon: SiRubyonrails
  },
  "lib:nextjs": {
    displayName: "Next.js",
    icon: SiNextdotjs
  },
  "lib:vite": {
    displayName: "Vite",
    icon: SiVite
  },

  // Tool tags
  "tool:cursor": {
    displayName: "Cursor",
  },
  "tool:claude-code": {
    displayName: "Claude Code",
    icon: SiAnthropic
  },
  "tool:windsurf": {
    displayName: "Windsurf",
    icon: Wind
  },

  // Workflow tags
  "type:prompt": {
    displayName: "Prompt",
    icon: MessageCircle
  },
  
  // Model tags
  "model:sonnet-3.7": {
    displayName: "Claude Sonnet 3.7",
    icon: SiAnthropic
  },
  
  // Platform tags
  "platform:cloudflare": {
    displayName: "Cloudflare",
    icon: SiCloudflare
  },
};

// Export all tags as a flat array
export const allTags = Object.keys(tagConfigs);

// Group tags by prefix (lang:, lib:, tool:, type:)
export function groupTagsByPrefix(tags: string[]): Record<string, string[]> {
  return tags.reduce(
    (acc, tag) => {
      const [prefix] = tag.split(":");
      if (prefix === "lang" || prefix === "lib" || prefix === "platform") {
        acc["Ecosystem"] = acc["Ecosystem"] || [];
        acc["Ecosystem"].push(tag);
      } else if (prefix === "tool") {
        acc["Tool"] = acc["Tool"] || [];
        acc["Tool"].push(tag);
      } else if (prefix === "type") {
        acc["Workflow"] = acc["Workflow"] || [];
        acc["Workflow"].push(tag);
      }
      // Note: model: tags are included in allTags but not displayed in any group
      return acc;
    },
    {} as Record<string, string[]>
  );
}

// Define the display order for groups
export const groupOrder = ["Ecosystem", "Tool", "Workflow"];