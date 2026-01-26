import {
  Wave,
  SparklesOverlay,
  SectionHeader,
} from "@/app/lib/marketing/helpers";

type GradientCard = {
  title: string;
  body: string;
};

type SectionGradientCardsProps = {
  id?: string;
  title: string;
  subtitle?: string;
  cards: GradientCard[];
  className?: string;

  // optional: allow overriding grid cols later
  columnsClassName?: string; // default "lg:grid-cols-3"
};

export function SectionGradientCards({
  id,
  title,
  subtitle,
  cards,
  className,
  columnsClassName = "lg:grid-cols-3",
}: SectionGradientCardsProps) {
  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        <Wave flip className="relative z-10 text-white" />
        <SparklesOverlay />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-18 md:px-6 md:py-24">
          <SectionHeader title={title} subtitle={subtitle} />

          <div className={`mt-12 grid gap-6 ${columnsClassName}`}>
            {cards.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-6"
              >
                <div className="text-sm font-semibold">{c.title}</div>
                <p className="mt-2 text-sm text-white/85">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <Wave className="relative z-10 text-white" />
      </div>
    </section>
  );
}
