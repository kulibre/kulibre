import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Folder } from "lucide-react";

export interface FolderOption {
  id: string;
  name: string;
  parentId?: string;
}

export interface MoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (id: string, destinationFolderId: string | null) => void;
  itemId: string;
  itemName: string;
  itemType: "file" | "folder";
  currentFolderId: string | null;
  folders: FolderOption[];
}

export function MoveDialog({
  open,
  onOpenChange,
  onMove,
  itemId,
  itemName,
  itemType,
  currentFolderId,
  folders
}: MoveDialogProps) {
  const [destinationFolderId, setDestinationFolderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableFolders, setAvailableFolders] = useState<FolderOption[]>([]);

  // Filter out the current folder and the item itself if it's a folder
  useEffect(() => {
    if (open) {
      let filtered = folders;
      
      // If the item is a folder, filter out itself and its subfolders
      if (itemType === "folder") {
        filtered = folders.filter(folder => folder.id !== itemId);
        
        // Also filter out any potential child folders to prevent circular references
        const isChildFolder = (folderId: string, potentialParentId: string): boolean => {
          const folder = folders.find(f => f.id === folderId);
          if (!folder) return false;
          if (folder.parentId === potentialParentId) return true;
          if (folder.parentId) return isChildFolder(folder.parentId, potentialParentId);
          return false;
        };
        
        filtered = filtered.filter(folder => !isChildFolder(folder.id, itemId));
      }
      
      setAvailableFolders(filtered);
      
      // Reset selection
      setDestinationFolderId("");
    }
  }, [open, folders, itemId, itemType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinationFolderId) return;
    
    setIsSubmitting(true);
    
    // Handle root folder case
    const targetFolderId = destinationFolderId === "root" ? null : destinationFolderId;
    
    onMove(itemId, targetFolderId);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move {itemType === "file" ? "File" : "Folder"}</DialogTitle>
          <DialogDescription>
            Select a destination folder for "{itemName}".
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="destinationFolder">Destination Folder</Label>
              <Select
                value={destinationFolderId}
                onValueChange={setDestinationFolderId}
              >
                <SelectTrigger id="destinationFolder">
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      <span>Root (My Files)</span>
                    </div>
                  </SelectItem>
                  {availableFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        <span>{folder.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !destinationFolderId || destinationFolderId === currentFolderId}
            >
              {isSubmitting ? "Moving..." : "Move"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}