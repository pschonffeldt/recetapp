import Link from "next/link";
import { SectionHeroBackground } from "./section-hero-background";

type HeroLink = { href: string; label: string };

type SectionHeroProps = {
  title: string;
  description: string;

  eyebrow?: string;

  actions?: React.ReactNode;

  quickLinks?: HeroLink[];

  rightSlot?: React.ReactNode;

  minHeightClass?: string; // e.g. "lg:min-h-[60vh]"
  backgroundVariant?: "home" | "features";

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
  className,
}: SectionHeroProps) {
  const hasRight = Boolean(rightSlot);

  return (
    <section className={`relative overflow-hidden bg-white ${className ?? ""}`}>
      <SectionHeroBackground variant={backgroundVariant} />

      <div
        className={`mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20 ${minHeightClass} lg:flex lg:items-center`}
      >
        <div
          className={[
            "grid w-full gap-12 lg:items-center",
            hasRight ? "lg:grid-cols-2" : "lg:grid-cols-1",
          ].join(" ")}
        >
          <div>
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

          {hasRight && (
            <div className="z-10 flex justify-start lg:justify-end">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
