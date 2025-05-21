-- Function to get user analytics data
CREATE OR REPLACE FUNCTION public.get_user_analytics(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID := auth.uid();
  tasks_created INTEGER;
  tasks_completed INTEGER;
  active_projects INTEGER;
  streak_days INTEGER;
BEGIN
  -- Count tasks created by the user in the date range
  SELECT COUNT(*)
  INTO tasks_created
  FROM tasks
  WHERE created_at BETWEEN start_date AND end_date
  AND created_by = user_id;

  -- Count tasks completed by the user in the date range
  SELECT COUNT(*)
  INTO tasks_completed
  FROM tasks
  WHERE completed_at BETWEEN start_date AND end_date
  AND assigned_to = user_id;

  -- Count active projects for the user
  SELECT COUNT(DISTINCT project_id)
  INTO active_projects
  FROM tasks
  JOIN user_tasks ON tasks.id = user_tasks.task_id
  WHERE user_tasks.user_id = user_id
  AND tasks.status != 'completed';

  -- Calculate streak days (simplified version)
  -- In a real implementation, this would be more complex
  SELECT 5 INTO streak_days;

  -- Return the analytics data as JSON
  RETURN json_build_object(
    'tasks_created', tasks_created,
    'tasks_completed', tasks_completed,
    'active_projects', active_projects,
    'streak_days', streak_days
  );
END;
$$;