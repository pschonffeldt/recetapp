-- Enforce unique email (case-insensitive)
-- 1) Normalize existing data to lower-case (safe op if you already store lower)
UPDATE public.users SET email = LOWER(email) WHERE email <> LOWER(email);

-- 2) Optional: ensure not-null email
ALTER TABLE public.users
  ALTER COLUMN email SET NOT NULL;

-- 3) Create a unique index on lower(email)
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
  ON public.users (LOWER(email));
