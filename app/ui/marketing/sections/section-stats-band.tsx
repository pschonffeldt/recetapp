import { Wave, SparklesOverlay } from "@/app/lib/marketing/helpers";

type StatsBandItem = {
  value: string;
  label: string;
};

type SectionStatsBandProps = {
  id?: string;
  title: string;
  subtitle?: string;
  items: StatsBandItem[];
  className?: string;

  // optional: if you ever want to override layout
  columnsClassName?: string; // default is derived from items length
};

function getColumnsClass(itemsCount: number) {
  if (itemsCount <= 1) return "md:grid-cols-1";
  if (itemsCount === 2) return "md:grid-cols-2";
  if (itemsCount === 4) return "md:grid-cols-4";
  return "md:grid-cols-3";
}

export function SectionStatsBand({
  id,
  title,
  subtitle,
  items,
  className,
  columnsClassName,
}: SectionStatsBandProps) {
  const cols = columnsClassName ?? getColumnsClass(items.length);

  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        <Wave flip className="relative z-10 text-white" />

        <SparklesOverlay />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
          <h2 className="text-center text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/85 md:text-base">
              {subtitle}
            </p>
          )}

          <div className={`mt-12 grid gap-10 ${cols}`}>
            {items.map((it) => (
              <div key={`${it.value}-${it.label}`} className="text-center">
                <div className="text-5xl font-semibold">{it.value}</div>
                <p className="mt-3 text-sm text-white/90 md:text-base">
                  {it.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <Wave className="relative z-10 text-white" />
      </div>
    </section>
  );
}
