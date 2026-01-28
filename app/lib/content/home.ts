export const FEATURES = [
  {
    id: "recipes",
    eyebrow: "Provide clarity instantly",
    title: "Find recipes fast, and trust what you saved.",
    description:
      "Save recipes with clean structure (ingredients, steps, notes) so they’re easy to read, edit, and cook from later.",
    stats: [
      {
        value: "Less scrolling",
        label: "Stop hunting through screenshots and messy notes.",
      },
      {
        value: "More cooking",
        label: "Get to the steps quickly with clear formatting.",
      },
    ],
    bullets: [
      "Search by title and type",
      "Clean sections (ingredients / steps / dietary details)",
      "Easy edits without losing structure",
    ],
    mediaLabel: "Recipe page preview",
  },
  {
    id: "shopping",
    eyebrow: "Shop smarter",
    title: "Build a shopping list from multiple recipes.",
    description:
      "Pick the recipes you’re making and generate a list that’s actually usable at the store.",
    stats: [
      {
        value: "Fewer repeats",
        label: "Combine ingredients across recipes into one list.",
      },
      {
        value: "Less forgetting",
        label: "Keep items organized so you don’t miss essentials.",
      },
    ],
    bullets: [
      "Recipe picker → list in seconds",
      "Better organization for real shopping",
      "Less manual retyping",
    ],
    mediaLabel: "Shopping list preview",
  },
  {
    id: "ingredients",
    eyebrow: "Keep things consistent",
    title: "Reuse ingredients instead of rewriting them.",
    description:
      "Consistent ingredient naming keeps your recipes cleaner and your lists easier to manage over time.",
    stats: [
      {
        value: "Cleaner data",
        label: "Ingredient names stay consistent across recipes.",
      },
      {
        value: "Less work",
        label: "Stop rewriting the same items again and again.",
      },
    ],
    bullets: [
      "Structured ingredients",
      "Better long-term organization",
      "Ready for future features",
    ],
    mediaLabel: "Ingredient structure preview",
  },
  {
    id: "discover",
    eyebrow: "Discover & share",
    title: "Discover recipes, and share only when you're ready.",
    description:
      "Explore a growing library of community recipes and save them into your cookbook. Publish your own favorites only if you choose, with privacy controls that keep it simple.",
    stats: [
      {
        value: "More inspiration",
        label: "Find new ideas without losing your own system.",
      },
      {
        value: "Your rules",
        label: "Share publicly, share privately, or don’t share at all.",
      },
    ],
    bullets: [
      "Browse categories and trending recipes",
      "Save to your cookbook with one click",
      "Share selectively with simple privacy controls",
    ],
    mediaLabel: "Discover feed preview",
  },
] as const;

export const GUIDES = [
  {
    type: "Guide",
    title: "Add your first recipe",
    body: "The fastest way to start building your personal cookbook.",
    href: "/help/getting-started",
  },
  {
    type: "Feature",
    title: "Make a shopping list",
    body: "Pick recipes and generate a clean list for the store.",
    href: "/help/shopping-list",
  },
  {
    type: "Help",
    title: "Troubleshooting",
    body: "Quick fixes for the most common issues.",
    href: "/help/troubleshooting",
  },
] as const;
