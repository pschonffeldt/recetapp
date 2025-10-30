/* =======================================================
 * Core Entities
 * ======================================================= */

/** Authenticated application user (not necessarily a customer). */
export type User = {
  id: string;
  name: string;
  email: string;
  /** Hashed password when persisted; do not expose to the client. */
  password: string;
};

/** Aggregated revenue row (e.g., for charts). */
export type Revenue = {
  /** Month label (e.g., "Jan", "2025-01"). */
  month: string;
  /** Revenue value in dollars (already aggregated for display). */
  revenue: number;
};

/* =======================================================
 * Recipes
 * ======================================================= */

/** Recipe row used in paginated table views. */
export type RecipesTable = {
  id: string;
  recipe_name: string;
  /** Array of ingredient lines (normalized). */
  recipe_ingredients: string[];
  /** Array of step lines (normalized). */
  recipe_steps: string[];
  /** ISO timestamp string from DB (created_at). */
  recipe_created_at: string;
  /** Enum of allowed recipe types. */
  recipe_type: "breakfast" | "lunch" | "dinner" | "dessert" | "snack";
};

/* =======================================================
 * Form Helpers (Dropdowns / Forms)
 * ======================================================= */

/** Minimal recipe record for selects. */
export type RecipeField = {
  id: string;
  recipe_name: string;
  recipe_type: "breakfast" | "lunch" | "dinner" | "dessert" | "snack";
};

/** Full recipe shape for edit/create forms. */
export type Difficulty = "easy" | "medium" | "hard" | null;
export type Visibility = "private" | "public";

export type RecipeForm = {
  id: string;
  recipe_name: string;
  recipe_ingredients: string[]; // text[]
  recipe_steps: string[]; // text[]
  recipe_type: string; // your enum type if you have it

  // NEW FIELDS
  servings?: number | null;
  prep_time_min?: number | null;
  difficulty?: Difficulty;
  status: Visibility;
  dietary_flags?: string[]; // text[]
  allergens?: string[]; // text[]
  calories_total?: number | null;
  estimated_cost_total?: string | null; // numeric -> string
  equipment?: string[]; // text[]
};

//  To be organized, used on dashboard latest recipe table
export type LatestRecipeRaw = {
  id: string;
  recipe_name: string;
  recipe_created_at: string; // or `created_at` if that's your column
  recipe_ingredients: string[]; // assuming text[]
  recipe_steps: string[]; // assuming text[]
  recipe_type: string;
};

/* =======================================================
 * Dashboard upper OKRs
 * ======================================================= */

export type CardData = {
  totalRecipes: number;
  avgIngredients: number;
  mostRecurringCategory: string;
  totalIngredients: number;
};

// To organize later
// this are the recipe types I use on my edit feature
export const RECIPE_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
] as const;
