type SectionFeaturesProps = {
  className?: string;
  gapClassName?: string;
  children: React.ReactNode;
};

export function SectionFeatures({
  className,
  gapClassName = "gap-36",
  children,
}: SectionFeaturesProps) {
  return (
    <section
      className={[
        "mx-auto flex max-w-6xl flex-col px-4 py-20 md:px-6 md:py-28",
        gapClassName,
        className ?? "",
      ].join(" ")}
    >
      {children}
    </section>
  );
}
