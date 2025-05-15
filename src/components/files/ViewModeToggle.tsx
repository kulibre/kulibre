
import { Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewModeToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewModeToggle({ view, onViewChange }: ViewModeToggleProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("grid")}
      >
        <Grid2X2 className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  );
}
