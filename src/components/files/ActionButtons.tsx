
import { Upload, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onUpload: () => void;
  onCreateFolder: () => void;
}

export function ActionButtons({ onUpload, onCreateFolder }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        className="gap-2"
        onClick={onUpload}
      >
        <Upload className="h-4 w-4" />
        Upload Files
      </Button>
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={onCreateFolder}
      >
        <FolderPlus className="h-4 w-4" />
        New Folder
      </Button>
    </div>
  );
}
