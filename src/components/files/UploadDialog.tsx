import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

export interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (file: File) => void;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
  currentFolderId: string | null;
}

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "error" | "complete";
  error?: string;
}

export function UploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
  maxFileSize = 500 * 1024 * 1024, // 500MB default
  allowedFileTypes = [
    "image/png", 
    "image/jpeg", 
    "image/jpg", 
    "image/gif", 
    "video/mp4", 
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/vnd.adobe.photoshop", // psd
    "application/illustrator" // ai
  ],
  currentFolderId
}: UploadDialogProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).map(file => {
      // Validate file size
      const isValidSize = file.size <= maxFileSize;
      // Validate file type
      const isValidType = allowedFileTypes.includes(file.type);

      return {
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: (!isValidSize || !isValidType) ? "error" : "pending",
        error: !isValidSize 
          ? `File exceeds maximum size of ${formatFileSize(maxFileSize)}`
          : !isValidType
            ? "File type not supported"
            : undefined
      } as FileUpload;
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0 || isUploading) return;
    
    setIsUploading(true);
    
    // Filter out files with errors
    const validFiles = files.filter(f => f.status !== "error");
    
    try {
      // Process each file
      for (const fileUpload of validFiles) {
        if (fileUpload.status === "error") continue;
        
        // Update status to uploading
        setFiles(prev => 
          prev.map(f => 
            f.id === fileUpload.id 
              ? { ...f, status: "uploading" } 
              : f
          )
        );
        
        try {
          // Set initial progress
          setFiles(prev => 
            prev.map(f => 
              f.id === fileUpload.id 
                ? { ...f, progress: 10 } 
                : f
            )
          );
          
          // Actual file upload
          await onUploadComplete(fileUpload.file);
          
          // Mark as complete
          setFiles(prev => 
            prev.map(f => 
              f.id === fileUpload.id 
                ? { ...f, progress: 100, status: "complete" } 
                : f
            )
          );
        } catch (error) {
          console.error('Error uploading file:', error);
          // Mark as error
          setFiles(prev => 
            prev.map(f => 
              f.id === fileUpload.id 
                ? { 
                    ...f, 
                    status: "error", 
                    error: error instanceof Error ? error.message : "Upload failed" 
                  } 
                : f
            )
          );
        }
      }
      
      // Check if all files were uploaded successfully
      const allComplete = validFiles.every(file => 
        files.find(f => f.id === file.id)?.status === "complete"
      );
      
      if (allComplete) {
        // Close dialog after a short delay
        setTimeout(() => {
          onOpenChange(false);
          // Reset files after dialog closes
          setTimeout(() => setFiles([]), 300);
        }, 1000);
      }
    } finally {
      // Always set uploading to false when done
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: FileUpload["status"]) => {
    switch (status) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "uploading":
        return (
          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-creatively-purple animate-spin" />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to {currentFolderId ? "the current folder" : "your workspace"}.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className={`mt-4 border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging ? "border-creatively-purple bg-creatively-purple/5" : "border-muted"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">Drag & drop files here</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              or click to browse your files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              accept={allowedFileTypes.join(",")}
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Select Files
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Maximum file size: {formatFileSize(maxFileSize)}
            </p>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-2 rounded-md bg-muted/50"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {getStatusIcon(file.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </p>
                    {file.error && (
                      <p className="text-xs text-destructive mt-0.5">{file.error}</p>
                    )}
                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="h-1 mt-1" />
                    )}
                  </div>
                </div>
                {file.status !== "complete" && (
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded-full hover:bg-muted-foreground/20 transition-colors"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Remove file</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {files.filter(f => f.status !== "error").length} file(s) ready to upload
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={uploadFiles}
              disabled={isUploading || files.filter(f => f.status !== "error").length === 0}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}