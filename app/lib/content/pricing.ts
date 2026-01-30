import { Plan } from "@/app/ui/marketing/sections/plan-card";
import { APP } from "../utils/app";

export const VALUE_ROW = {
  id: "long-term",
  eyebrow: "Built for the long term",
  title: "More than features, a system you can trust.",
  description: `${APP.name} isn't about cramming in every possible feature. It's about building a calm, dependable system for people who cook at home — one that grows thoughtfully without becoming overwhelming.`,
  ctas: [
    {
      href: "/roadmap",
      label: "View roadmap",
      variant: "secondary" as const,
    },
    {
      href: "/signup",
      label: "Start free",
      variant: "primary" as const,
    },
  ],
  cards: [
    {
      title: "Discover, done right (now available)",
      body: "Browse community recipes without losing control of your system.",
    },
    {
      title: "Meal planning (coming)",
      body: "Plan a week without turning cooking into a chore.",
    },
    {
      title: "Smarter ingredient insights (coming)",
      body: "Understand what you cook most and reuse it better.",
    },
    {
      title: "Export & portability (coming)",
      body: "Your data stays yours always.",
    },
  ],
  note: "We build slowly, deliberately, and in public so you always know what you're paying for.",
} as const;

export const PLANS: Plan[] = [
  {
    label: "Free",
    title: "Starter",
    price: "Free",
    sub: "Forever",
    highlight: false,
    ctaHref: "/signup",
    ctaText: "Get started free",
    features: [
      "Up to 10 recipes",
      "Structured ingredients + steps",
      "Search your cookbook",
      "Basic shopping list",
    ],
  },
  {
    label: "Pro",
    title: "Home cook",
    price: "$5",
    sub: "per month",
    highlight: true,
    ctaHref: "/signup",
    ctaText: "Start Pro",
    features: [
      "Up to 50 recipes",
      "Reusable ingredients",
      "Shopping lists from multiple recipes",
      "Priority improvements (fast iterations)",
    ],
  },
  {
    label: "Plus",
    title: "Power cook",
    price: "$12",
    sub: "per month",
    highlight: false,
    ctaHref: "/signup",
    ctaText: "Start Plus",
    features: [
      "Up to 100 recipes",
      "Everything in Pro",
      "Best for meal prep + families",
      "Early access to new features",
    ],
  },
  {
    label: "Business",
    title: "Restaurant",
    price: "$45",
    sub: "per month",
    highlight: false,
    ctaHref: "/signup",
    ctaText: "Start Business",
    features: [
      "Unlimited recipes",
      "Everything in Power Cook",
      "Team access ($5 per user)",
      "Operational shopping lists",
      "Priority support",
    ],
  },
];
