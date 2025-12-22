import { Wave, SparklesOverlay } from "@/app/lib/marketing/helpers";
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
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -left-52 top-24 h-[520px] w-[520px] rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -right-52 bottom-[-220px] h-[680px] w-[680px] rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="absolute inset-x-0 bottom-[-260px] h-[520px] rounded-[999px] bg-gradient-to-t from-blue-500/10 via-sky-400/5 to-transparent blur-2xl" />

          <div
            className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Pricing
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">
            Start free. Upgrade only if you need more.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-700 md:text-base">
            Keep your cookbook organized with a plan that fits your needs. The
            free plan is great to get started — upgrade when you want more room.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
            >
              Get started free
            </Link>
            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              See features
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-600">
            Prices shown in USD. Cancel anytime.
          </p>
        </div>
      </section>

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
      <section className="relative">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          <Wave flip className="relative z-10 text-white" />
          <SparklesOverlay />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
            <h2 className="text-center text-4xl font-semibold tracking-tight md:text-5xl">
              A calm system you can grow into.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/85 md:text-base">
              Start small, then expand your cookbook when you’re ready. No
              pressure — just a cleaner way to keep recipes organized.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { value: "10", label: "recipes on the free plan" },
                { value: "50", label: "recipes on Pro ($5/mo)" },
                { value: "100", label: "recipes on Plus ($12/mo)" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center"
                >
                  <div className="text-5xl font-semibold">{s.value}</div>
                  <p className="mt-3 text-sm text-white/90 md:text-base">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Wave className="relative z-10 text-white" />
        </div>
      </section>
    </>
  );
}
