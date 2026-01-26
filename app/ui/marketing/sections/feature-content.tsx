import { StatCard } from "@/app/lib/marketing/helpers";

type FeatureStat = {
  value: string;
  label: string;
};

type FeatureContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: FeatureStat[]; // we currently use 2
  bullets: string[];
};

export function FeatureContent({
  eyebrow,
  title,
  description,
  stats,
  bullets,
}: FeatureContentProps) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        {eyebrow}
      </p>

      <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-[2.75rem]">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
        {description}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {stats.map((s) => (
          <StatCard key={s.value} value={s.value} label={s.label} />
        ))}
      </div>

      <div className="mt-7 space-y-2 text-sm text-gray-700">
        {bullets.map((b) => (
          <div key={b} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span>{b}</span>
          </div>
        ))}
      </div>
    </>
  );
}
