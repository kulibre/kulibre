
import { supabase } from '@/integrations/supabase/client';
import { FileItem, FolderItem } from '@/types/files';

// Upload a file to Supabase Storage
export async function uploadFile(file: File, parentFolderId: string | null = null): Promise<FileItem> {
  try {
    // Generate a unique file path to avoid collisions
    const uniquePrefix = Date.now().toString();
    const filePath = `${uniquePrefix}_${file.name}`;
    
    // First, upload the file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (storageError) {
      throw new Error(`Storage error: ${storageError.message}`);
    }
    
    // Then, create a record in the files table
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const userId = userData.user.id;
    
    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .insert({
        name: file.name,
        path: filePath,
        size: file.size,
        type: determineFileType(file.name),
        content_type: file.type,
        user_id: userId,
        parent_folder_id: parentFolderId
      })
      .select('*')
      .single();
    
    if (fileError) {
      // If the file record could not be created, try to delete the uploaded file
      await supabase.storage.from('files').remove([filePath]);
      throw new Error(`Database error: ${fileError.message}`);
    }
    
    return fileRecord as unknown as FileItem;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

// Create a new folder in the database
export async function createFolder(name: string, parentFolderId: string | null = null): Promise<FolderItem> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const userId = userData.user.id;
    
    const { data, error } = await supabase
      .from('folders')
      .insert({
        name,
        parent_folder_id: parentFolderId,
        user_id: userId
      })
      .select('*')
      .single();
    
    if (error) {
      throw new Error(`Error creating folder: ${error.message}`);
    }
    
    return data as unknown as FolderItem;
  } catch (error) {
    console.error('Error in createFolder:', error);
    throw error;
  }
}

// Delete a file (both from storage and database)
export async function deleteFile(fileId: string, filePath: string): Promise<void> {
  try {
    // First delete from storage
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([filePath]);
    
    if (storageError) {
      throw new Error(`Storage error: ${storageError.message}`);
    }
    
    // Then delete from the database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);
    
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
}

// Delete a folder and all its contents
export async function deleteFolder(folderId: string): Promise<void> {
  try {
    // Get all files in this folder
    const { data: files } = await supabase
      .from('files')
      .select('*')
      .eq('parent_folder_id', folderId);
    
    // Get all subfolders in this folder
    const { data: subfolders } = await supabase
      .from('folders')
      .select('*')
      .eq('parent_folder_id', folderId);
    
    // Recursively delete subfolders
    if (subfolders && subfolders.length > 0) {
      await Promise.all(subfolders.map(subfolder => deleteFolder(subfolder.id)));
    }
    
    // Delete all files in folder
    if (files && files.length > 0) {
      // First, delete files from storage
      const filePaths = files.map(file => file.path);
      await supabase.storage.from('files').remove(filePaths);
      
      // Then, delete records from database
      await Promise.all(files.map(file => {
        return supabase
          .from('files')
          .delete()
          .eq('id', file.id);
      }));
    }
    
    // Finally, delete the folder itself
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);
    
    if (error) {
      throw new Error(`Error deleting folder: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteFolder:', error);
    throw error;
  }
}

// Rename a file
export async function renameFile(fileId: string, newName: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('files')
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('id', fileId);
    
    if (error) {
      throw new Error(`Error renaming file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in renameFile:', error);
    throw error;
  }
}

// Rename a folder
export async function renameFolder(folderId: string, newName: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('folders')
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('id', folderId);
    
    if (error) {
      throw new Error(`Error renaming folder: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in renameFolder:', error);
    throw error;
  }
}

// Move a file to a different folder
export async function moveFile(fileId: string, newFolderId: string | null): Promise<void> {
  try {
    const { error } = await supabase
      .from('files')
      .update({ 
        parent_folder_id: newFolderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);
    
    if (error) {
      throw new Error(`Error moving file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in moveFile:', error);
    throw error;
  }
}

// Move a folder to a different parent folder
export async function moveFolder(folderId: string, newParentFolderId: string | null): Promise<void> {
  try {
    // Check for circular reference (can't move a folder inside itself or its descendants)
    if (newParentFolderId) {
      const isDescendant = await isDescendantFolder(newParentFolderId, folderId);
      if (isDescendant) {
        throw new Error("Cannot move a folder into itself or its descendant");
      }
    }
    
    const { error } = await supabase
      .from('folders')
      .update({ 
        parent_folder_id: newParentFolderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', folderId);
    
    if (error) {
      throw new Error(`Error moving folder: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in moveFolder:', error);
    throw error;
  }
}

// Check if folder is a descendant of another folder (for cycle detection)
async function isDescendantFolder(folderId: string, potentialParentId: string): Promise<boolean> {
  let currentFolderId = folderId;
  
  while (currentFolderId) {
    if (currentFolderId === potentialParentId) {
      return true;
    }
    
    const { data } = await supabase
      .from('folders')
      .select('parent_folder_id')
      .eq('id', currentFolderId)
      .single();
    
    if (!data || !data.parent_folder_id) {
      return false;
    }
    
    currentFolderId = data.parent_folder_id;
  }
  
  return false;
}

// Get URL for a file in storage
export async function getFileUrl(filePath: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from('files')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (error) {
      throw new Error(`Error getting file URL: ${error.message}`);
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getFileUrl:', error);
    throw error;
  }
}

// Helper function to determine file type
function determineFileType(fileName: string): "image" | "document" | "video" {
  const extension = fileName.split('.').pop()?.toLowerCase() || "";
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
    return "image";
  }
  
  if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
    return "video";
  }
  
  return "document";
}
