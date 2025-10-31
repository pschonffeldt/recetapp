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

// this are the languages types I use on my profile settings
export const LANGUAGE = ["english"] as const;

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
