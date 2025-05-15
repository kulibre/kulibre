import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (name: string) => void;
  parentFolderId: string | null;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  onCreateFolder,
  parentFolderId
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate folder name
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }
    
    // Validate folder name format
    if (folderName.includes('/') || folderName.includes('\\')) {
      setError("Folder name cannot contain slashes");
      return;
    }
    
    if (folderName.length > 255) {
      setError("Folder name is too long");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      // Actually create the folder
      await onCreateFolder(folderName.trim());
      setFolderName("");
      // Only close the dialog on success
      onOpenChange(false);
    } catch (error) {
      console.error("Folder creation error:", error);
      setError(error instanceof Error ? error.message : "Failed to create folder");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder {parentFolderId ? "inside the current folder" : "in your workspace"}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
              />
              {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
              )}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}