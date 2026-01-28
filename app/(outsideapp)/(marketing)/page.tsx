import { FEATURES, GUIDES } from "@/app/lib/content/home";
import { AppMock } from "@/app/lib/marketing/helpers";
import { FeatureContent } from "@/app/ui/marketing/sections/feature-content";
import { FeatureRow } from "@/app/ui/marketing/sections/feature-row";
import { FeaturedTestimonialCard } from "@/app/ui/marketing/sections/featured-testimonial-card";
import { GuideCard } from "@/app/ui/marketing/sections/guide-card";
import { SectionCardsGrid } from "@/app/ui/marketing/sections/section-cards-grid";
import { SectionFeatures } from "@/app/ui/marketing/sections/section-features";
import { SectionGradientBand } from "@/app/ui/marketing/sections/section-gradient-band";
import { SectionGradientSplit } from "@/app/ui/marketing/sections/section-gradient-split";
import { SectionHero } from "@/app/ui/marketing/sections/section-hero";
import { SectionStatsBand } from "@/app/ui/marketing/sections/section-stats-band";
import { SectionTestimonials } from "@/app/ui/marketing/sections/section-testimonials";

export const metadata = { title: "RecetApp" };

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
          2) Big gradient band
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
      {/* =========================
          6) Big stats band
        ========================= */}
      <SectionStatsBand
        title="A calmer way to plan meals."
        items={[
          {
            value: "1",
            label: "place for recipes, ingredients, and shopping lists.",
          },
          {
            value: "Less",
            label: "retyping and fewer forgotten items.",
          },
          {
            value: "More",
            label: "time cooking (and less time searching).",
          },
        ]}
      />
      {/* =========================
          7) Cards grid
        ========================= */}
      <SectionCardsGrid
        title="Get started in minutes."
        subtitle="Quick guides to unlock value fast."
      >
        {GUIDES.map((c) => (
          <GuideCard
            key={c.title}
            type={c.type}
            title={c.title}
            body={c.body}
            href={c.href}
            image={c.image}
          />
        ))}
      </SectionCardsGrid>
    </div>
  );
}
