type FeatureRowProps = {
  id?: string;

  content: React.ReactNode;
  media: React.ReactNode;

  /** When true, swaps sides on lg+ */
  reverse?: boolean;

  /** Allows pages to set scroll offset for anchored sections (e.g. "scroll-mt-28") */
  scrollMtClassName?: string;

  /**
   * Layout controls:
   * - twoCol = lg:grid-cols-2 (default)
   * - twelveCol = lg:grid-cols-12 with spans (5/7 by default)
   */
  layout?: "twoCol" | "twelveCol";
  leftColSpanClass?: string; // only for twelveCol
  rightColSpanClass?: string; // only for twelveCol

  /** media wrapper alignment */
  mediaAlignClassName?: string; // e.g. "lg:justify-end"
  className?: string;
};

export function FeatureRow({
  id,
  content,
  media,
  reverse = false,
  scrollMtClassName,
  layout = "twoCol",
  leftColSpanClass = "lg:col-span-5",
  rightColSpanClass = "lg:col-span-7",
  mediaAlignClassName = "lg:justify-end",
  className,
}: FeatureRowProps) {
  const gridClass =
    layout === "twelveCol"
      ? "grid gap-12 lg:grid-cols-12 lg:items-start"
      : "grid gap-12 lg:grid-cols-2 lg:items-center";

  // When using 12-col, we keep explicit spans.
  // When using 2-col, we use order swapping for reverse.
  const leftTwoColOrder = reverse ? "lg:order-2" : "";
  const rightTwoColOrder = reverse ? "lg:order-1" : "";

  // For 12-col + reverse we swap the spans instead of using order.
  const leftFinalClass =
    layout === "twelveCol"
      ? reverse
        ? rightColSpanClass
        : leftColSpanClass
      : leftTwoColOrder;

  const rightFinalClass =
    layout === "twelveCol"
      ? reverse
        ? leftColSpanClass
        : rightColSpanClass
      : rightTwoColOrder;

  return (
    <div
      id={id}
      className={[gridClass, scrollMtClassName ?? "", className ?? ""].join(
        " ",
      )}
    >
      <div className={leftFinalClass}>{content}</div>

      <div
        className={[
          "flex justify-start",
          mediaAlignClassName,
          rightFinalClass,
        ].join(" ")}
      >
        {media}
      </div>
    </div>
  );
}
