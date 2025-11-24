/* =======================================================
 * User Entities (single source of truth)
 * ======================================================= */

/** Allowed roles in the app. Keep this the only role type. */
export type Role = "user" | "admin";

/** Raw row from the database. Matches the public.users table. */
export type DbUserRow = {
  id: string;
  name: string | null;
  last_name: string | null;
  email: string;
  password: string | null; // hashed; NEVER send to client
  country: string | null;
  language: string | null;
  user_role: Role; // enum/text in DB
};

/** Safe shape to use across the app (client/server) and in session. */
export type AppUser = {
  id: string;
  name: string | null;
  last_name: string | null;
  email: string;
  country: string | null;
  language: string | null;
  user_role: Role; // same property name as DB for simplicity
};

/** Backwards-compat: many places may import `User`. */
export type User = AppUser;

/** Narrowing helpers */
export const isAdminRole = (r?: string | null): r is "admin" => r === "admin";
export const isUserAdmin = (u?: { user_role?: string | null }) =>
  isAdminRole(u?.user_role);

/* =======================================================
 * Revenue Entities
 * ======================================================= */

/** Aggregated revenue row (e.g., for charts). */
export type Revenue = {
  /** Month label (e.g., "Jan", "2025-01"). */
  month: string;
  /** Revenue value in dollars (already aggregated for display). */
  revenue: number;
};

/* =======================================================
 * Recipes table
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
 * Recipe form Helpers (Dropdowns / Forms)
 * ======================================================= */

/** Minimal recipe record for selects. */
export type RecipeField = {
  id: string;
  recipe_name: string;
  recipe_type: "breakfast" | "lunch" | "dinner" | "dessert" | "snack";
};

/** Full recipe shape for edit/create forms. */
export type Difficulty = "easy" | "medium" | "hard";
export type Visibility = "private" | "public";

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
};

/* =======================================================
 * User form Helpers (Dropdowns / Forms)
 * ======================================================= */

// Account settings, user form

export type UserForm = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  country: Country;
  language: Language;
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

//  For notifications fetch
export type NotificationsRaw = {
  id: string;
  title: string;
  content: string;
  status: string[]; // assuming text[]
};

export type FetchNotificationsResult = {
  items: AppNotification[];
  total: number;
  page: number;
  pageSize: number;
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

/* =======================================================
 * Recipes types and difficulty
 * ======================================================= */
// this are the recipe types I use on my edit feature
export const RECIPE_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
] as const;

// this are the recipe dofficulty
export const DIFFICULTY = ["easy", "medium", "hard"] as const;

/* =======================================================
 * Notifications
 * ======================================================= */

export type DbNotificationRow = {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  kind: "system" | "maintenance" | "feature" | "message";
  level: "info" | "success" | "warning" | "error";
  link_url: string | null;
  status: "unread" | "read" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

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

export type NewNotificationInput = {
  // null → broadcast; uuid → personal
  userId: string | null;
  title: string;
  body: string;
  kind: "system" | "maintenance" | "feature" | "message";
  level: "info" | "success" | "warning" | "error";
  linkUrl?: string | null;

  // when to publish
  publishNow?: boolean;
  publishAt?: string | null; // ISO string; server will coerce to timestamptz
};

export type CreateNotificationResult = {
  ok: boolean;
  message: string | null;
  id?: string;
  errors?: Record<string, string[]>;
};

// ==========================
// Language (codes must match your Postgres enum: user_language)
// ==========================

// Canonical codes that the DB accepts.
export const LANGUAGE = ["en", "es"] as const;
export type Language = (typeof LANGUAGE)[number];

// Default language for new users / fallbacks
export const DEFAULT_LANGUAGE: Language = "en";

// Options for selects (what you wanted)
export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
] as const;
export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

// Quick map from code -> label (handy for badges, etc.)
export const LANGUAGE_LABEL: Record<Language, string> = {
  en: "English",
  es: "Spanish",
};

// Fast membership check
export const LANGUAGE_SET: ReadonlySet<Language> = new Set(LANGUAGE);

// Type guard
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

/* =======================================================
 * Ingredients
 * ======================================================= */
export type Ingredient = {
  id: string;
  name: string;
  slug: string;
  defaultUnit: IngredientUnit | null;
  notes?: string | null;
};

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

export type IncomingIngredientPayload = {
  ingredientName: string;
  quantity: number | null;
  unit: IngredientUnit | null;
  isOptional: boolean;
  position: number;
};

/* =======================================================
 * Units
 * ======================================================= */
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

// (optional) handy list for selects
export const ALL_UNITS: IngredientUnit[] = Object.keys(
  UNIT_LABELS
) as IngredientUnit[];

/* =======================================================
 * Countries
 * ======================================================= */

// Countries list
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

export type Country = (typeof COUNTRIES)[number];
