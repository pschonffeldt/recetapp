import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import { Plan } from "@/app/ui/marketing/sections/plan-card";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionLifetimeDeal } from "@/app/ui/marketing/sections/section-lifetime-deal";
import { SectionPlans } from "@/app/ui/marketing/sections/section-plans";
import { SectionStatsBand } from "@/app/ui/marketing/sections/section-stats-band";
import Link from "next/link";

export const metadata = { title: "Pricing" };

const VALUE_ROW = {
  id: "long-term",
  eyebrow: "Built for the long term",
  title: "More than features, a system you can trust.",
  description:
    "RecetApp isn&apos;t about cramming in every possible feature. It&apos;s about building a calm, dependable system for people who cook at home — one that grows thoughtfully without becoming overwhelming.",
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
      title: "Meal planning (coming)",
      body: "Plan a week without turning cooking into a chore.",
    },
    {
      title: "Smarter ingredient insights (coming)",
      body: "Understand what you cook most and reuse it better.",
    },
    {
      title: "Discover, done right (coming)",
      body: "Browse community recipes without losing control of your system.",
    },
    {
      title: "Export & portability (coming)",
      body: "Your data stays yours always.",
    },
  ],
  note: "We build slowly, deliberately, and in public so you always know what you&apos;re paying for.",
} as const;

const plans: Plan[] = [
  {
    label: "Free",
    title: "Starter",
    price: "$0",
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
];

export default function Page() {
  return (
    <>
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="Pricing"
        title="Start free. Upgrade only if you need more."
        description="Keep your cookbook organized with a plan that fits your needs."
        backgroundVariant="features"
        minHeightClass=""
        actions={
          <>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-700 md:text-base">
              The free plan is great to get started. Upgrade only when you want
              more room.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started free
              </Link>

              <Link
                href="/features"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                See features
              </Link>
            </div>

            <p className="mt-6 text-xs text-gray-600">
              Prices shown in USD. Cancel anytime.
            </p>
          </>
        }
      />

      {/* =========================
          2) Plans
         ========================= */}
      <SectionPlans plans={plans} />

      {/* =========================
          3) Trust band (gradient + waves)
         ========================= */}
      <SectionStatsBand
        title="A calm system you can grow into."
        subtitle="Start small, then expand your cookbook when you're ready. No pressure—just a cleaner way to keep recipes organized."
        items={[
          { value: "10", label: "recipes on the free plan" },
          { value: "50", label: "recipes on Pro ($5/mo)" },
          { value: "100", label: "recipes on Plus ($12/mo)" },
        ]}
      />

      {/* =========================
          4) What you're investing in (value + roadmap)
         ========================= */}
      <SectionFeatures gapClassName="gap-24">
        {[VALUE_ROW].map((row) => (
          <FeatureRow
            key={row.id}
            content={
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {row.eyebrow}
                </p>

                <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  {row.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                  {row.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {row.ctas.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={[
                        "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors",
                        c.variant === "primary"
                          ? "bg-blue-600 text-white hover:bg-blue-500"
                          : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            }
            media={
              <div>
                <div className="grid gap-4 md:grid-cols-2">
                  {row.cards.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {c.title}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {c.body}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-sm text-gray-600">{row.note}</p>
              </div>
            }
          />
        ))}
      </SectionFeatures>

      {/* =========================
          5) Lifetime deal waitlist
         ========================= */}
      <SectionLifetimeDeal
        title="Lifetime access, one payment."
        description="To thank early supporters, we're exploring a limited lifetime plan that unlocks full access to RecetApp with a single one-time payment."
        bullets={[
          "One payment, no monthly fees",
          "Full access to current and future core features",
          "Priority feedback + early access to new tools",
          "Joining the waitlist doesn&apos;t commit you to anything",
        ]}
        cardTitle="Join the lifetime waitlist"
        cardDescription="Get notified if and when lifetime access becomes available."
        disabledCtaText="Join waitlist (not open yet)"
        footnote="No spam. One email when it launches (if it launches)."
      />
    </>
  );
}
