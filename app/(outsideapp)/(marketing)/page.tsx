import {
  AppMock,
  SparklesOverlay,
  SectionHeader,
  Wave,
  StatCard,
} from "@/app/lib/marketing/helpers";
import { SectionGradientBand } from "@/app/ui/marketing/sections/section-gradient-band";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import Link from "next/link";

export const metadata = { title: "RecetApp" };

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
        ========================= */}
      <SectionHero
        title="The easiest way to keep your recipes organized."
        description="RecetApp helps you save structured recipes, reuse ingredients, and generate shopping lists fast so meal planning feels effortless."
        rightSlot={<AppMock label="RecetApp — dashboard preview" />}
      />
      {/* =========================
          2) Big gradient band (wave top + bottom for extra style)
        ========================= */}
      <SectionGradientBand
        title="Reimagine the limits of what’s possible in your kitchen."
        subtitle="From “where did I save that recipe?” to a clean system you can trust, RecetApp keeps everything organized."
        leftSlot={<AppMock label="Structured recipe view" />}
        rightSlot={<AppMock label="Shopping list builder" />}
        tags={["Convenient", "Private", "Organized"]}
      />

      {/* =========================
          3) Alternating feature rows
        ========================= */}
      <section className="mx-auto flex max-w-6xl flex-col gap-36 px-4 py-20 md:px-6 md:py-28">
        {/* Feature 1 */}
        <div
          id="recipes"
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Provide clarity instantly
            </p>
            <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Find recipes fast, and trust what you saved.
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              Save recipes with clean structure (ingredients, steps, notes) so
              they’re easy to read, edit, and cook from later.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Less scrolling"
                label="Stop hunting through screenshots and messy notes."
              />
              <StatCard
                value="More cooking"
                label="Get to the steps quickly with clear formatting."
              />
            </div>
            <div className="mt-7 space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Search by title and type</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>
                  Clean sections (ingredients / steps / dietary details)
                </span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Easy edits without losing structure</span>
              </div>
            </div>
          </div>
          <div className="flex justify-start lg:justify-end">
            {/* Force same width as other sections */}
            <AppMock label="Recipe page preview" />
          </div>
        </div>
        {/* Feature 2 */}
        <div
          id="shopping"
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div className="lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Shop smarter
            </p>
            <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Build a shopping list from multiple recipes.
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              Pick the recipes you’re making and generate a list that’s actually
              usable at the store.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Fewer repeats"
                label="Combine ingredients across recipes into one list."
              />
              <StatCard
                value="Less forgetting"
                label="Keep items organized so you don’t miss essentials."
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
          <div className="flex justify-start lg:order-1">
            <AppMock label="Shopping list preview" />
          </div>
        </div>
        {/* Feature 3 */}
        <div
          id="ingredients"
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Keep things consistent
            </p>
            <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Reuse ingredients instead of rewriting them.
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              Consistent ingredient naming keeps your recipes cleaner and your
              lists easier to manage over time.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Cleaner data"
                label="Ingredient names stay consistent across recipes."
              />
              <StatCard
                value="Less work"
                label="Stop rewriting the same items again and again."
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
                <span>Ready for future features</span>
              </div>
            </div>
          </div>
          <div className="flex justify-start lg:justify-end">
            <AppMock label="Ingredient structure preview" />
          </div>
        </div>
        {/* Feature 4 (Discover) */}
        <div
          id="discover"
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div className="lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Discover & share
            </p>

            <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Discover recipes, and share only when you&apos;re ready.
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              Explore a growing library of community recipes and save them into
              your cookbook. Publish your own favorites only if you choose, with
              privacy controls that keep it simple.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <StatCard
                value="More inspiration"
                label="Find new ideas without losing your own system."
              />
              <StatCard
                value="Your rules"
                label="Share publicly, share privately, or don’t share at all."
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
                <span>Share selectively with simple privacy controls</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:order-1">
            <AppMock label="Discover feed preview" />
          </div>
        </div>
      </section>
      {/* =========================
          4) Privacy section
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
                      Keep recipes private by default; share selectively.
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
      {/* =========================
          5) People using it
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        <h2 className="text-center text-sm font-semibold text-gray-700">
          People who cook at home love RecetApp.
        </h2>

        {/* Featured panel + thumbnail strip */}
        <div className="mt-8 grid gap-6 lg:grid-cols-1 lg:items-stretch">
          {/* Featured */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50" />
              <div className="relative grid gap-6 p-6 md:grid-cols-2 md:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Featured story
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                    “Meal planning finally feels calm.”
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    I stopped saving recipes in 5 different places. Now I can
                    actually find what I need, and my shopping list is done in
                    minutes.
                  </p>

                  <div className="mt-5 flex items-center gap-3 text-sm text-gray-700">
                    <span className="h-9 w-9 rounded-full bg-gray-200" />
                    <div>
                      <div className="font-semibold text-gray-900">Erin S.</div>
                      <div className="text-xs text-gray-600">
                        Weekly meal prep
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/signup"
                      className="inline-flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                    >
                      Try it free
                    </Link>
                  </div>
                </div>

                {/* Big media placeholder */}
                <div className="rounded-xl border bg-white p-3 shadow-sm">
                  <div className="h-52 w-full rounded-lg bg-gray-100 md:h-56" />
                  <div className="mt-3 text-xs text-gray-500">
                    Featured preview (swap for video/image later)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =========================
          6) Big stats band (wave top + bottom + taller)
        ========================= */}
      <section className="relative">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          <Wave flip className="relative z-10 text-white" />

          <SparklesOverlay />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
            <h2 className="text-center text-4xl font-semibold tracking-tight md:text-5xl">
              A calmer way to plan meals.
            </h2>

            <div className="mt-12 grid gap-10 md:grid-cols-3">
              <div className="text-center">
                <div className="text-5xl font-semibold">1</div>
                <p className="mt-3 text-sm text-white/90 md:text-base">
                  place for recipes, ingredients, and shopping lists
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-semibold">Less</div>
                <p className="mt-3 text-sm text-white/90 md:text-base">
                  retyping and fewer forgotten items
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-semibold">More</div>
                <p className="mt-3 text-sm text-white/90 md:text-base">
                  time cooking (and less time searching)
                </p>
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <Wave className="relative z-10 text-white" />
        </div>
      </section>
      {/* =========================
          7) Cards grid
        ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Get started in minutes.
          </h2>
          <p className="mt-4 text-sm text-gray-700 md:text-base">
            Quick guides to unlock value fast.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              type: "Guide",
              title: "Add your first recipe",
              body: "The fastest way to start building your personal cookbook.",
              href: "/help/getting-started",
              image: "/images/help/getting-started.png", // replace with new path
            },
            {
              type: "Feature",
              title: "Make a shopping list",
              body: "Pick recipes and generate a clean list for the store.",
              href: "/help/shopping-list",
              image: "/images/help/shopping-list.png", // replace with new path
            },
            {
              type: "Help",
              title: "Troubleshooting",
              body: "Quick fixes for the most common issues.",
              href: "/help/troubleshooting",
              image: "/images/help/troubleshooting.png", // replace with new path
            },
          ].map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Image header */}
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                {/* <img
                  src={c.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                /> */}
              </div>

              {/* Body */}
              <div className="p-7">
                <div className="text-sm text-gray-600">{c.type}</div>

                <div className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-gray-900">
                  {c.title}
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-700">{c.body}</p>

                <div className="mt-10 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Read more
                  </span>
                  <span className="text-blue-600 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
