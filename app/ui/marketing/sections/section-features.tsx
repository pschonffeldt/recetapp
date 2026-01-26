type SectionFeaturesProps = {
  className?: string;
  children: React.ReactNode;
};

export function SectionFeatures({ className, children }: SectionFeaturesProps) {
  return (
    <section
      className={[
        "mx-auto flex max-w-6xl flex-col gap-36 px-4 py-20 md:px-6 md:py-28",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </section>
  );
}
