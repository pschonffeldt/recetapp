import { SparklesOverlay, Wave } from "@/app/lib/marketing/helpers";

type ValueBandItem = {
  title: string;
  body: string;
};

type SectionValueBandProps = {
  id?: string;

  title: string;
  subtitle?: string;

  items: ValueBandItem[];

  /** Layout tuning */
  columnsClassName?: string; // default: "md:grid-cols-3"
  className?: string;
};

export function SectionValueBand({
  id,
  title,
  subtitle,
  items,
  columnsClassName = "md:grid-cols-3",
  className,
}: SectionValueBandProps) {
  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        <SparklesOverlay />
        <Wave flip className="relative z-10 text-white" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {title}
            </h2>

            {subtitle ? (
              <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 md:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className={`mt-12 grid gap-6 ${columnsClassName}`}>
            {items.map((it) => (
              <div
                key={it.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-6"
              >
                <div className="text-sm font-semibold">{it.title}</div>
                <p className="mt-3 text-sm leading-6 text-white/85">
                  {it.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Wave className="relative z-10 text-white" />
      </div>
    </section>
  );
}
