import { 
  Folder, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  FolderInput 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FolderCardProps {
  id: string;
  name: string;
  fileCount: number;
  modifiedAt: Date;
  onOpen: (id: string) => void;
  onRename: (id: string) => void;
  onMove: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
  view?: "grid" | "list";
}

export function FolderCard({
  id,
  name,
  fileCount,
  modifiedAt,
  onOpen,
  onRename,
  onMove,
  onDelete,
  className,
  view = "grid"
}: FolderCardProps) {
  if (view === "list") {
    return (
      <div 
        className={cn(
          "group flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer",
          className
        )}
        onClick={() => onOpen(id)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-md bg-creatively-purple/10 flex items-center justify-center">
              <Folder className="h-6 w-6 text-creatively-purple" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground">
              {fileCount} {fileCount === 1 ? 'file' : 'files'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            {formatDistanceToNow(modifiedAt, { addSuffix: true })}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-1 rounded-full hover:bg-muted transition-colors">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onRename(id);
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onMove(id);
              }}>
                <FolderInput className="mr-2 h-4 w-4" />
                <span>Move to folder</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-lg border overflow-hidden transition-all hover:shadow-md cursor-pointer",
        className
      )}
      onClick={() => onOpen(id)}
    >
      <div className="aspect-square p-2">
        <div className="w-full h-full rounded-md bg-creatively-purple/10 flex flex-col items-center justify-center">
          <Folder className="h-12 w-12 text-creatively-purple" />
          <span className="mt-2 text-sm font-medium">
            {fileCount} {fileCount === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>
      <div className="p-3 border-t">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">{name}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-1 rounded-full hover:bg-muted transition-colors">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onRename(id);
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onMove(id);
              }}>
                <FolderInput className="mr-2 h-4 w-4" />
                <span>Move to folder</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}