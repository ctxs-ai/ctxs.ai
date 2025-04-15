import { Tag } from 'lucide-react';
import { ContextTagLogo } from './context-tag-logo';
import { buttonVariants } from '@/components/ui/button';
import { tagConfigs } from '@/lib/tags';
interface TagConfig {
  displayName: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ContextTagsProps {
  tags?: string[];
}
export function ContextTag({
  tag,
  href,
  isActive,
}: {
  tag: string;
  href?: string;
  isActive?: boolean;
}) {
  const config = tagConfigs[tag] || { displayName: tag, icon: Tag };
  const hrefx = href || `/weekly?tag=${tag}#search`;
  const Icon = config.icon;

  return (
    <a
      href={hrefx}
      className={buttonVariants({
        variant: isActive ? 'default' : 'outline',
        size: 'xs',
      })}
      style={{
        boxShadow: isActive ? '0 0 0 1px #ccc' : 'none',
      }}
    >
      {!config.icon ? (
        <ContextTagLogo
          tag={tag}
          className={`size-3 ${isActive ? 'text-background' : 'text-foreground'}`}
        />
      ) : Icon ? (
        <Icon className="size-3" />
      ) : null}
      <span className="font-medium">{config.displayName}</span>
    </a>
  );
}

export function ContextTags({ tags }: ContextTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const config = tagConfigs[tag] || { displayName: tag, icon: Tag };
        const Icon = config.icon;
        return <ContextTag key={tag} tag={tag} />;
      })}
    </div>
  );
}
