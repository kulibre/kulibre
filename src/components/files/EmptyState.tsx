import { FolderOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  onUpload: () => void;
  onCreateFolder: () => void;
  currentFolderId?: string;
}

export function EmptyState({
  onUpload,
  onCreateFolder,
  currentFolderId
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-creatively-purple/10 flex items-center justify-center mb-4">
        <FolderOpen className="h-10 w-10 text-creatively-purple" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {currentFolderId 
          ? "This folder is empty" 
          : "No files uploaded yet"}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {currentFolderId
          ? "Start by uploading files or creating subfolders in this location."
          : "Start by uploading your first project files or creating folders to organize your work."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
        <Button variant="outline" onClick={onCreateFolder} className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Create Folder
        </Button>
      </div>
    </div>
  );
}