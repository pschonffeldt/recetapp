/* ============================================
 * Type Definitions
 * --------------------------------------------
 * - Central source of truth for data shapes
 * - Mirrors DB columns and UI DTOs
 * - Keep in sync with schema/ORM models
 * ============================================ */

/**
 * High-level notes:
 * - Amounts are stored in cents (number) at the DB layer.
 * - Some “table” types mirror SELECT joins.
 * - “Raw” types represent DB results pre-formatting.
 * - UI-facing types (e.g., LatestInvoice) may have formatted strings.
 */

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// However, these types are generated automatically if you're using an ORM such as Prisma.

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
export type RecipeForm = {
  id: string;
  recipe_name: string;
  recipe_ingredients: string[];
  recipe_steps: string[];
  recipe_type: "breakfast" | "lunch" | "dinner" | "dessert" | "snack";
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
