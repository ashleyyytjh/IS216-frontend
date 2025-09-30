import { Info, PanelLeftClose } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function InfobarTrigger() {
  const { state, toggleSidebar } = useSidebar();
  const isOpen = state === "expanded";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent fixed"
          variant="secondary"
          size="icon"
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{isOpen ? "Hide" : "Information"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
