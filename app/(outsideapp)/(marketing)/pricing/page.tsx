import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionStatsBand } from "@/app/ui/marketing/sections/section-stats-band";
import Link from "next/link";

export const metadata = { title: "Pricing" };

function Check() {
  return (
    <span
      aria-hidden
      className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600"
    />
  );
}

function PlanCard({
  label,
  title,
  price,
  sub,
  highlight,
  ctaHref,
  ctaText,
  features,
}: {
  label: string;
  title: string;
  price: string;
  sub: string;
  highlight?: boolean;
  ctaHref: string;
  ctaText: string;
  features: string[];
}) {
  return (
    <div
      className={[
        "relative rounded-2xl border bg-white p-7 shadow-sm",
        highlight ? "border-blue-200 ring-1 ring-blue-200" : "border-gray-200",
      ].join(" ")}
    >
      {highlight && (
        <div className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </div>
      )}

      <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
        {title}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-4xl font-semibold tracking-tight text-gray-900">
          {price}
        </div>
        <div className="text-sm text-gray-600">{sub}</div>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-700">{sub}</p>

      <Link
        href={ctaHref}
        className={[
          "mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          highlight
            ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
            : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline-blue-600",
        ].join(" ")}
      >
        {ctaText}
      </Link>

      <div className="mt-7 border-t pt-6">
        <div className="text-sm font-semibold text-gray-900">Includes</div>
        <div className="mt-4 space-y-3 text-sm text-gray-700">
          {features.map((f) => (
            <div key={f} className="flex gap-2">
              <Check />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const plans = [
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
        minHeightClass="" // pricing hero does not need forced min height
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
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.title} {...p} />
          ))}
        </div>

        {/* mini FAQ */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              q: "Can I change plans later?",
              a: "Yes. Upgrade or downgrade anytime from your account settings.",
            },
            {
              q: "What happens if I hit my recipe limit?",
              a: "You can upgrade to a higher tier to add more.",
            },
            {
              q: "Is the free plan really free?",
              a: "Yes. No credit card required to start.",
            },
          ].map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="text-sm font-semibold text-gray-900">{f.q}</div>
              <p className="mt-2 text-sm leading-6 text-gray-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

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
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* blue/sphere base */}
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/14 blur-3xl" />
          <div className="absolute -left-56 top-20 h-[520px] w-[520px] rounded-full bg-sky-400/14 blur-3xl" />
          <div className="absolute -right-60 bottom-[-220px] h-[640px] w-[640px] rounded-full bg-indigo-500/12 blur-3xl" />

          {/* purple accents */}
          <div className="absolute -top-28 right-[-160px] h-[540px] w-[540px] rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute left-[-180px] bottom-[-260px] h-[620px] w-[620px] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-3xl" />

          {/* bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Built for the long term
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                More than features a system you can trust.
              </h2>
              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                RecetApp isn&apos;t about cramming in every possible feature.
                I&apos;s about building a calm, dependable system for people who
                cook at home one that grows thoughtfully without becoming
                overwhelming.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/roadmap"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  View roadmap
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Start free
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-4 md:grid-cols-2">
                {[
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
                ].map((c) => (
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

              <p className="mt-6 text-sm text-gray-600">
                We build slowly, deliberately, and in public so you always know
                what you&apos;re paying for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          5) Lifetime deal waitlist (high-value capture)
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Limited offer (exploring)
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Lifetime access, one payment.
              </h2>
              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                To thank early supporters, we&apos;re exploring a limited
                lifetime plan that unlocks full access to RecetApp with a single
                one-time payment.
              </p>

              <div className="mt-7 space-y-2 text-sm text-gray-700">
                {[
                  "One payment, no monthly fees",
                  "Full access to current and future core features",
                  "Priority feedback + early access to new tools",
                  "Joining the waitlist doesn&apos;t commit you to anything",
                ].map((t) => (
                  <div key={t} className="flex gap-2">
                    <Check />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-sm font-semibold text-gray-900">
                  Join the lifetime waitlist
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Get notified if and when lifetime access becomes available.
                </p>

                {/* Replace this href with your real waitlist route/form later */}
                {/* <Link
                  href=""
                  className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Join waitlist
                </Link> */}
                <div className="p-4">
                  <div className="flex h-10 items-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
                    Join waitlist (not open yet)
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  No spam. One email when it launches (if it launches).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
