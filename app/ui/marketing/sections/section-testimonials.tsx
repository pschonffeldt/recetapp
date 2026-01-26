type SectionTestimonialsProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionTestimonials({
  title,
  children,
  className,
}: SectionTestimonialsProps) {
  return (
    <section
      className={[
        "mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24",
        className ?? "",
      ].join(" ")}
    >
      <h2 className="text-center text-sm font-semibold text-gray-700">
        {title}
      </h2>

      <div className="mt-8 grid gap-6 lg:grid-cols-1 lg:items-stretch">
        {children}
      </div>
    </section>
  );
}
