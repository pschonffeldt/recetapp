import Link from "next/link";
import { SectionHeroBackground } from "./section-hero-background";

type HeroLink = { href: string; label: string };

type SectionHeroProps = {
  title: string;
  description: string;

  eyebrow?: string;

  // optional extra content under description (paragraphs, buttons, etc.)
  actions?: React.ReactNode;

  quickLinks?: HeroLink[];

  rightSlot?: React.ReactNode;

  minHeightClass?: string; // e.g. "lg:min-h-[60vh]"
  backgroundVariant?: "home" | "features" | "about";

  /**
   * Layout controls:
   * - twoCol = lg:grid-cols-2 (default)
   * - twelveCol = lg:grid-cols-12 with spans (7/5 by default)
   */
  layout?: "twoCol" | "twelveCol";
  leftColSpanClass?: string; // used only for twelveCol
  rightColSpanClass?: string; // used only for twelveCol

  rightAlignClassName?: string; // e.g. "lg:justify-end" (default)
  className?: string;
};

export function SectionHero({
  title,
  description,
  eyebrow,
  actions,
  quickLinks = [],
  rightSlot,
  minHeightClass = "lg:min-h-[70vh]",
  backgroundVariant = "home",
  layout = "twoCol",
  leftColSpanClass = "lg:col-span-7",
  rightColSpanClass = "lg:col-span-5",
  rightAlignClassName = "lg:justify-end",
  className,
}: SectionHeroProps) {
  const gridClass =
    layout === "twelveCol"
      ? "grid w-full gap-10 lg:grid-cols-12 lg:items-center"
      : "grid w-full gap-12 lg:grid-cols-2 lg:items-center";

  const leftClass = layout === "twelveCol" ? leftColSpanClass : undefined;

  const rightClass = layout === "twelveCol" ? rightColSpanClass : undefined;

  return (
    <section className={`relative overflow-hidden bg-white ${className ?? ""}`}>
      <SectionHeroBackground variant={backgroundVariant} />

      <div
        className={`mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20 ${minHeightClass} lg:flex lg:items-center`}
      >
        <div className={gridClass}>
          <div className={leftClass}>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {eyebrow}
              </p>
            )}

            <h1
              className={`text-5xl font-semibold tracking-tight md:text-6xl ${
                eyebrow ? "mt-3" : ""
              }`}
            >
              {title}
            </h1>

            <p className="mt-5 text-sm leading-6 text-gray-700 md:text-base">
              {description}
            </p>

            {actions}

            {quickLinks.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
                {quickLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {rightSlot ? (
            <div
              className={[
                "z-10 flex justify-center", // mobile default
                rightAlignClassName, // e.g. lg:justify-end
                rightClass ?? "",
              ].join(" ")}
            >
              {rightSlot}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
