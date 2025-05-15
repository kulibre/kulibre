
export interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "video";
  size: number;
  content_type: string;
  path: string;
  parent_folder_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parent_folder_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  fileCount?: number;
}
