-- Add first_name and last_name columns to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'first_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'last_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
  END IF;
END
$$;

-- Update existing profiles to split full_name into first_name and last_name
UPDATE public.profiles
SET 
  first_name = SPLIT_PART(full_name, ' ', 1),
  last_name = SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
WHERE 
  full_name IS NOT NULL 
  AND full_name != '' 
  AND POSITION(' ' IN full_name) > 0
  AND first_name IS NULL;

-- For profiles with no space in full_name, just use the full name as first_name
UPDATE public.profiles
SET 
  first_name = full_name,
  last_name = ''
WHERE 
  full_name IS NOT NULL 
  AND full_name != '' 
  AND POSITION(' ' IN full_name) = 0
  AND first_name IS NULL;
