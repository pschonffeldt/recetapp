import {
  Wave,
  SparklesOverlay,
  SectionHeader,
} from "@/app/lib/marketing/helpers";

type SectionGradientBandProps = {
  id?: string;
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tags?: string[];
  className?: string;
};

export function SectionGradientBand({
  id,
  title,
  subtitle,
  leftSlot,
  rightSlot,
  tags = [],
  className,
}: SectionGradientBandProps) {
  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        {/* Top wave */}
        <Wave flip className="relative z-10 text-white" />

        <SparklesOverlay />

        <div className="relative z-10 mx-auto mt-12 max-w-6xl px-4 py-18 md:px-6 md:py-24">
          <SectionHeader title={title} subtitle={subtitle} />

          {(leftSlot || rightSlot) && (
            <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-center">
              <div className="flex justify-center lg:justify-start">
                {leftSlot}
              </div>
              <div className="flex justify-center lg:justify-end">
                {rightSlot}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium text-white/95"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom wave */}
        <Wave className="relative z-10 text-white" />
      </div>
    </section>
  );
}
