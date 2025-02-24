import { cn } from "@/lib/utils";
import { ContextList } from "./context-list";
import type { CollectionEntry } from "astro:content";
import React from "react";
import { Button } from "@/components/ui/button"
import { Github, Sparkles } from "lucide-react"

type SidebarProps = {
    contexts: CollectionEntry<"contexts">[];
    selectedContext: CollectionEntry<"contexts"> | null;
};

export const Header = () => {
    return (
        <div className="p-4 flex justify-between items-center">
            <span className="font-bold">ctxs.ai Context Registry</span>
            <a href="https://github.com/ctxs-ai/ctxs.ai" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Github className="h-3 w-3 mr-1" />
                    Contribute
                </Button>
            </a>
        </div>
    )
}

export const SidebarIntro = () => {
    return (
        <div className="px-4 pb-4 border-b border-border">
            <p className="text-lg leading-tight text-muted-foreground">
                An open-source, community-curated registry of contexts for use with LLMs
            </p>
            <div className="flex items-center gap-2 pt-2">
                <Sparkles className="size-4 flex-none" />
                <p className="text-xs text-muted-foreground">
                    this site and the ctxs registry are a work in progress, feel free to <a href="https://x.com/martinklepsch" className="text-primary underline" target="_blank" rel="noopener noreferrer">contact me</a> if you have any questions or feedback!
                </p>
            </div>
        </div>
    )
}

export function Sidebar({ contexts, selectedContext }: SidebarProps) {
    const scrollableRef = React.useRef<HTMLDivElement>(null);

    const persistScrollPos = (e: React.UIEvent<HTMLDivElement>) => {
        sessionStorage.setItem("sidebarScroll", e.currentTarget.scrollTop.toString());
    };

    React.useEffect(() => {
        const scrollPos = sessionStorage.getItem("sidebarScroll");
        if (scrollPos) {
            scrollableRef.current?.scrollTo({ left: 0, top: parseInt(scrollPos), behavior: 'instant' });
        }
    }, []);

    return (
        <div
            className={cn(
                "w-full md:w-[400px] flex flex-col",
                selectedContext && "hidden md:flex",
            )}
        >
            <div className="sticky top-0 z-10 bg-secondary shadow-sm border-r border-border">
                <Header />
                <SidebarIntro />
            </div>
            <div className="flex-grow overflow-y-auto"
                ref={scrollableRef}
                onScroll={persistScrollPos}
            >
                <ContextList contexts={contexts} selectedId={selectedContext?.id} />
            </div>
        </div>
    )
}
