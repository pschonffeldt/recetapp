import { AppMock, SparklesOverlay, Wave } from "@/app/lib/marketing/helpers";
import { FeatureContent } from "@/app/ui/marketing/sections/feature-content";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import { FeaturedTestimonialCard } from "@/app/ui/marketing/sections/featured-testimonial-card";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionGradientBand } from "@/app/ui/marketing/sections/section-gradient-band";
import { SectionGradientSplit } from "@/app/ui/marketing/sections/section-gradient-split";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionTestimonials } from "@/app/ui/marketing/sections/section-testimonials";
import Link from "next/link";

export const metadata = { title: "RecetApp" };

const FEATURES = [
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
    title: "Discover recipes, and share only when you&apos;re ready.",
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
      <SectionFeatures>
        {FEATURES.map((f, idx) => (
          <FeatureRow
            key={f.id}
            id={f.id}
            reverse={idx % 2 === 1}
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
          4) Privacy section
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
      {/* =========================
          5) People using it
         ========================= */}
      <SectionTestimonials title="People who cook at home love RecetApp.">
        <FeaturedTestimonialCard
          quote="“Meal planning finally feels calm.”"
          body="I stopped saving recipes in 5 different places. Now I can actually find what I need, and my shopping list is done in minutes."
          authorName="Erin S."
          authorMeta="Weekly meal prep"
          cta={{ href: "/signup", label: "Try it free" }}
          // media={<YourImageOrVideo />}
        />
      </SectionTestimonials>
      ;
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
