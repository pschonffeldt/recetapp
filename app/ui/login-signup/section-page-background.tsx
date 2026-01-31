import { SectionHeroBackground } from "@/app/ui/marketing/sections/section-hero-background";

export function SectionPageBackground({
  variant = "home",
}: {
  variant?: "home" | "features" | "about";
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <SectionHeroBackground variant={variant} />
    </div>
  );
}
