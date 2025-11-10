-- Composite indexes to speed up user-scoped, date-ordered queries

-- newest updated recipes per user
CREATE INDEX IF NOT EXISTS idx_recipes_user_updated_at
  ON public.recipes(user_id, recipe_updated_at DESC);

-- newest created recipes per user
CREATE INDEX IF NOT EXISTS idx_recipes_user_created_at
  ON public.recipes(user_id, recipe_created_at DESC);
