type SectionCardsGridProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCardsGrid({
  title,
  subtitle,
  children,
  className,
}: SectionCardsGridProps) {
  return (
    <section
      className={[
        "mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28",
        className ?? "",
      ].join(" ")}
    >
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-4 text-sm text-gray-700 md:text-base">{subtitle}</p>
        )}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">{children}</div>
    </section>
  );
}
