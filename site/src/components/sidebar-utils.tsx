import { Button } from "@/components/ui/button"
import { signIn, signOut } from "@/lib/auth-client"
import { Github, LogOut, Sparkles } from "lucide-react"
import { WordmarkLong } from "@/components/wordmark";
import { useSession } from "@/lib/auth-client";
import type { User } from "better-auth/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const UserAvatar = ({ user }: { user: User }) => {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger className="cursor-pointer flex items-center gap-2">
                <Avatar className="size-5">
                    <AvatarImage src={user.image ?? undefined} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut} className="flex justify-between items-center">
                    Sign Out
                    <LogOut className="size-3" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}
export const SignInButton = () => {
    return (
        <Button onClick={signIn} size="sm" variant="outline" className="h-7 text-xs">
            <Github className="size-4 mr-1" />
            Sign in
        </Button>
    )
}

export const Header = () => {
    const { data: session } = useSession();
    return (
        <div className="px-4 pt-3 pb-4 flex justify-between items-center">
            <a href="/">
                <WordmarkLong />
            </a>
            {session ? <UserAvatar user={session.user} /> : <SignInButton />}
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