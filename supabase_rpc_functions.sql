-- Function to check if a table exists
CREATE OR REPLACE FUNCTION public.get_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Function to create the table check function (this is a helper function)
CREATE OR REPLACE FUNCTION public.create_table_check_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function just exists as a placeholder
  -- The actual function is created above
  RETURN;
END;
$$;

-- Grant access to these functions
GRANT EXECUTE ON FUNCTION public.get_table_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_exists TO anon;
GRANT EXECUTE ON FUNCTION public.create_table_check_function TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_table_check_function TO anon;