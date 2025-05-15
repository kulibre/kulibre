import { 
  Download, 
  FileText, 
  FileImage, 
  FileVideo, 
  File, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  FolderInput, 
  Link as LinkIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type FileType = "image" | "video" | "document" | "other";

export interface FileCardProps {
  id: string;
  name: string;
  type: FileType;
  size: number;
  modifiedAt: Date;
  thumbnail?: string;
  isShared?: boolean;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
  onMove: (id: string) => void;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
  className?: string;
  view?: "grid" | "list";
}

export function FileCard({
  id,
  name,
  type,
  size,
  modifiedAt,
  thumbnail,
  isShared = false,
  onDownload,
  onRename,
  onMove,
  onShare,
  onDelete,
  onClick,
  className,
  view = "grid"
}: FileCardProps) {
  const getFileIcon = () => {
    switch (type) {
      case "image":
        return <FileImage className="h-6 w-6 text-creatively-blue" />;
      case "video":
        return <FileVideo className="h-6 w-6 text-creatively-orange" />;
      case "document":
        return <FileText className="h-6 w-6 text-creatively-purple" />;
      default:
        return <File className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase();
  };

  if (view === "list") {
    return (
      <div className={cn(
        "group flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors",
        className
      )}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {thumbnail ? (
              <div className="w-10 h-10 rounded-md overflow-hidden">
                <img 
                  src={thumbnail} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                {getFileIcon()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{name}</p>
              {isShared && (
                <Badge variant="outline" className="bg-creatively-purple/10 text-creatively-purple text-xs">
                  Shared
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {getFileExtension(name)} • {formatFileSize(size)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            {formatDistanceToNow(modifiedAt, { addSuffix: true })}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-muted transition-colors">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload(id)}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(id)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(id)}>
                <FolderInput className="mr-2 h-4 w-4" />
                <span>Move to folder</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(id)}>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>Share link</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(id)}
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
    <div className={cn(
      "group relative bg-white rounded-lg border overflow-hidden transition-all hover:shadow-md",
      className
    )}>
      <div className="aspect-square p-2">
        {thumbnail ? (
          <div className="w-full h-full rounded-md overflow-hidden">
            <img 
              src={thumbnail} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full rounded-md bg-muted/50 flex flex-col items-center justify-center">
            {getFileIcon()}
            <span className="mt-2 text-xs font-medium text-muted-foreground">
              {getFileExtension(name)}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 border-t">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(size)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-muted transition-colors">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload(id)}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(id)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(id)}>
                <FolderInput className="mr-2 h-4 w-4" />
                <span>Move to folder</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(id)}>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>Share link</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isShared && (
          <Badge variant="outline" className="mt-2 bg-creatively-purple/10 text-creatively-purple text-xs">
            Shared
          </Badge>
        )}
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onDownload(id)}
          className="p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </button>
      </div>
    </div>
  );
}
