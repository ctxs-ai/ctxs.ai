import { Button } from "@/components/ui/button"
import { signIn, signOut } from "@/lib/auth-client"
import { Github, Loader2, LogOut, Sparkles } from "lucide-react"
import { WordmarkLong } from "@/components/wordmark";
import { useSession } from "@/lib/auth-client";
import type { User } from "better-auth/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Avatar = ({ src, className }: { src?: string, className?: string }) => {
    return (
        <img className={cn("size-full aspect-square", className)} src={src} />
    )
}

const handleSignOut = async () => {
    await signOut()
    window.location.reload()
}

export const AccountMenu = ({ children }: { children: React.ReactNode }) => {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger className="cursor-pointer flex items-center gap-2">
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut} className="flex justify-between items-center">
                    Sign Out
                    <LogOut className="size-3" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const SignInButton = ({ size = "sm", variant = "outline", label = "Sign in", icon = <Github className="size-4 mr-1" /> }: { size?: "sm" | "default", variant?: "outline" | "default", label?: string, icon?: React.ReactNode }) => {
    const [clicked, setClicked] = useState(false)
    const handleClick = () => {
        setClicked(true)
        signIn()
    }
    return (
        <Button onClick={handleClick} size={size} variant={variant} className="text-sm">
            {clicked ? <Loader2 className="size-4 mr-1 animate-spin" /> : icon}
            {label}
        </Button>
    )
}

export const SubmitOrSignInButton = () => {
    const { data: session } = useSession();
    if (session) {
        return (<Button asChild><a href="/weekly/submit">Submit a Post</a></Button>)
    } else {
        return (<SignInButton />)
    }
}

export const Header = () => {
    const { data: session } = useSession();
    return (
        <div className="px-4 pt-3 pb-4 flex justify-between items-center">
            <a href="/">
                <WordmarkLong />
            </a>
            {session ? <AccountMenu user={session.user} /> : <SignInButton />}
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