import { CONTACT_ROWS } from "@/app/lib/content/contact";
import { APP } from "@/app/lib/utils/app";
import { AboutRowContent } from "@/app/ui/marketing/sections/about-row-content";
import { ContactFormCard } from "@/app/ui/marketing/sections/contact-form-card";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import InfoCard from "@/app/ui/marketing/sections/infocards";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionValueBand } from "@/app/ui/marketing/sections/section-value-band";
import Link from "next/link";

export const metadata = {
  title: `Contact`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          1) HERO
         ========================= */}
      <SectionHero
        eyebrow="Contact"
        title={`Talk to the ${APP.legalName} team.`}
        description="Questions, feedback, or support, send a message and we'll get back to you."
        backgroundVariant="features"
        minHeightClass="lg:min-h-[55vh]"
        actions={
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/help"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Visit Help Center
            </Link>
            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              See features
            </Link>
          </div>
        }
        rightSlot={<ContactFormCard />}
      />

      {/* =========================
          2) VALUE BAND
         ========================= */}
      <SectionValueBand
        title="What to expect when you reach out."
        subtitle="We keep support simple: clear answers, fast iterations, and privacy first handling of your data."
        items={[
          {
            title: "Helpful replies",
            body: "Clear steps, quick links, and straight answers, no back-and-forth if we can avoid it.",
          },
          {
            title: "Fast feedback loop",
            body: "If you report an issue, we'll confirm it, track it, and communicate progress.",
          },
          {
            title: "Privacy-first",
            body: "We only ask for what we need to troubleshoot, and we never share your personal data.",
          },
        ]}
      />
      {/* =========================
          3) CONTACT DETAILS + FAQ
         ========================= */}
      <SectionFeatures gapClassName="gap-28">
        {CONTACT_ROWS.map((row) => (
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

      {/* =========================
          4) CTA
         ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Prefer self-serve?
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Start with the Help Center.
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700 md:text-base">
                Guides and troubleshooting are available anytime — no waiting.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                href="/help"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Go to Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
