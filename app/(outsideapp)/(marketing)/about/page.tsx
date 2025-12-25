import { SparklesOverlay, Wave } from "@/app/lib/marketing/helpers";
import InfoCard from "@/app/ui/marketing/home/home-infocards";
import SoftDot from "@/app/ui/marketing/home/home-soft-dot";
import Link from "next/link";

export const metadata = { title: "About • RecetApp" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
    2) About hero (same blob background vibe + purple accents)
   ========================= */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Blue/Sky base blobs */}
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/18 blur-3xl" />
          <div className="absolute -left-40 top-28 h-[520px] w-[520px] rounded-full bg-sky-400/18 blur-3xl" />
          <div className="absolute -right-52 bottom-[-240px] h-[640px] w-[640px] rounded-full bg-indigo-500/14 blur-3xl" />

          {/* Purple "thingy" accents (subtle) */}
          <div className="absolute -top-28 right-[-140px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute left-[-160px] bottom-[-260px] h-[620px] w-[620px] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-3xl" />

          {/* Soft arc wash */}
          <div className="absolute inset-x-0 bottom-[-260px] h-[520px] rounded-[999px] bg-gradient-to-t from-blue-500/10 via-sky-400/5 to-transparent blur-2xl" />

          {/* Optional: subtle purple tint wash (very light) */}
          <div className="absolute inset-x-0 top-[-220px] h-[520px] rounded-[999px] bg-gradient-to-b from-purple-500/6 via-transparent to-transparent blur-2xl" />

          {/* Bottom fade for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:min-h-[55vh] lg:flex lg:items-center">
          <div className="grid w-full gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                About RecetApp
              </p>

              <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">
                A calmer way to cook at home.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-700 md:text-base">
                RecetApp exists to remove the “where did I save that?” chaos. It
                helps you keep recipes clean and structured, reuse ingredients
                across dishes, and generate shopping lists that are actually
                useful at the store.
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
                  Visit Help Center
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 z-10">
              <div className="rounded-2xl border bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-2 text-xs text-gray-500">
                    RecetApp — about preview
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="h-60 w-full rounded-xl bg-gray-100 md:h-72" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          3) Gradient band: mission / why (same structure)
         ========================= */}
      <section className="relative">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
          <SparklesOverlay />
          <Wave flip className="relative z-10 text-white" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Built around real cooking habits.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 md:text-base">
                Most people cook from a mix of screenshots, bookmarks, and
                notes. RecetApp turns that into one trustworthy system — without
                overcomplicating your kitchen life.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                <div className="text-sm font-semibold">Clarity</div>
                <p className="mt-3 text-sm leading-6 text-white/85">
                  Structured recipes that stay readable and easy to edit.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                <div className="text-sm font-semibold">Consistency</div>
                <p className="mt-3 text-sm leading-6 text-white/85">
                  Reuse ingredients so your data stays clean over time.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
                <div className="text-sm font-semibold">Calm</div>
                <p className="mt-3 text-sm leading-6 text-white/85">
                  Less searching, less retyping, more cooking.
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <InfoCard
                title="Clarity"
                body="Structured recipes that stay readable and easy to edit."
              />
              <InfoCard
                title="Consistency"
                body="Reuse ingredients so your data stays clean over time."
              />
              <InfoCard
                title="Calm"
                body="Less searching, less retyping, more cooking."
              />
            </div>
          </div>

          <Wave className="relative z-10 text-white" />
        </div>
      </section>

      {/* =========================
          4) Values / principles (clean white section like features)
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Principles
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Simple by design.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              The app should feel like a quiet helper — not another system you
              have to maintain.
            </p>

            <div className="mt-8 space-y-3 text-sm text-gray-700">
              <div className="flex gap-3">
                <SoftDot />
                <span>Keep the main flows fast: save → find → cook.</span>
              </div>
              <div className="flex gap-3">
                <SoftDot />
                <span>
                  Structure matters: ingredients and steps stay clean.
                </span>
              </div>
              <div className="flex gap-3">
                <SoftDot />
                <span>Privacy-first: your recipes are yours.</span>
              </div>
              <div className="flex gap-3">
                <SoftDot />
                <span>Helpful docs: a public Help Center for answers.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Private by default"
                body="Recipes stay private unless you choose to share. No surprises."
              />
              <InfoCard
                title="Built for repeat cooking"
                body="Favorites, notes, and ingredient reuse make weeknights easier."
              />
              <InfoCard
                title="Organized shopping"
                body="Generate lists from multiple recipes so you stop retyping."
              />
              <InfoCard
                title="Iterating in public"
                body="Roadmap + releases are visible so you can track what's shipping."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Built in Chile
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Crafted by a small team that cooks at home.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              RecetApp is developed in Chile by its founder and a small team —
              with a simple goal: make everyday cooking feel calmer, faster, and
              more organized.
            </p>

            {/* <div className="mt-8 space-y-3 text-sm text-gray-700">
              <div className="flex gap-3">
                <SoftDot />
                <span>Founder-led product decisions (built with care).</span>
              </div>
              <div className="flex gap-3">
                <SoftDot />
                <span>
                  Small team, fast iterations, and real-world feedback.
                </span>
              </div>
              <div className="flex gap-3">
                <SoftDot />
                <span>Transparent updates via releases + roadmap.</span>
              </div>
              <div className="flex gap-3">
                <SoftDot />
                <span>
                  Support content written to help you self-serve quickly.
                </span>
              </div>
            </div> */}
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Founder-led"
                body="Built with a clear direction: reduce friction for real home cooking."
              />
              <InfoCard
                title="Small team, big focus"
                body="We prioritize the core flows that matter: save → find → cook."
              />
              <InfoCard
                title="Made in Chile"
                body="Designed and developed in Chile with a strong craft-first mindset."
              />
              <InfoCard
                title="Shipping in public"
                body="Roadmap + releases stay visible so you can track what’s coming next."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
