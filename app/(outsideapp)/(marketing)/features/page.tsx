import { FEATURE_ROWS } from "@/app/lib/content/features";
import { AppMock } from "@/app/lib/marketing/helpers";
import { APP } from "@/app/lib/utils/app";
import { FeatureContent } from "@/app/ui/marketing/sections/feature-content";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionGradientCards } from "@/app/ui/marketing/sections/section-gradient-cards";
import { SectionGradientSplit } from "@/app/ui/marketing/sections/section-gradient-split";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import Link from "next/link";

export const metadata = {
  title: `Features • ${APP.name}`,
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="Features"
        title="Everything you need to save, reuse, and plan."
        description={`${APP.legalName} gives you a clean system for recipes and ingredients plus a shopping list that's actually usable at the store.`}
        minHeightClass="lg:min-h-[60vh]"
        backgroundVariant="features"
        rightSlot={
          <AppMock
            label={`${APP.legalName} — dashboard preview`}
            imageSrc="/images/homepage/home-dashboard.webp"
            imageAlt={`${APP.legalName} dashboard dashboard preview`}
            priority
            fit="contain"
            aspectClassName="aspect-[16/9]"
            innerPaddingClassName="p-4"
          />
        }
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
      {/* =========================
          3) Feature rows
         ========================= */}
      <SectionFeatures gapClassName="gap-24">
        {FEATURE_ROWS.map((f, idx) => (
          <FeatureRow
            key={f.id}
            id={f.id}
            reverse={idx % 2 === 1}
            scrollMtClassName="scroll-mt-28"
            content={
              <FeatureContent
                eyebrow={f.eyebrow}
                title={f.title}
                description={f.description}
                stats={[...f.stats]}
                bullets={[...f.bullets]}
              />
            }
            media={
              <AppMock
                label={f.mediaLabel}
                imageSrc={f.imageSrc}
                imageAlt={f.imageAlt}
                priority={idx === 0}
              />
            }
          />
        ))}
      </SectionFeatures>

      {/* =========================
          3) Privacy section
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
        media={
          <AppMock
            label={`${APP.legalName} — dashboard preview`}
            imageSrc="/images/homepage/home-dashboard.webp"
            imageAlt={`${APP.legalName} dashboard dashboard preview`}
            priority
            fit="contain"
            aspectClassName="aspect-[16/9]"
            innerPaddingClassName="p-4"
          />
        }
      />
    </div>
  );
}
