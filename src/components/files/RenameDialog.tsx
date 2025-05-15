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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (id: string, newName: string) => void;
  itemId: string;
  currentName: string;
  itemType: "file" | "folder";
}

export function RenameDialog({
  open,
  onOpenChange,
  onRename,
  itemId,
  currentName,
  itemType
}: RenameDialogProps) {
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Set the current name when the dialog opens
  useEffect(() => {
    if (open) {
      setNewName(currentName);
      setError("");
    }
  }, [open, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate new name
    if (!newName.trim()) {
      setError(`${itemType === "file" ? "File" : "Folder"} name cannot be empty`);
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onRename(itemId, newName);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename {itemType === "file" ? "File" : "Folder"}</DialogTitle>
          <DialogDescription>
            Enter a new name for this {itemType}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newName">New Name</Label>
              <Input
                id="newName"
                placeholder={`Enter new ${itemType} name`}
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
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
              disabled={isSubmitting || newName === currentName}
            >
              {isSubmitting ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}