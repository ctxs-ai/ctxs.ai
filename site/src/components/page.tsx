import { useState } from "react"
import { Github, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ContextList } from "@/components/context-list"
import { ContextView } from "@/components/context-view"
import { SAMPLE_CONTEXTS } from "@/lib/sample-data"
import type { Context } from "@/lib/types"
import { useSearchParams } from "wouter"

export default function Page({ contexts }: { contexts: Context[] }) {
  const [searchParams] = useSearchParams()
  const [isMobileListVisible, setIsMobileListVisible] = useState(true)
  console.log(searchParams)
  const selectedCtxId = searchParams.get("ctx")
  const selectedContext = contexts.find((ctx) => ctx.id === selectedCtxId)
  console.log(selectedContext)

  const toggleMobileList = () => {
    setIsMobileListVisible(!isMobileListVisible)
  }
  console.log(contexts)

  const Header = () => {
    return (
      <div className="p-4 flex justify-between items-center">
        <span className="font-bold">ctxs.ai Context Registry</span>
        <a href="https://github.com/ctxs-ai/ctxs.ai" target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="h-7 text-xs">
            <Github className="h-3 w-3 mr-1" />
            Contribute
          </Button>
        </a>
      </div>
    )
  }

  const SidebarIntro = () => {
    return (
      <div className="px-4 pb-4 border-b border-[#0000000d]">
        <p className="text-sm text-muted-foreground">
          an open-source, community-curated registry of contexts for use with LLMs
        </p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div
        className={cn(
          "w-full md:w-[400px] flex flex-col border-r border-[#0000000d]",
          !isMobileListVisible && "hidden md:flex",
        )}
      >
        <div className="sticky top-0 z-10 bg-secondary shadow-sm">
          <Header />
          <SidebarIntro />
        </div>
        <div className="flex-grow overflow-y-auto">
          <ContextList contexts={contexts} />
        </div>
      </div>

      <div className={cn("flex-1 flex flex-col", isMobileListVisible && "hidden md:flex")}>
        <div className="sticky top-0 z-10 bg-background md:hidden">
          <div className="p-3 flex justify-between items-center border-b border-[#0000000d]">
            <Button variant="ghost" size="sm" onClick={toggleMobileList}>
              <Menu className="h-4 w-4 mr-1" />
              Menu
            </Button>
            <span className="font-bold">ctxs.ai</span>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <ContextView context={selectedContext} />
        </div>
      </div>
    </div>
  )
}

