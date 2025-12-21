import Link from "next/link";

/* =============================================================================
 * Helpers
 * ============================================================================= */

function Wave({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="0 0 500 140"
        preserveAspectRatio="none"
        className={`block h-[95px] w-full md:h-[130px] ${
          flip ? "rotate-180" : ""
        }`}
      >
        <path
          d="M0,64 C240,140 520,0 760,48 C1010,98 1220,140 1440,72 L1440,140 L0,140 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function SparklesOverlay() {
  const dots = Array.from({ length: 32 }).map((_, i) => i);
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      aria-hidden
    >
      {dots.map((i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/70"
          style={{
            left: `${(i * 31) % 100}%`,
            top: `${(i * 19) % 100}%`,
            transform: `scale(${0.5 + ((i * 11) % 12) / 10})`,
          }}
        />
      ))}
      <span className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
      <span className="absolute left-[72%] top-[32%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
      <span className="absolute left-[42%] top-[74%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
    </div>
  );
}

function AppMock({ label, wide = true }: { label: string; wide?: boolean }) {
  // Always enforce consistent width + prevent narrow shrink in grid layouts
  return (
    <div
      className={[
        "w-full",
        wide ? "max-w-[560px]" : "max-w-[460px]",
        "rounded-2xl border bg-white shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <div className="ml-2 text-xs text-gray-500">{label}</div>
      </div>
      <div className="p-4 md:p-6">
        <div className="h-60 w-full rounded-xl bg-gray-100 md:h-72" />
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-6">
      <div className="text-[2.25rem] font-semibold leading-none tracking-tight text-gray-900">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-700">{label}</p>
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-200/90">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/* =============================================================================
 * Page
 * ============================================================================= */

export const metadata = { title: "RecetApp" };

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) Top nav
         ========================= */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            RecetApp
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-gray-700 md:flex">
            <Link href="/roadmap" className="hover:text-gray-900">
              Roadmap
            </Link>
            <Link href="/releases" className="hover:text-gray-900">
              Releases
            </Link>
            <Link href="/help" className="hover:text-gray-900">
              Help
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-gray-700 hover:text-gray-900 md:inline-block"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-500"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      {/* =========================
          2) HERO
        ========================= */}
      <section className="relative overflow-hidden bg-white">
        {/* Background: blobs + subtle noise */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Big soft blobs */}
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -right-52 bottom-[-220px] h-[640px] w-[640px] rounded-full bg-indigo-500/15 blur-3xl" />

          {/* Soft arc wash */}
          <div className="absolute inset-x-0 bottom-[-260px] h-[520px] rounded-[999px] bg-gradient-to-t from-blue-500/10 via-sky-400/5 to-transparent blur-2xl" />

          {/* Subtle noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Bottom fade (smooth transition) */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:min-h-[70vh] lg:flex lg:items-center">
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
                The easiest way to keep your recipes organized.
              </h1>

              <p className="mt-5 text-sm leading-6 text-gray-700 md:text-base">
                RecetApp helps you save structured recipes, reuse ingredients,
                and generate shopping lists fast — so meal planning feels
                effortless.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Get started free
                </Link>
                <Link
                  href="/help"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
                <Link href="/help/getting-started" className="hover:underline">
                  Getting started
                </Link>
                <Link href="/help/recipes" className="hover:underline">
                  Recipes
                </Link>
                <Link href="/help/shopping-list" className="hover:underline">
                  Shopping list
                </Link>
                <Link href="/help/troubleshooting" className="hover:underline">
                  Troubleshooting
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <AppMock label="RecetApp — dashboard preview" />
            </div>
          </div>
        </div>
      </section>
      {/* =========================
          3) Big gradient band (wave top + bottom)
        ========================= */}
      <section className="relative">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          {/* Top wave */}

          <SparklesOverlay />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
            <SectionHeader
              title="Reimagine the limits of what’s possible in your kitchen."
              subtitle="From “where did I save that recipe?” to a clean system you can trust — RecetApp keeps everything organized."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-center">
              <div className="flex justify-center lg:justify-start">
                <AppMock label="Structured recipe view" />
              </div>
              <div className="flex justify-center lg:justify-end">
                <AppMock label="Shopping list builder" />
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {["Convenient", "Private", "Organized"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium text-white/95"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom wave */}
          <Wave className="relative z-10 text-white" />
        </div>
      </section>

      {/* =========================
          4) Alternating feature rows
        ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        {/* Feature 1 */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Provide clarity instantly
            </p>
            <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
              Find recipes fast — and trust what you saved.
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
                <span>Search by title and summary</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Clean sections (ingredients / steps)</span>
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
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
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
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
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
                <span>Ready for future features (Discover, planning)</span>
              </div>
            </div>
          </div>
          <div className="flex justify-start lg:justify-end">
            <AppMock label="Ingredient structure preview" />
          </div>
        </div>
      </section>
      {/* =========================
          5) Privacy section
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
      {/* =========================
          6) People using it
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        <h2 className="text-center text-sm font-semibold text-gray-700">
          People who cook at home love RecetApp.
        </h2>

        {/* Featured panel + thumbnail strip */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-stretch">
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
                    actually find what I need — and my shopping list is done in
                    minutes.
                  </p>

                  <div className="mt-5 flex items-center gap-3 text-sm text-gray-700">
                    <span className="h-9 w-9 rounded-full bg-gray-200" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Home cook
                      </div>
                      <div className="text-xs text-gray-600">
                        Weekly meal prep
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/signup"
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
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

          {/* Thumbnails column */}
          <div className="lg:col-span-4">
            <div className="grid gap-4">
              {[
                {
                  title: "Weeknight cooking",
                  body: "Save favorites and repeat them fast.",
                },
                { title: "Family recipes", body: "Keep traditions organized." },
                {
                  title: "New favorites",
                  body: "Test, tweak, and keep notes.",
                },
              ].map((t) => (
                <div
                  key={t.title}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {t.title}
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{t.body}</p>
                  <div className="mt-4 h-20 w-full rounded-lg bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* =========================
          7) Big stats band (wave top + bottom + taller)
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
          8) Cards grid
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
      {/* =========================
          9) Final CTA + Footer
        ========================= */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-10 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  Ready to organize your recipes?
                </h2>
                <p className="mt-4 text-sm text-white/90 md:text-base">
                  Start free. Upgrade only if you need more.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-blue-700 hover:bg-white/90"
                >
                  Get started free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/25 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/15"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-14 border-t pt-10">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="text-sm font-semibold text-gray-900">
                  RecetApp
                </div>
                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
                  A calmer way to save recipes, reuse ingredients, and plan
                  meals without chaos.
                </p>
              </div>

              <div className="grid gap-8 md:col-span-8 md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Product
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <Link href="/signup" className="block hover:underline">
                      Get started
                    </Link>
                    <Link href="/login" className="block hover:underline">
                      Log in
                    </Link>
                    <Link href="/releases" className="block hover:underline">
                      Releases
                    </Link>
                    <Link href="/roadmap" className="block hover:underline">
                      Roadmap
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Help
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <Link href="/help" className="block hover:underline">
                      Help Center
                    </Link>
                    <Link
                      href="/help/getting-started"
                      className="block hover:underline"
                    >
                      Getting started
                    </Link>
                    <Link
                      href="/help/recipes"
                      className="block hover:underline"
                    >
                      Recipes
                    </Link>
                    <Link
                      href="/help/troubleshooting"
                      className="block hover:underline"
                    >
                      Troubleshooting
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Company
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <Link href="/about" className="block hover:underline">
                      About
                    </Link>
                    <Link href="/privacy" className="block hover:underline">
                      Privacy
                    </Link>
                    <Link href="/terms" className="block hover:underline">
                      Terms
                    </Link>
                  </div>
                </div>

                {/* <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Follow
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <span className="block text-gray-500">
                      (Add socials later)
                    </span>
                    <span className="block text-gray-500">X / Instagram</span>
                    <span className="block text-gray-500">YouTube</span>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="mt-10 flex flex-col flex-wrap items-start justify-between gap-3 text-xs text-gray-500">
              <div>
                © {new Date().getFullYear()} RecetApp, app version 1.0.0.
              </div>
              <div>Developed in Chile with Love</div>
              {/* <div className="flex flex-wrap gap-4">
                <Link href="/help" className="hover:underline">
                  Help
                </Link>
                <Link href="/roadmap" className="hover:underline">
                  Roadmap
                </Link>
                <Link href="/releases" className="hover:underline">
                  Releases
                </Link>
              </div> */}
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
