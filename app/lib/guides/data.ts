export type Guide = {
  id: string; // unique internal id
  slug: string; // URL slug
  title: string;
  summary: string;
  bodyMd?: string; // optional markdown text
  youtubeId?: string; // embed video
  updatedAt?: string; // ISO string (optional)
};

export const GUIDES: readonly Guide[] = [
  {
    id: "what-is-recetapp",
    slug: "what-is-recetapp",
    title: "What is RecetApp?",
    summary: "A quick overview of what RecetApp does.",
    youtubeId: "dQw4w9WgXcQ",
    bodyMd: `
## What you'll learn
- What RecetApp is designed for
- The difference between private and public recipes
- Where to start as a new user

## Key ideas
- Your recipes are private by default.
- You can share recipes publicly through Discover.
- Consistent ingredients help unlock better features.

## Next steps
- Create your first recipe
- Set up your public username (optional)
`.trim(),
    updatedAt: "2026-02-03",
  },
  {
    id: "add-first-recipe",
    slug: "add-your-first-recipe",
    title: "Add your first recipe",
    summary: "The fastest way to start building your personal cookbook.",
    youtubeId: "dQw4w9WgXcQ",
    bodyMd: `
## What you'll do
- Create a recipe
- Add ingredients
- Add steps
- Save it to your library

## Quick structure
- Title
- Ingredients (one per line)
- Steps (short, numbered)

## Tips
Start simple. You can always edit and improve later.
`.trim(),
    updatedAt: "2026-02-03",
  },
  {
    id: "write-ingredients-better",
    slug: "write-ingredients-recetapp-understands",
    title: "Write ingredients RecetApp understands",
    summary:
      "Use a consistent format so recipes work better with shopping list.",
    youtubeId: "dQw4w9WgXcQ",
    bodyMd: `
## Best format
Use:
**amount + unit + ingredient + optional prep**

Examples:
- \`2 tbsp olive oil\`
- \`1 onion, diced\`
- \`500 g potatoes\`
- \`1/2 tsp salt\`

## Tips
- One ingredient per line
- Prefer standard units (g, ml, tsp, tbsp)
- Put prep at the end (e.g., "carrots, chopped")
- Mark optional items as \`(optional)\`
`.trim(),
    updatedAt: "2026-02-03",
  },
  {
    id: "public-username-setup",
    slug: "set-up-your-public-username",
    title: "Set up your public username",
    summary: "Choose the name people see when you share recipes in Discover.",
    youtubeId: "dQw4w9WgXcQ",
    bodyMd: `
## What you'll do
- Open Account Settings
- Set your public username
- Save and confirm it updates

## Why it matters
Your public username appears on public recipes (it does not show your email).

## Tips
Pick something simple and recognizable. If it's taken, try a variation.
`.trim(),
    updatedAt: "2026-02-03",
  },
  {
    id: "private-vs-public",
    slug: "private-vs-public-recipes",
    title: "Private vs public recipes",
    summary:
      "Control who can see your recipes and what happens when you share publicly.",
    youtubeId: "dQw4w9WgXcQ",
    bodyMd: `
## Private recipes
- Visible only to you when signed in
- Best for personal drafts and family recipes

## Public recipes
- Can appear in Discover for others to browse
- Show your public username as the creator
- Others can save a copy to their library (your original stays yours)

## Best practice
Keep recipes public-friendly: avoid personal info you wouldn't want displayed.
`.trim(),
    updatedAt: "2026-02-03",
  },
] as const;

export function getGuideBySlug(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
