-- Users lifecycle columns
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS created_at           timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at           timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS password_changed_at  timestamptz,
  ADD COLUMN IF NOT EXISTS profile_updated_at   timestamptz;

-- Simple updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_users_set_updated_at ON public.users;
CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
