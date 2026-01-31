import { ABOUT_ROWS } from "@/app/lib/content/about";
import { AppMock } from "@/app/lib/marketing/helpers";
import { APP } from "@/app/lib/utils/app";
import { AboutRowContent } from "@/app/ui/marketing/sections/about-row-content";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import InfoCard from "@/app/ui/marketing/sections/infocards";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionValueBand } from "@/app/ui/marketing/sections/section-value-band";
import Link from "next/link";

export const metadata = {
  title: `About`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow={`About ${APP.legalName}`}
        title="A calmer way to cook at home."
        description={`${APP.legalName} exists to remove the “where did I save that?” chaos. It helps you keep recipes clean and structured, reuse ingredients across dishes, and generate shopping lists that are actually useful at the store.`}
        minHeightClass="lg:min-h-[60vh]"
        backgroundVariant="about"
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
        subtitle={`Most people cook from a mix of screenshots, bookmarks, and notes. ${APP.legalName} turns that into one trustworthy system without overcomplicating your kitchen life.`}
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
        {ABOUT_ROWS.map((row) => (
          <FeatureRow
            key={row.id}
            id={row.id}
            layout="twelveCol"
            leftColSpanClass="lg:col-span-5"
            rightColSpanClass="lg:col-span-7"
            scrollMtClassName="scroll-mt-28"
            content={
              <AboutRowContent
                eyebrow={row.eyebrow}
                title={row.title}
                description={row.description}
                bullets={row.bullets}
              />
            }
            media={
              <div className="grid gap-6 md:grid-cols-2">
                {row.cards.map((c) => (
                  <InfoCard key={c.title} title={c.title} body={c.body} />
                ))}
              </div>
            }
          />
        ))}
      </SectionFeatures>
    </div>
  );
}
