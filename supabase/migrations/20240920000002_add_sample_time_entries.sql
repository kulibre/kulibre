-- Add sample time entries for testing
DO $$
DECLARE
  user_id UUID;
  project_id UUID;
  task_id UUID;
  current_date DATE := CURRENT_DATE;
  i INTEGER;
BEGIN
  -- Get a sample user ID
  SELECT id INTO user_id FROM profiles LIMIT 1;
  
  -- Get a sample project ID
  SELECT id INTO project_id FROM projects LIMIT 1;
  
  -- Get a sample task ID
  SELECT id INTO task_id FROM tasks LIMIT 1;

  -- Insert sample time entries for the last 30 days
  FOR i IN 1..30 LOOP
    -- Morning session
    INSERT INTO time_entries (
      user_id,
      project_id,
      task_id,
      description,
      started_at,
      duration
    ) VALUES (
      user_id,
      project_id,
      task_id,
      'Morning work session',
      (current_date - (i || ' days')::INTERVAL) + '09:00:00'::TIME,
      FLOOR(RANDOM() * (180 - 120 + 1) + 120)::INTEGER -- 2-3 hours in minutes
    );

    -- Afternoon session
    INSERT INTO time_entries (
      user_id,
      project_id,
      task_id,
      description,
      started_at,
      duration
    ) VALUES (
      user_id,
      project_id,
      task_id,
      'Afternoon work session',
      (current_date - (i || ' days')::INTERVAL) + '14:00:00'::TIME,
      FLOOR(RANDOM() * (240 - 180 + 1) + 180)::INTEGER -- 3-4 hours in minutes
    );
  END LOOP;
END;
$$; 