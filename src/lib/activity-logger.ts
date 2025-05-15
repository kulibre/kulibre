import { supabase } from "@/integrations/supabase/client";

export interface LogActivityParams {
  userId: string;
  actionType: 
    | 'task_created' 
    | 'task_updated' 
    | 'task_completed' 
    | 'project_created' 
    | 'project_updated' 
    | 'comment_added' 
    | 'team_member_added' 
    | 'event_created' 
    | 'file_uploaded';
  entityType: 'task' | 'project' | 'team_member' | 'event' | 'file' | 'comment';
  entityId: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Logs an activity to the activity_logs table
 * @param params Activity parameters
 * @returns Promise with the result of the operation
 */
export async function logActivity(params: LogActivityParams) {
  try {
    // Check if activity_logs table exists
    const { error: tableCheckError } = await supabase
      .from('activity_logs')
      .select('id')
      .limit(1);

    // If table doesn't exist, log error and return
    if (tableCheckError) {
      console.error("Activity logs table doesn't exist:", tableCheckError);
      return { success: false, error: tableCheckError };
    }

    // Insert activity log
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: params.userId,
        action_type: params.actionType,
        entity_type: params.entityType,
        entity_id: params.entityId,
        description: params.description,
        metadata: params.metadata || {},
      })
      .select();

    if (error) {
      console.error("Error logging activity:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error logging activity:", error);
    return { success: false, error };
  }
}
