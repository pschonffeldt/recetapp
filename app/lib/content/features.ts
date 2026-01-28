export const FEATURE_ROWS = [
  {
    id: "recipes",
    eyebrow: "Recipes",
    title: "Save recipes in a format you can trust.",
    description:
      "No more screenshots and scattered notes. Keep ingredients, steps, and personal notes in a clean structure that's easy to read while you cook.",
    stats: [
      { value: "Less scrolling", label: "Jump to ingredients and steps fast." },
      { value: "More cooking", label: "A calm layout that stays readable." },
    ],
    bullets: [
      "Search by title and summary",
      "Clear sections (ingredients / steps)",
      "Edit without losing structure",
    ],
    mediaLabel: "Recipe page preview",
  },
  {
    id: "ingredients",
    eyebrow: "Ingredients",
    title: "Reuse ingredients instead of rewriting them.",
    description:
      "Consistent ingredient naming keeps your recipes cleaner and helps you build better lists over time.",
    stats: [
      { value: "Cleaner data", label: "Keep names consistent across recipes." },
      { value: "Less work", label: "Stop retyping the same items." },
    ],
    bullets: [
      "Structured ingredients",
      "Better long-term organization",
      "Ready for future planning features",
    ],
    mediaLabel: "Ingredient structure preview",
  },
  {
    id: "shopping",
    eyebrow: "Shopping lists",
    title: "Build a shopping list from multiple recipes.",
    description:
      "Pick the recipes you're making and generate a list that’s actually usable at the store.",
    stats: [
      { value: "Fewer repeats", label: "Combine ingredients across recipes." },
      {
        value: "Less forgetting",
        label: "Organize items so you don't miss essentials.",
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
    id: "discover",
    eyebrow: "Discover & share",
    title: "Discover recipes and share yours when you're ready.",
    description:
      "Explore a growing library of community recipes and save them into your cookbook. Publish your own favorites only if you choose — with privacy controls that keep it simple.",
    stats: [
      {
        value: "More inspiration",
        label: "Find new ideas without losing your system.",
      },
      {
        value: "Your rules",
        label: "Share publicly, privately, or not at all.",
      },
    ],
    bullets: [
      "Browse categories and trending recipes",
      "Save to your cookbook with one click",
      "Publish selectively with simple privacy controls",
    ],
    mediaLabel: "Discover feed preview",
  },
] as const;
