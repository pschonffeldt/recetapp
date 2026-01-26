import { AppMock } from "@/app/lib/marketing/helpers";
import { FeatureContent } from "@/app/ui/marketing/sections/feature-content";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionGradientCards } from "@/app/ui/marketing/sections/section-gradient-cards";
import { SectionGradientSplit } from "@/app/ui/marketing/sections/section-gradient-split";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import Link from "next/link";

export const metadata = { title: "Features" };

const FEATURE_ROWS = [
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

export default function Page() {
  return (
    <>
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="Features"
        title="Everything you need to save, reuse, and plan."
        description="RecetApp gives you a clean system for recipes and ingredients plus a shopping list that's actually usable at the store."
        minHeightClass="lg:min-h-[60vh]"
        backgroundVariant="features"
        rightSlot={<AppMock label="RecetApp — features preview" />}
        actions={
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              View pricing
            </Link>
          </div>
        }
        quickLinks={[
          { href: "#recipes", label: "Recipes" },
          { href: "#ingredients", label: "Ingredients" },
          { href: "#shopping", label: "Shopping lists" },
          { href: "#discover", label: "Discover" },
        ]}
      />
      {/* =========================
          2) Feature band (gradient + waves)
         ========================= */}
      <SectionGradientCards
        title="A clean system that stays out of your way."
        subtitle="Structured recipes, reusable ingredients, and shopping lists that help you move faster, without clutter."
        cards={[
          {
            title: "Structured recipes",
            body: "Ingredients, steps, and notes formatted the same every time.",
          },
          {
            title: "Reusable ingredients",
            body: "Keep names consistent so your cookbook stays tidy.",
          },
          {
            title: "Shopping lists",
            body: "Pick recipes and generate a list you can actually shop from.",
          },
        ]}
      />
      ;
      {/* =========================
          3) Feature rows
         ========================= */}
      <SectionFeatures gapClassName="gap-24">
        {FEATURE_ROWS.map((f, idx) => (
          <FeatureRow
            key={f.id}
            id={f.id}
            reverse={idx % 2 === 1}
            scrollMtClassName="scroll-mt-28"
            content={
              <FeatureContent
                eyebrow={f.eyebrow}
                title={f.title}
                description={f.description}
                stats={[...f.stats]}
                bullets={[...f.bullets]}
              />
            }
            media={<AppMock label={f.mediaLabel} />}
          />
        ))}
      </SectionFeatures>
      ;
      {/* =========================
          3) Privacy section
        ========================= */}
      <SectionGradientSplit
        title="Private by default. Simple by design."
        description="Your recipes stay yours. Share only when you want to."
        items={[
          {
            title: "Private-first",
            body: "Keep recipes private by default; share selectively.",
          },
          {
            title: "Clean UX",
            body: "Calm UI so you can focus on cooking, not settings.",
          },
          {
            title: "Help Center built-in",
            body: "Guides + troubleshooting available anytime.",
          },
        ]}
        media={<AppMock label="Account / privacy controls preview" />}
      />
      ;
    </>
  );
}
