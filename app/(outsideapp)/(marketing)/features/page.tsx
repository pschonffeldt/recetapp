import {
  AppMock,
  Wave,
  SparklesOverlay,
  StatCard,
} from "@/app/lib/marketing/helpers";
import { SectionGradientCards } from "@/app/ui/marketing/sections/section-gradient-cards";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import Link from "next/link";

export const metadata = { title: "Features" };

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
      <section className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-20 md:px-6 md:py-28">
        {/* Recipes */}
        <div
          id="recipes"
          className="scroll-mt-28 grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Recipes
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Save recipes in a format you can trust.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              No more screenshots and scattered notes. Keep ingredients, steps,
              and personal notes in a clean structure that&apos;s easy to read
              while you cook.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Less scrolling"
                label="Jump to ingredients and steps fast."
              />
              <StatCard
                value="More cooking"
                label="A calm layout that stays readable."
              />
            </div>

            <div className="mt-7 space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Search by title and summary</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Clear sections (ingredients / steps)</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Edit without losing structure</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <AppMock label="Recipe page preview" />
          </div>
        </div>

        {/* Ingredients */}
        <div
          id="ingredients"
          className="scroll-mt-28 grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div className="lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Ingredients
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Reuse ingredients instead of rewriting them.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              Consistent ingredient naming keeps your recipes cleaner and helps
              you build better lists over time.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Cleaner data"
                label="Keep names consistent across recipes."
              />
              <StatCard
                value="Less work"
                label="Stop retyping the same items."
              />
            </div>

            <div className="mt-7 space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Structured ingredients</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Better long-term organization</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Ready for future planning features</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:order-1">
            <AppMock label="Ingredient structure preview" />
          </div>
        </div>

        {/* Shopping lists */}
        <div
          id="shopping"
          className="scroll-mt-28 grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Shopping lists
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Build a shopping list from multiple recipes.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              Pick the recipes you&apos;re making and generate a list that’s
              actually usable at the store.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Fewer repeats"
                label="Combine ingredients across recipes."
              />
              <StatCard
                value="Less forgetting"
                label="Organize items so you don't miss essentials."
              />
            </div>

            <div className="mt-7 space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Recipe picker → list in seconds</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Better organization for real shopping</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Less manual retyping</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <AppMock label="Shopping list preview" />
          </div>
        </div>

        {/* Discover */}
        <div
          id="discover"
          className="scroll-mt-28 grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div className="lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Discover & share
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Discover recipes and share yours when you&apos;re ready.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              Explore a growing library of community recipes and save them into
              your cookbook. Publish your own favorites only if you choose —
              with privacy controls that keep it simple.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="More inspiration"
                label="Find new ideas without losing your system."
              />
              <StatCard
                value="Your rules"
                label="Share publicly, privately, or not at all."
              />
            </div>

            <div className="mt-7 space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Browse categories and trending recipes</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Save to your cookbook with one click</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Publish selectively with simple privacy controls</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:order-1">
            <AppMock label="Discover feed preview" />
          </div>
        </div>
      </section>
      {/* =========================
          3) Privacy section
        ========================= */}
      <section className="relative">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          {/* Top wave */}
          <Wave flip className="relative z-10 text-white" />

          <SparklesOverlay />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  Private by default. Simple by design.
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/85 md:text-base">
                  Your recipes stay yours. Share only when you want to.
                </p>

                <div className="mt-10 space-y-5">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Private-first
                    </div>
                    <p className="mt-1 text-sm text-white/85">
                      Keep recipes private by default; publish selectively.
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      Clean UX
                    </div>
                    <p className="mt-1 text-sm text-white/85">
                      Calm UI so you can focus on cooking, not settings.
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      Help Center built-in
                    </div>
                    <p className="mt-1 text-sm text-white/85">
                      Guides + troubleshooting available anytime.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start lg:justify-end">
                <AppMock label="Account / privacy controls preview" />
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <Wave className="relative z-10 text-white" />
        </div>
      </section>
    </>
  );
}
