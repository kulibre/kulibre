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
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Link as LinkIcon } from "lucide-react";

export interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (id: string, isPublic: boolean) => void;
  itemId: string;
  itemName: string;
  itemType: "file" | "folder";
  isShared?: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  onShare,
  itemId,
  itemName,
  itemType,
  isShared = false
}: ShareDialogProps) {
  const [isPublic, setIsPublic] = useState(isShared);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate a fake share link
  const shareLink = `https://creatively.app/share/${itemId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onShare(itemId, isPublic);
      setIsSubmitting(false);
      // Don't close the dialog so user can copy the link
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {itemType === "file" ? "File" : "Folder"}</DialogTitle>
          <DialogDescription>
            Create a shareable link for "{itemName}".
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-access">Public Access</Label>
                <p className="text-xs text-muted-foreground">
                  Anyone with the link can view this {itemType}
                </p>
              </div>
              <Switch
                id="public-access"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            
            {(isPublic || isShared) && (
              <div className="grid gap-2 mt-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="share-link"
                    value={shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy link</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Close
            </Button>
            {!isShared && (
              <Button 
                type="submit"
                disabled={isSubmitting || !isPublic}
              >
                {isSubmitting ? "Generating Link..." : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Generate Link
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}