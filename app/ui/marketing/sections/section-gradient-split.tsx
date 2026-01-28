import { Wave, SparklesOverlay } from "@/app/lib/marketing/helpers";

type SplitItem = {
  title: string;
  body: string;
};

type SectionGradientSplitProps = {
  id?: string;
  title: string;
  description?: string;
  items?: SplitItem[];
  media: React.ReactNode;
  className?: string;
};

export function SectionGradientSplit({
  id,
  title,
  description,
  items = [],
  media,
  className,
}: SectionGradientSplitProps) {
  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        {/* Top wave */}
        <Wave flip className="relative z-10 text-white" />

        <SparklesOverlay />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="text-center grid gap-12 lg:grid-cols-2 lg:items-center lg:text-left">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {title}
              </h2>

              {description && (
                <p className="mt-4 text-sm leading-6 text-white/85 md:text-base">
                  {description}
                </p>
              )}

              {items.length > 0 && (
                <div className="mt-10 space-y-5">
                  {items.map((it) => (
                    <div key={it.title}>
                      <div className="text-sm font-semibold text-white">
                        {it.title}
                      </div>
                      <p className="mt-1 text-sm text-white/85">{it.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-start lg:justify-end">{media}</div>
          </div>
        </div>

        {/* Bottom wave */}
        <Wave className="relative z-10 text-white" />
      </div>
    </section>
  );
}
