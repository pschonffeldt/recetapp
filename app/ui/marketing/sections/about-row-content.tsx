import SoftDot from "./soft-dot";

type AboutRowContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
};

export function AboutRowContent({
  eyebrow,
  title,
  description,
  bullets = [],
}: AboutRowContentProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
        {description}
      </p>

      {bullets.length > 0 && (
        <div className="mt-8 space-y-3 text-sm text-gray-700">
          {bullets.map((b) => (
            <div key={b} className="flex gap-3">
              <SoftDot />
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
