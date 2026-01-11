import { Github } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TopNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-14 gap-4">
          <TooltipProvider>
            {/* GitHub Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/<your-username>/image0.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Open source on GitHub"
                >
                  <Github className="w-5 h-5" />
                  <span className="sm:hidden text-sm">GitHub</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open source on GitHub</p>
              </TooltipContent>
            </Tooltip>

            {/* Buy Me a Coffee Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://www.buymeacoffee.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Support this project"
                >
                  <span className="text-base">☕</span>
                  <span className="sm:hidden text-sm">Buy me a coffee</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Support this project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;

