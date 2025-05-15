
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import * as fileService from '@/lib/services/file-service';
import { useToast } from '@/hooks/use-toast';
import { FileItem, FolderItem } from '@/types/files';

export function useFiles(parentFolderId: string | null = null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: files,
    isLoading: isLoadingFiles,
    error: filesError
  } = useQuery({
    queryKey: ['files', parentFolderId],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        console.log('User not authenticated in useFiles hook');
        return [];
      }
      
      let query = supabase
        .from('files')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('name', { ascending: true });
      
      // Handle null parent folder ID differently
      if (parentFolderId === null) {
        query = query.is('parent_folder_id', null);
      } else {
        query = query.eq('parent_folder_id', parentFolderId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching files:', error);
        throw new Error(`Error fetching files: ${error.message}`);
      }
      
      console.log('Files retrieved:', data?.length || 0);
      return data as FileItem[];
    },
    staleTime: 30000, // 30 seconds
    retry: 1
  });

  const {
    data: folders,
    isLoading: isLoadingFolders,
    error: foldersError
  } = useQuery({
    queryKey: ['folders', parentFolderId],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        console.log('User not authenticated in useFiles hook');
        return [];
      }
      
      let query = supabase
        .from('folders')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('name', { ascending: true });
      
      // Handle null parent folder ID differently
      if (parentFolderId === null) {
        query = query.is('parent_folder_id', null);
      } else {
        query = query.eq('parent_folder_id', parentFolderId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching folders:', error);
        throw new Error(`Error fetching folders: ${error.message}`);
      }
      
      // Get file counts for each folder (optional, can be removed if causing performance issues)
      const foldersWithCount = await Promise.all((data || []).map(async folder => {
        const { count, error: countError } = await supabase
          .from('files')
          .select('*', { count: 'exact', head: true })
          .eq('parent_folder_id', folder.id)
          .eq('user_id', userData.user.id);
          
        return {
          ...folder,
          fileCount: countError ? 0 : (count || 0)
        };
      }));
      
      console.log('Folders retrieved:', foldersWithCount?.length || 0);
      return foldersWithCount as FolderItem[];
    },
    staleTime: 30000, // 30 seconds
    retry: 1
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: ({ file, parentFolderId }: { file: File; parentFolderId: string | null }) =>
      fileService.uploadFile(file, parentFolderId),
    onSuccess: () => {
      // Invalidate the specific query for the current folder
      queryClient.invalidateQueries({ queryKey: ['files', parentFolderId] });
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully."
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your file.",
        variant: "destructive"
      });
    }
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: ({ name, parentFolderId }: { name: string; parentFolderId: string | null }) =>
      fileService.createFolder(name, parentFolderId),
    onSuccess: () => {
      // Invalidate the specific query for the current folder
      queryClient.invalidateQueries({ queryKey: ['folders', parentFolderId] });
      toast({
        title: "Folder created",
        description: "Your folder has been created successfully."
      });
    },
    onError: (error) => {
      console.error('Create folder error:', error);
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "There was an error creating your folder.",
        variant: "destructive"
      });
    }
  });

  // Delete mutations
  const deleteFileMutation = useMutation({
    mutationFn: ({ fileId, filePath }: { fileId: string; filePath: string }) =>
      fileService.deleteFile(fileId, filePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', parentFolderId] });
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the file.",
        variant: "destructive"
      });
    }
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => fileService.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', parentFolderId] });
      toast({
        title: "Folder deleted",
        description: "The folder and its contents have been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the folder.",
        variant: "destructive"
      });
    }
  });

  // Rename mutations
  const renameFileMutation = useMutation({
    mutationFn: ({ fileId, newName }: { fileId: string; newName: string }) =>
      fileService.renameFile(fileId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', parentFolderId] });
      toast({
        title: "File renamed",
        description: "The file has been renamed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Rename failed",
        description: "There was an error renaming the file.",
        variant: "destructive"
      });
    }
  });

  const renameFolderMutation = useMutation({
    mutationFn: ({ folderId, newName }: { folderId: string; newName: string }) =>
      fileService.renameFolder(folderId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', parentFolderId] });
      toast({
        title: "Folder renamed",
        description: "The folder has been renamed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Rename failed",
        description: "There was an error renaming the folder.",
        variant: "destructive"
      });
    }
  });
  
  // Move mutations
  const moveFileMutation = useMutation({
    mutationFn: ({ fileId, newFolderId }: { fileId: string; newFolderId: string | null }) =>
      fileService.moveFile(fileId, newFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: "File moved",
        description: "The file has been moved successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Move failed",
        description: "There was an error moving the file.",
        variant: "destructive"
      });
    }
  });

  const moveFolderMutation = useMutation({
    mutationFn: ({ folderId, newParentFolderId }: { folderId: string; newParentFolderId: string | null }) =>
      fileService.moveFolder(folderId, newParentFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast({
        title: "Folder moved",
        description: "The folder has been moved successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Move failed",
        description: error instanceof Error ? error.message : "There was an error moving the folder.",
        variant: "destructive"
      });
    }
  });

  return {
    files,
    folders,
    isLoading: isLoadingFiles || isLoadingFolders,
    error: filesError || foldersError,
    uploadFile: uploadFileMutation.mutateAsync,
    createFolder: createFolderMutation.mutateAsync,
    deleteFile: deleteFileMutation.mutateAsync,
    deleteFolder: deleteFolderMutation.mutateAsync,
    renameFile: renameFileMutation.mutateAsync,
    renameFolder: renameFolderMutation.mutateAsync,
    moveFile: moveFileMutation.mutateAsync,
    moveFolder: moveFolderMutation.mutateAsync,
    getFileUrl: fileService.getFileUrl,
  };
}
