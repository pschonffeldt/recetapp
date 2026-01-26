import { SectionHeroBackground } from "./section-hero-background";

type SectionHeroProps = {
  title: string;
  description: string;
  rightSlot: React.ReactNode;
  className?: string;
};

export function SectionHero({
  title,
  description,
  rightSlot,
  className,
}: SectionHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-white ${className ?? ""}`}>
      <SectionHeroBackground />

      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:min-h-[70vh] lg:flex lg:items-center">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
              {title}
            </h1>

            <p className="mt-5 text-sm leading-6 text-gray-700 md:text-base">
              {description}
            </p>

            {/* keep your CTAs + quick links inside here if you want them “standard” */}
          </div>

          <div className="z-10 flex justify-start lg:justify-end">
            {rightSlot}
          </div>
        </div>
      </div>
    </section>
  );
}
