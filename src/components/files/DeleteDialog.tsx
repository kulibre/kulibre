import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  itemId: string;
  itemName: string;
  itemType: "file" | "folder";
  fileCount?: number; // Only for folders
}

export function DeleteDialog({
  open,
  onOpenChange,
  onDelete,
  itemId,
  itemName,
  itemType,
  fileCount = 0
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      onDelete(itemId);
      setIsDeleting(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {itemType === "file" ? "File" : "Folder"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {itemType === "folder" && fileCount > 0 ? (
              <>
                This folder contains <strong>{fileCount}</strong> {fileCount === 1 ? "file" : "files"}. 
                Deleting this folder will permanently remove all files inside it.
              </>
            ) : (
              <>
                Are you sure you want to delete "{itemName}"? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}