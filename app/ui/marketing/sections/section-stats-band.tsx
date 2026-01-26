import { Wave, SparklesOverlay } from "@/app/lib/marketing/helpers";

type StatsBandItem = {
  value: string;
  label: string;
};

type SectionStatsBandProps = {
  id?: string;
  title: string;
  items: StatsBandItem[];
  className?: string;
};

export function SectionStatsBand({
  id,
  title,
  items,
  className,
}: SectionStatsBandProps) {
  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        <Wave flip className="relative z-10 text-white" />

        <SparklesOverlay />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
          <h2 className="text-center text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {items.map((it) => (
              <div key={it.value} className="text-center">
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
