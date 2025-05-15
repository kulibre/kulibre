import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileImage, FileVideo, Download, ExternalLink } from "lucide-react";
import { FileItem } from "@/types/files";

export interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileItem | null;
}

export function FilePreviewDialog({
  open,
  onOpenChange,
  file
}: FilePreviewDialogProps) {
  if (!file) return null;
  
  // Function to handle download
  const handleDownload = () => {
    // In a real app, this would trigger a file download
    // For now, we'll just simulate it with an alert
    alert(`Downloading file: ${file.name}`);
    
    // In a real implementation, you would do something like:
    // const url = URL.createObjectURL(fileBlob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = file.name;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  };
  
  // Function to open in new tab
  const handleOpenInNewTab = () => {
    // In a real app, this would open the file in a new tab
    // For now, we'll just simulate it with an alert
    alert(`Opening file in new tab: ${file.name}`);
    
    // In a real implementation, you would do something like:
    // window.open(fileUrl, '_blank');
  };

  const getFileIcon = () => {
    switch (file.type) {
      case "image":
        return <FileImage className="h-16 w-16 text-creatively-blue" />;
      case "video":
        return <FileVideo className="h-16 w-16 text-creatively-orange" />;
      case "document":
      default:
        return <FileText className="h-16 w-16 text-creatively-purple" />;
    }
  };

  const getFilePreview = () => {
    switch (file.type) {
      case "image":
        // In a real app, this would be the actual image URL
        return (
          <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <FileImage className="h-24 w-24 mx-auto text-creatively-blue mb-4" />
              <p className="text-muted-foreground">Image preview would appear here</p>
            </div>
          </div>
        );
      case "video":
        // In a real app, this would be a video player
        return (
          <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <FileVideo className="h-24 w-24 mx-auto text-creatively-orange mb-4" />
              <p className="text-muted-foreground">Video player would appear here</p>
            </div>
          </div>
        );
      case "document":
      default:
        // In a real app, this might be a PDF viewer or document preview
        return (
          <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-24 w-24 mx-auto text-creatively-purple mb-4" />
              <p className="text-muted-foreground">Document preview would appear here</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon()}
            <span>{file.name}</span>
          </DialogTitle>
          <DialogDescription>
            Preview and manage this file
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {getFilePreview()}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Last modified: {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              className="gap-2"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}