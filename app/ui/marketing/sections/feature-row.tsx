type FeatureRowProps = {
  id?: string;
  reverse?: boolean;
  content: React.ReactNode;
  media: React.ReactNode;
  className?: string;
};

export function FeatureRow({
  id,
  reverse = false,
  content,
  media,
  className,
}: FeatureRowProps) {
  return (
    <div
      id={id}
      className={[
        "grid gap-12 lg:grid-cols-2 lg:items-center",
        className ?? "",
      ].join(" ")}
    >
      <div className={reverse ? "lg:order-2" : undefined}>{content}</div>

      <div
        className={[
          "flex justify-start",
          reverse ? "lg:order-1" : "lg:justify-end",
        ].join(" ")}
      >
        {media}
      </div>
    </div>
  );
}
