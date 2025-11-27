// Public base URL for RecetApp.
// Prefer env var in case the domain changes later.
export const RECETAPP_PUBLIC_URL =
  process.env.NEXT_PUBLIC_RECETAPP_URL ?? "https://recetapp-mu.vercel.app/";

// Brand name (handy if you ever rebrand or want to reuse it)
export const RECETAPP_BRAND_NAME = "RecetApp";
