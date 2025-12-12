/**
 * =============================================================================
 * Domain Types & Shared Definitions for RecetApp
 *
 * This file is the single source of truth for:
 * - User entities (DB rows, app-safe shapes, roles)
 * - Recipe entities (table views, forms, helpers)
 * - Notifications (DB rows, app-safe shapes, inputs)
 * - Ingredients, units and shopping list aggregation
 * - Language / country options for forms
 *
 * Keep anything that is shared across server/client or multiple modules here.
 * =============================================================================
 */

/* =============================================================================
 * User Entities (single source of truth)
 * =============================================================================
 */

/** Allowed roles in the app. Keep this the only role type. */
export type Role = "user" | "admin";

/** Raw row from the database. Matches the public.users table. */
export type DbUserRow = {
  id: string;
  name: string | null;
  user_name: string | null;
  last_name: string | null;
  email: string;
  password: string | null; // hashed; NEVER send to client
  country: string | null;
  language: string | null;
  user_role: Role; // enum/text in DB
  last_login_at?: string | null;
};

/**
 * Safe shape to use across the app (client/server) and in session.
 * This intentionally omits password and other sensitive fields.
 */
export type AppUser = {
  id: string;
  name: string | null;
  user_name: string | null;
  last_name: string | null;
  email: string;
  country: string | null;
  language: string | null;
  user_role: Role; // same property name as DB for simplicity
};

/**
 * Backwards-compat alias.
 * Some places may still import `User`; keep it mapped to AppUser.
 */
export type User = AppUser;

/** Type guard for role strings. */
export const isAdminRole = (r?: string | null): r is "admin" => r === "admin";

/** Narrowing helper to check if a given user is an admin. */
export const isUserAdmin = (u?: { user_role?: string | null }) =>
  isAdminRole(u?.user_role);

/* =============================================================================
 * Revenue Entities
 * =============================================================================
 */

/**
 * Aggregated revenue row (e.g., for charts).
 * Typical usage: monthly revenue for line/bar charts.
 */
export type Revenue = {
  /** Month label (e.g., "Jan", "2025-01"). */
  month: string;
  /** Revenue value in dollars (already aggregated for display). */
  revenue: number;
};

/* =============================================================================
 * Recipes — Table + Form Types
 * =============================================================================
 */

/**
 * Row used in paginated recipes table views.
 * This is a lightweight projection from the full recipes table.
 */
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

/* -----------------------------------------------------------------------------
 * Recipe form helpers (dropdowns / forms)
 * -------------------------------------------------------------------------- */

/** Minimal recipe record for selects, dropdowns, etc. */
export type RecipeField = {
  id: string;
  recipe_name: string;
  recipe_type: "breakfast" | "lunch" | "dinner" | "dessert" | "snack";
};

/** Difficulty levels for recipes. */
export type Difficulty = "easy" | "medium" | "hard";

/** Visibility of a recipe (who can see it). */
export type Visibility = "private" | "public";

/**
 * Full recipe shape for edit/create forms.
 * This is the DTO used by the RecipeForm UI.
 */
export type RecipeForm = {
  id: string;
  recipe_name: string;
  recipe_ingredients: string[]; // text[]
  recipe_steps: string[]; // text[]
  recipe_type: string; // your enum type if you have it
  servings?: number | null;
  prep_time_min?: number | null;
  difficulty?: Difficulty;
  status: Visibility;
  dietary_flags?: string[]; // text[]
  allergens?: string[]; // text[]
  calories_total?: number | null;
  estimated_cost_total?: string | null; // numeric -> string
  equipment?: string[]; // text[]
  recipe_updated_at?: string;
  recipe_created_at: string;
  /**
   * Structured ingredients:
   * - array: current normalized shape
   * - string: legacy JSON-encoded form
   * - null: no structured ingredients yet
   */
  recipe_ingredients_structured?: IncomingIngredientPayload[] | string | null;
};

/* =============================================================================
 * User Form Helpers (Account settings)
 * =============================================================================
 */

/**
 * Shape used by the account settings / user form.
 * Note: password here is the plain value used for forms, not necessarily DB.
 */

export type MembershipTier = "free" | "tier1" | "tier2";

export type UserForm = {
  id: string;
  name: string;
  user_name: string;
  last_name: string;
  email: string;
  password: string;
  country: Country;
  language: Language;

  // Membership & role
  membership_tier?: MembershipTier;
  user_role?: string | null;

  // Activity metadata (all optional)
  created_at?: string;
  profile_updated_at?: string | null;
  password_changed_at?: string | null;
  last_login_at?: string | null;
};

/* =============================================================================
 * Dashboard — Latest recipes / Notifications result
 * =============================================================================
 */

/**
 * Raw latest recipe shape used on the dashboard “Latest recipes” table.
 */
export type LatestRecipeRaw = {
  id: string;
  recipe_name: string;
  recipe_created_at: string;
  recipe_ingredients: string[]; // text[]
  recipe_steps: string[]; // text[]
  recipe_type: string;
};

/** Raw notification shape (legacy; kept for compatibility if needed). */
export type NotificationsRaw = {
  id: string;
  title: string;
  content: string;
  status: string[]; // assuming text[]
};

/**
 * Shared result shape for the notifications listing API.
 */
export type FetchNotificationsResult = {
  items: AppNotification[];
  total: number;
  page: number;
  pageSize: number;
};

/* =============================================================================
 * Dashboard — KPI cards
 * =============================================================================
 */

/**
 * KPI metrics for the dashboard “upper” cards.
 */
export type CardData = {
  totalRecipes: number;
  avgIngredients: number;
  mostRecurringCategory: string;
  totalIngredients: number;
};

/* =============================================================================
 * Recipes — Types and Difficulty helpers
 * =============================================================================
 */

/**
 * Allowed recipe types used across the app.
 * NOTE: keep in sync with the Postgres enum (if any).
 */
export const RECIPE_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
] as const;

/**
 * Allowed recipe difficulty levels.
 * NOTE: keep in sync with the Postgres enum (if any).
 */
export const DIFFICULTY = ["easy", "medium", "hard"] as const;

/* =============================================================================
 * Notifications
 * =============================================================================
 */

/**
 * Raw notifications row from the database.
 * Matches public.notifications.
 */
export type DbNotificationRow = {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  // kind: "system" | "maintenance" | "feature" | "message";
  kind: "announcement" | "maintenance" | "support" | "alert" | "compliance";
  level: "info" | "success" | "warning" | "error";
  link_url: string | null;
  status: "unread" | "read" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Input shape for creating a new notification.
 * Used by server actions / APIs.
 */
export type NewNotificationInput = {
  // null → broadcast notification; uuid → personal notification
  userId: string | null;
  title: string;
  body: string;
  // kind: "system" | "maintenance" | "feature" | "message";
  kind: "announcement" | "maintenance" | "support" | "alert" | "compliance";
  level: "info" | "success" | "warning" | "error";
  linkUrl?: string | null;

  // when to publish
  publishNow?: boolean;
  publishAt?: string | null; // ISO string; server will coerce to timestamptz
};

/**
 * App-safe notification representation.
 * Converts timestamps into Date objects and normalizes names.
 */
export type AppNotification = Omit<
  DbNotificationRow,
  "published_at" | "created_at" | "updated_at" | "user_id" | "link_url"
> & {
  userId: string | null;
  linkUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Generic result shape for "create notification" operations.
 */
export type CreateNotificationResult = {
  ok: boolean;
  message: string | null;
  id?: string;
  errors?: Record<string, string[]>;
};

/**
 * Map a raw DB notification row into the AppNotification shape.
 */
export function toAppNotification(dbRow: DbNotificationRow): AppNotification {
  const toDate = (v?: string | null) => (v ? new Date(v) : null);

  return {
    id: dbRow.id,
    userId: dbRow.user_id,
    title: dbRow.title,
    body: dbRow.body,
    kind: dbRow.kind,
    level: dbRow.level,
    linkUrl: dbRow.link_url,
    status: dbRow.status,
    publishedAt: toDate(dbRow.published_at),
    createdAt: new Date(dbRow.created_at),
    updatedAt: new Date(dbRow.updated_at),
  };
}

/* =============================================================================
 * Language (codes must match your Postgres enum: user_language)
 * =============================================================================
 */

/** Canonical language codes that the DB accepts. */
export const LANGUAGE = ["en", "es"] as const;
export type Language = (typeof LANGUAGE)[number];

/** Default language for new users / fallbacks. */
export const DEFAULT_LANGUAGE: Language = "en";

/** Options for selects (value/label). */
export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
] as const;

/** Shorthand for just the code part of LANGUAGE_OPTIONS. */
export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

/** Quick map from code -> human-friendly label (useful for badges, etc.). */
export const LANGUAGE_LABEL: Record<Language, string> = {
  en: "English",
  es: "Spanish",
};

/** Fast membership set for language codes. */
export const LANGUAGE_SET: ReadonlySet<Language> = new Set(LANGUAGE);

/** Type guard to check whether a value is a valid Language. */
export function isLanguage(v: unknown): v is Language {
  return typeof v === "string" && LANGUAGE_SET.has(v as Language);
}

/**
 * Normalize arbitrary inputs (UI labels, localized names, uppercasing, etc.)
 * to the canonical enum literal used in the DB ("en" | "es").
 *
 * Returns undefined if we can’t confidently map it.
 */
export function normalizeLanguage(input: unknown): Language | undefined {
  if (typeof input !== "string") return undefined;
  const s = input.trim().toLowerCase();

  // Accept codes directly
  if (s === "en" || s === "es") return s as Language;

  // Accept common labels / variants
  if (s === "english") return "en";
  if (s === "spanish" || s === "español") return "es";

  return undefined;
}

/* =============================================================================
 * Ingredients
 * =============================================================================
 */

/**
 * Canonical ingredient row (if you later add an ingredients table).
 */
export type Ingredient = {
  id: string;
  name: string;
  slug: string;
  defaultUnit: IngredientUnit | null;
  notes?: string | null;
};

/**
 * Relationship table between recipes and ingredients.
 */
export type RecipeIngredient = {
  id: string;
  recipeId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number | null;
  unit: IngredientUnit | null;
  isOptional: boolean;
  position: number;
};

/**
 * Payload for incoming structured ingredients.
 * This is what we expect from the client / parsing layer.
 */
export type IncomingIngredientPayload = {
  ingredientName: string;
  quantity: number | null;
  unit: IngredientUnit | null;
  isOptional: boolean;
  position: number;
};

/* =============================================================================
 * Units
 * =============================================================================
 */

/**
 * Units supported in RecetApp. Keep in sync with any DB enum you have.
 */
export type IngredientUnit =
  | "ml"
  | "l"
  | "tsp"
  | "tbsp"
  | "cup_metric"
  | "cup_us"
  | "fl_oz"
  | "pt"
  | "qt"
  | "gal"
  | "pinch"
  | "dash"
  | "drop"
  | "splash"
  | "g"
  | "kg"
  | "oz"
  | "lb"
  | "mm"
  | "cm"
  | "in"
  | "celsius"
  | "fahrenheit"
  | "piece";

/**
 * Human-readable labels for each unit, for UI display.
 */
export const UNIT_LABELS: Record<IngredientUnit, string> = {
  ml: "mL",
  l: "L",
  tsp: "tsp",
  tbsp: "Tbsp",
  cup_metric: "cup (metric)",
  cup_us: "cup (US)",
  fl_oz: "fl oz",
  pt: "pt",
  qt: "qt",
  gal: "gal",
  pinch: "pinch",
  dash: "dash",
  drop: "drop",
  splash: "splash",
  g: "g",
  kg: "kg",
  oz: "oz",
  lb: "lb",
  mm: "mm",
  cm: "cm",
  in: "in",
  celsius: "°C",
  fahrenheit: "°F",
  piece: "piece",
};

/** Handy list of all units, typically used in selects. */
export const ALL_UNITS: IngredientUnit[] = Object.keys(
  UNIT_LABELS
) as IngredientUnit[];

/* =============================================================================
 * Shopping list (aggregated ingredients)
 * =============================================================================
 */

/**
 * Aggregated ingredient used in shopping list views.
 * Multiple occurrences of the same ingredient/unit can be merged into one row.
 */
export type AggregatedIngredient = {
  ingredientName: string;
  unit: IngredientUnit | null;
  totalQuantity: number | null;
  occurrences: number;
  optionalOccurrences: number;
};

/* =============================================================================
 * Discover recipes
 * =============================================================================
 */

export type PublicRecipeDetail = RecipeForm & {
  created_by_display_name: string | null;
};

/* =============================================================================
 * Countries
 * =============================================================================
 */

/**
 * Countries list used in select inputs for the user profile.
 * NOTE: pure UI-level list, not tied to any DB enum.
 */
export const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Côte d’Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const;

/** Country type inferred from the COUNTRIES list. */
export type Country = (typeof COUNTRIES)[number];
