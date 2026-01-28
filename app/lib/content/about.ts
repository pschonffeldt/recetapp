export type AboutRow = {
  id: string;

  eyebrow: string;
  title: string;
  description: string;

  bullets: string[];

  cards: {
    title: string;
    body: string;
  }[];
};

export const ABOUT_ROWS: AboutRow[] = [
  {
    id: "principles",
    eyebrow: "Principles",
    title: "Simple by design.",
    description:
      "The app should feel like a quiet helper, not another system you have to maintain.",
    bullets: [
      "Keep the main flows fast: save → find → cook.",
      "Structure matters: ingredients and steps stay clean.",
      "Privacy-first: your recipes are yours.",
      "Helpful docs: a public Help Center for answers.",
    ],
    cards: [
      {
        title: "Private by default",
        body: "Recipes stay private unless you choose to share. No surprises.",
      },
      {
        title: "Built for repeat cooking",
        body: "Favorites, notes, and ingredient reuse make weeknights easier.",
      },
      {
        title: "Organized shopping",
        body: "Generate lists from multiple recipes so you stop retyping.",
      },
      {
        title: "Iterating in public",
        body: "Roadmap + releases are visible so you can track what's shipping.",
      },
    ],
  },
  {
    id: "built-in-chile",
    eyebrow: "Built in Chile",
    title: "Crafted by a small team that cooks at home.",
    description:
      "RecetApp is developed in Chile by its founder with a simple goal: make everyday cooking feel calmer, faster, and more organized.",
    bullets: [],
    cards: [
      {
        title: "Founder-led",
        body: "Built with a clear direction: reduce friction for real home cooking.",
      },
      {
        title: "Small team, big focus",
        body: "We prioritize the core flows that matter: save → find → cook.",
      },
      {
        title: "Made in Chile",
        body: "Designed and developed in Chile with a strong craft-first mindset.",
      },
      {
        title: "Shipping in public",
        body: "Roadmap + releases stay visible so you can track what's coming next.",
      },
    ],
  },
];
