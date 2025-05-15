
import { FileItem, FolderItem } from "@/types/files";
import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";

interface FileListProps {
  files: FileItem[];
  folders: FolderItem[];
  view: "grid" | "list";
  onFileClick: (file: FileItem) => void;
  onFolderClick: (folderId: string, folderName: string) => void;
  onFileDownload: (fileId: string, filePath: string) => void;
  onFileRename: (fileId: string) => void;
  onFolderRename: (folderId: string) => void;
  onFileMove: (fileId: string) => void;
  onFolderMove: (folderId: string) => void;
  onFileDelete: (fileId: string) => void;
  onFolderDelete: (folderId: string) => void;
}

export function FileList({
  files,
  folders,
  view,
  onFileClick,
  onFolderClick,
  onFileDownload,
  onFileRename,
  onFolderRename,
  onFileMove,
  onFolderMove,
  onFileDelete,
  onFolderDelete,
}: FileListProps) {
  if (folders.length === 0 && files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {folders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Folders</h2>
          <div className={`grid gap-4 ${
            view === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {folders.map(folder => (
              <FolderCard
                key={folder.id}
                id={folder.id}
                name={folder.name}
                fileCount={folder.fileCount || 0}
                modifiedAt={new Date(folder.updated_at)}
                view={view}
                onOpen={() => onFolderClick(folder.id, folder.name)}
                onRename={() => onFolderRename(folder.id)}
                onMove={() => onFolderMove(folder.id)}
                onDelete={() => onFolderDelete(folder.id)}
              />
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Files</h2>
          <div className={`grid gap-4 ${
            view === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {files.map(file => (
              <FileCard
                key={file.id}
                id={file.id}
                name={file.name}
                type={file.type}
                size={file.size}
                modifiedAt={new Date(file.updated_at)}
                view={view}
                onShare={() => {}}
                onDownload={() => onFileDownload(file.id, file.path)}
                onRename={() => onFileRename(file.id)}
                onMove={() => onFileMove(file.id)}
                onDelete={() => onFileDelete(file.id)}
                onClick={() => onFileClick(file)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
