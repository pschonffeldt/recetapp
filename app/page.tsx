import Link from "next/link";

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
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className={`block h-[90px] w-full md:h-[120px] ${
          flip ? "rotate-180" : ""
        }`}
      >
        {/* smooth wave */}
        <path
          d="M0,64 C240,140 520,0 760,48 C1010,98 1220,140 1440,72 L1440,140 L0,140 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function SparklesOverlay() {
  // lightweight “star dots”
  const dots = Array.from({ length: 28 }).map((_, i) => i);
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
            left: `${(i * 37) % 100}%`,
            top: `${(i * 23) % 100}%`,
            transform: `scale(${0.6 + ((i * 13) % 10) / 10})`,
          }}
        />
      ))}
      {/* a few bigger glows */}
      <span className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
      <span className="absolute left-[68%] top-[35%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
      <span className="absolute left-[40%] top-[72%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
    </div>
  );
}

function AppMock({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <div className="ml-2 text-xs text-gray-500">{label}</div>
      </div>
      <div className="p-4 md:p-6">
        <div className="h-56 w-full rounded-xl bg-gray-100 md:h-64" />
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-5">
      <div className="text-4xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-gray-700">{label}</p>
    </div>
  );
}

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
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                The easiest way to keep your recipes organized.
              </h1>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                RecetApp helps you save structured recipes, reuse ingredients,
                and generate shopping lists fast — so meal planning feels
                effortless.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
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

              {/* Small icon link row (below CTAs) */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
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

            <div className="lg:justify-self-end">
              <AppMock label="RecetApp — dashboard preview" />
            </div>
          </div>
        </div>

        {/* curved “white to band” transition */}
        <Wave flip className="text-white" />
      </section>

      {/* =========================
          3) Big gradient band
         ========================= */}
      <section className="relative">
        <Wave flip className="text-white" />
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          <SparklesOverlay />

          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Reimagine the limits of what’s possible in your kitchen.
              </h2>
              <p className="mt-3 text-sm text-white/90 md:text-base">
                From “where did I save that recipe?” to a clean system you can
                trust — RecetApp keeps everything organized.
              </p>
            </div>

            {/* Screenshot strip inside band */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-center">
              <AppMock label="Structured recipe view" />
              <AppMock label="Shopping list builder" />
            </div>

            {/* Small pill links under band */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
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

          {/* band → white wave */}
          <Wave className="text-white" />
        </div>
      </section>

      {/* =========================
          4) Alternating feature rows
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        {/* Feature 1 */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Provide clarity instantly
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">
              Find recipes fast — and trust what you saved.
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-700 md:text-base">
              Save recipes with clean structure (ingredients, steps, notes) so
              they’re easy to read, edit, and cook from later.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Less scrolling"
                label="Stop hunting through screenshots and messy notes."
              />
              <StatCard
                value="More cooking"
                label="Get to the steps quickly with clear formatting."
              />
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-700">
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

          <div className="lg:justify-self-end">
            <AppMock label="Recipe page preview" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Shop smarter
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">
              Build a shopping list from multiple recipes.
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-700 md:text-base">
              Pick the recipes you’re making and generate a list that’s actually
              usable at the store.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Fewer repeats"
                label="Combine ingredients across recipes into one list."
              />
              <StatCard
                value="Less forgetting"
                label="Keep items organized so you don’t miss essentials."
              />
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-700">
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

          <div className="lg:order-1">
            <AppMock label="Shopping list preview" />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Keep things consistent
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">
              Reuse ingredients instead of rewriting them.
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-700 md:text-base">
              Consistent ingredient naming keeps your recipes cleaner and your
              lists easier to manage over time.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <StatCard
                value="Cleaner data"
                label="Ingredient names stay consistent across recipes."
              />
              <StatCard
                value="Less work"
                label="Stop rewriting the same items again and again."
              />
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-700">
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

          <div className="lg:justify-self-end">
            <AppMock label="Ingredient structure preview" />
          </div>
        </div>
      </section>

      {/* =========================
          5) “Secure. Adaptable. No barriers.” band
         ========================= */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Private by default. Simple by design.
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700 md:text-base">
                Your recipes stay yours. Share only when you want to.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Private-first
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    Keep recipes private by default; publish selectively.
                  </p>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Clean UX
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    Calm UI so you can focus on cooking, not settings.
                  </p>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Help Center built-in
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    Guides + troubleshooting available anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <AppMock label="Account / privacy controls preview" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          6) People using it
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-center text-sm font-semibold text-gray-700">
          Built for people who cook at home (and want less chaos)
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            "Meal prep",
            "Family recipes",
            "New favorites",
            "Weeknight cooking",
          ].map((t) => (
            <div
              key={t}
              className="rounded-xl border bg-white p-4 text-sm text-gray-700 shadow-sm"
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          7) Big stats band
         ========================= */}
      <section className="relative">
        <Wave flip className="text-white" />
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          <SparklesOverlay />
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
              A calmer way to plan meals.
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-semibold">1</div>
                <p className="mt-2 text-sm text-white/90">
                  place for recipes, ingredients, and shopping lists
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-semibold">Less</div>
                <p className="mt-2 text-sm text-white/90">
                  retyping and fewer forgotten items
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-semibold">More</div>
                <p className="mt-2 text-sm text-white/90">
                  time cooking (and less time searching)
                </p>
              </div>
            </div>
          </div>

          <Wave className="text-white" />
        </div>
      </section>

      {/* =========================
          8) Cards grid 
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Get started in minutes.
          </h2>
          <p className="mt-3 text-sm text-gray-700 md:text-base">
            Quick guides to unlock value fast.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Add your first recipe",
              body: "The fastest way to start building your personal cookbook.",
              href: "/help/getting-started",
            },
            {
              title: "Make a shopping list",
              body: "Pick recipes and generate a clean list for the store.",
              href: "/help/shopping-list",
            },
            {
              title: "Troubleshooting",
              body: "Quick fixes for the most common issues.",
              href: "/help/troubleshooting",
            },
          ].map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow"
            >
              <div className="text-base font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-gray-700">{c.body}</p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                Read more →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================
          9) Final CTA
         ========================= */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-10 text-white">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Ready to organize your recipes?
                </h2>
                <p className="mt-3 text-sm text-white/90 md:text-base">
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

          {/* dense footer area  */}
          <footer className="mt-12 border-t pt-8 text-xs text-gray-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>© {new Date().getFullYear()} RecetApp</div>
              <div className="flex flex-wrap gap-4">
                <Link href="/help" className="hover:underline">
                  Help
                </Link>
                <Link href="/roadmap" className="hover:underline">
                  Roadmap
                </Link>
                <Link href="/releases" className="hover:underline">
                  Releases
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
