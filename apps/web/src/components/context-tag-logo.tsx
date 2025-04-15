import * as React from "react";
import { tagConfigs } from "@/lib/tags";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  tag: string;
}

// Cursor icon still needs special handling for the image
const specialLogos: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "tool:cursor": (props) => (
    <img src='/img/cursor.webp' className={props.className} />
  ),
};

export function ContextTagLogo({ tag, className, ...props }: LogoProps) {
  // First check if we have a special logo that needs custom handling
  if (specialLogos[tag]) {
    const SpecialLogo = specialLogos[tag];
    return <SpecialLogo className={className} {...props} />;
  }
  
  // Then check if we have an icon in the tagConfigs
  const config = tagConfigs[tag];
  if (config?.icon) {
    const Icon = config.icon;
    return <Icon className={className} {...props} />;
  }
  
  // If no icon found
  return null;
} 