-- migrations/20251114_users_role.sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
  END IF;
END$$;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';

-- Optional: make a specific user admin right now
UPDATE public.users
SET role = 'admin'
WHERE LOWER(email) = 'info@mitkof.cl';
