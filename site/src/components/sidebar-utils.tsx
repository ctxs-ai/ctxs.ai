import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import { Github, Sparkles } from "lucide-react"
import { WordmarkLong } from "@/components/wordmark";

export const ContributeButton = () => {
    return (
        <Button onClick={signIn} size="sm" variant="outline" className="h-7 text-xs">
            <Github className="h-3 w-3 mr-1" />
            Contribute
        </Button>
    )
}

export const Header = () => {
    return (
        <div className="px-4 pt-3 pb-4 flex justify-between items-center">
            <a href="/">
                <WordmarkLong />
            </a>
            <ContributeButton />
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