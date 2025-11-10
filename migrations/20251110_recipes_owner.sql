-- 1) Add column nullable first
ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) Backfill old rows to your demo user
UPDATE public.recipes
SET user_id = '410544b2-4001-4271-9855-fec4b6a6442a'
WHERE user_id IS NULL;

-- 3) Enforce NOT NULL and FK (guard against duplicate creation)
ALTER TABLE public.recipes
  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'recipes_user_id_fkey'
  ) THEN
    ALTER TABLE public.recipes
      ADD CONSTRAINT recipes_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4) Index
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes(user_id);
