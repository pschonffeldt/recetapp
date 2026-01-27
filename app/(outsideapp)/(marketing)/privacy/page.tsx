import { AppMock } from "@/app/lib/marketing/helpers";
import InfoCard from "@/app/ui/marketing/home/home-infocards";
import SoftDot from "@/app/ui/marketing/home/home-soft-dot";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionValueBand } from "@/app/ui/marketing/sections/section-value-band";
import Link from "next/link";

export const metadata = { title: "Privacy • RecetApp" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="About RecetApp"
        title="A calmer way to cook at home."
        description="RecetApp exists to remove the “where did I save that?” chaos. It helps you keep recipes clean and structured, reuse ingredients across dishes, and generate shopping lists that are actually useful at the store."
        minHeightClass="lg:min-h-[60vh]"
        backgroundVariant="about"
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
              href="/help"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Visit Help Center
            </Link>
          </div>
        }
      />

      {/* =========================
          2) Mission
         ========================= */}
      <SectionValueBand
        title="Built around real cooking habits."
        subtitle="Most people cook from a mix of screenshots, bookmarks, and notes. RecetApp turns that into one trustworthy system without overcomplicating your kitchen life."
        items={[
          {
            title: "Clarity",
            body: "Structured recipes that stay readable and easy to edit.",
          },
          {
            title: "Consistency",
            body: "Reuse ingredients so your data stays clean over time.",
          },
          {
            title: "Calm",
            body: "Less searching, less retyping, more cooking.",
          },
        ]}
      />

      {/* =========================
          3) Values
         ========================= */}
      <SectionFeatures gapClassName="gap-28">
        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Principles
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Simple by design.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                The app should feel like a quiet helper, not another system you
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
          }
          media={
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
          }
        />

        <FeatureRow
          layout="twelveCol"
          leftColSpanClass="lg:col-span-5"
          rightColSpanClass="lg:col-span-7"
          content={
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Built in Chile
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Crafted by a small team that cooks at home.
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
                RecetApp is developed in Chile by its founder with a simple
                goal: make everyday cooking feel calmer, faster, and more
                organized.
              </p>

              {/* keep our commented bullets here if we want to re-enable later */}
            </div>
          }
          media={
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
                body="Roadmap + releases stay visible so you can track what's coming next."
              />
            </div>
          }
        />
      </SectionFeatures>
    </div>
  );
}
