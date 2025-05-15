import { useState } from "react";
import { useFiles } from "@/hooks/useFiles";
import { FilePreviewDialog } from "@/components/files/FilePreviewDialog";
import { UploadDialog } from "@/components/files/UploadDialog";
import { CreateFolderDialog } from "@/components/files/CreateFolderDialog";
import { RenameDialog } from "@/components/files/RenameDialog";
import { DeleteDialog } from "@/components/files/DeleteDialog";
import { MoveDialog } from "@/components/files/MoveDialog";
import { EmptyState } from "@/components/files/EmptyState";
import { BreadcrumbNav } from "@/components/files/BreadcrumbNav";
import { ActionButtons } from "@/components/files/ActionButtons";
import { SearchBar } from "@/components/files/SearchBar";
import { ViewModeToggle } from "@/components/files/ViewModeToggle";
import { FileList } from "@/components/files/FileList";
import type { FileItem } from "@/types/files";

export default function Files() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string | null, name: string}[]>([
    { id: null, name: "Home" }
  ]);
  
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{id: string, name: string, type: "file" | "folder"} | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string, type: "file" | "folder", path?: string} | null>(null);
  
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<{id: string, name: string, type: "file" | "folder"} | null>(null);

  const {
    files,
    folders,
    isLoading,
    uploadFile,
    createFolder,
    deleteFile,
    deleteFolder,
    renameFile,
    renameFolder,
    moveFile,
    moveFolder,
    getFileUrl
  } = useFiles(currentFolderId);

  const filteredFolders = folders?.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const filteredFiles = files?.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleUploadComplete = async (file: File) => {
    try {
      return await uploadFile({
        file,
        parentFolderId: currentFolderId
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      return await createFolder({
        name,
        parentFolderId: currentFolderId
      });
    } catch (error) {
      console.error('Create folder error:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'file') {
        await deleteFile({
          fileId: itemToDelete.id,
          filePath: itemToDelete.path || ''
        });
      } else {
        await deleteFolder(itemToDelete.id);
      }
      setItemToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const handleRename = async (newName: string) => {
    if (!itemToRename) return;

    try {
      if (itemToRename.type === 'file') {
        await renameFile({
          fileId: itemToRename.id,
          newName
        });
      } else {
        await renameFolder({
          folderId: itemToRename.id,
          newName
        });
      }
      setItemToRename(null);
      setRenameDialogOpen(false);
    } catch (error) {
      console.error('Rename error:', error);
      throw error;
    }
  };

  const handleMove = async (destinationFolderId: string | null) => {
    if (!itemToMove) return;

    try {
      if (itemToMove.type === 'file') {
        await moveFile({
          fileId: itemToMove.id,
          newFolderId: destinationFolderId
        });
      } else {
        await moveFolder({
          folderId: itemToMove.id,
          newParentFolderId: destinationFolderId
        });
      }
      setItemToMove(null);
      setMoveDialogOpen(false);
    } catch (error) {
      console.error('Move error:', error);
      throw error;
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === 0) {
      setCurrentFolderId(null);
      setBreadcrumbs([{ id: null, name: "Home" }]);
      return;
    }
    
    const targetCrumb = breadcrumbs[index];
    setCurrentFolderId(targetCrumb.id);
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Files</h1>
        <p className="text-muted-foreground mt-1">Manage your project files</p>
      </div>

      <BreadcrumbNav 
        folderPath={breadcrumbs.slice(1)}
        onNavigate={(_, index) => navigateToBreadcrumb(index)}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex items-center gap-2">
          <ActionButtons
            onUpload={() => setUploadDialogOpen(true)}
            onCreateFolder={() => setCreateFolderDialogOpen(true)}
          />
          <ViewModeToggle
            view={view}
            onViewChange={setView}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-creatively-purple"></div>
            <p className="text-muted-foreground">Loading files and folders...</p>
          </div>
        </div>
      ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
        <EmptyState
          onUpload={() => setUploadDialogOpen(true)}
          onCreateFolder={() => setCreateFolderDialogOpen(true)}
          currentFolderId={currentFolderId}
        />
      ) : (
        <FileList
          files={filteredFiles}
          folders={filteredFolders}
          view={view}
          onFileClick={(file) => {
            setSelectedFile(file);
            setPreviewDialogOpen(true);
          }}
          onFolderClick={navigateToFolder}
          onFileDownload={async (fileId, filePath) => {
            const url = await getFileUrl(filePath);
            window.open(url, '_blank');
          }}
          onFileRename={(id) => {
            const file = files?.find(f => f.id === id);
            if (file) {
              setItemToRename({ id, name: file.name, type: "file" });
              setRenameDialogOpen(true);
            }
          }}
          onFolderRename={(id) => {
            const folder = folders?.find(f => f.id === id);
            if (folder) {
              setItemToRename({ id, name: folder.name, type: "folder" });
              setRenameDialogOpen(true);
            }
          }}
          onFileMove={(id) => {
            const file = files?.find(f => f.id === id);
            if (file) {
              setItemToMove({ id, name: file.name, type: "file" });
              setMoveDialogOpen(true);
            }
          }}
          onFolderMove={(id) => {
            const folder = folders?.find(f => f.id === id);
            if (folder) {
              setItemToMove({ id, name: folder.name, type: "folder" });
              setMoveDialogOpen(true);
            }
          }}
          onFileDelete={(id) => {
            const file = files?.find(f => f.id === id);
            if (file) {
              setItemToDelete({ id, name: file.name, type: "file", path: file.path });
              setDeleteDialogOpen(true);
            }
          }}
          onFolderDelete={(id) => {
            const folder = folders?.find(f => f.id === id);
            if (folder) {
              setItemToDelete({ id, name: folder.name, type: "folder" });
              setDeleteDialogOpen(true);
            }
          }}
        />
      )}

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
        currentFolderId={currentFolderId}
      />
      
      <CreateFolderDialog
        open={createFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
        parentFolderId={currentFolderId}
      />
      
      <FilePreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        file={selectedFile}
      />
      
      {itemToRename && (
        <RenameDialog
          open={renameDialogOpen}
          onOpenChange={setRenameDialogOpen}
          onRename={handleRename}
          itemId={itemToRename.id}
          currentName={itemToRename.name}
          itemType={itemToRename.type}
        />
      )}
      
      {itemToDelete && (
        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={handleDelete}
          itemId={itemToDelete.id}
          itemName={itemToDelete.name}
          itemType={itemToDelete.type}
        />
      )}
      
      {itemToMove && folders && (
        <MoveDialog
          open={moveDialogOpen}
          onOpenChange={setMoveDialogOpen}
          onMove={handleMove}
          itemId={itemToMove.id}
          itemName={itemToMove.name}
          itemType={itemToMove.type}
          currentFolderId={currentFolderId}
          folders={folders.map(folder => ({
            id: folder.id,
            name: folder.name,
            parentId: folder.parent_folder_id || undefined
          }))}
        />
      )}
    </div>
  );
}
