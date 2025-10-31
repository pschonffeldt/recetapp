import React from "react";

type BaseProps = {
  title: string;
  className?: string;
  fontClassName?: string;
  heightClassName?: string; // applies to value mode and 0/1-item list mode
};

type ValueMode = {
  value: number | string | null | undefined;
  unit?: string;
  unitPosition?: "left" | "right";
  items?: never;
  emptyLabel?: never;
  listStyle?: never;
  formatItem?: never;
};

type ListMode = {
  items: (string | null | undefined)[] | null | undefined;
  emptyLabel?: string;
  listStyle?: "none" | "disc" | "decimal"; // used only when items.length >= 2
  formatItem?: (s: string) => string;
  value?: never;
  unit?: never;
  unitPosition?: never;
};

type MetricCardProps = BaseProps & (ValueMode | ListMode);

export function MetricCard({
  title,
  className = "",
  fontClassName = "",
  heightClassName,
  ...rest
}: MetricCardProps) {
  // ---------- VALUE MODE ----------
  if ("value" in rest) {
    const hasValue =
      rest.value !== null &&
      rest.value !== undefined &&
      `${rest.value}`.length > 0;
    const unitPos = rest.unitPosition ?? "right";

    return (
      <div
        className={`relative rounded-md bg-white shadow-md border border-gray-100
 ${heightClassName ?? "h-24 sm:h-28"} ${className}`}
      >
        <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
          {title}
        </span>

        <div
          className={`${fontClassName} flex h-full items-center justify-center`}
        >
          {hasValue ? (
            <div className="flex items-baseline">
              {rest.unit && unitPos === "left" && (
                <span className="mr-2 text-sm text-gray-500">{rest.unit}</span>
              )}
              <span className="text-3xl font-semibold text-gray-900">
                {rest.value}
              </span>
              {rest.unit && unitPos === "right" && (
                <span className="ml-2 text-sm text-gray-500">{rest.unit}</span>
              )}
            </div>
          ) : (
            <span className="text-3xl font-semibold text-gray-300">—</span>
          )}
        </div>
      </div>
    );
  }

  // ---------- LIST MODE ----------
  const raw = Array.isArray(rest.items) ? rest.items : [];
  const items = raw
    .filter((f): f is string => typeof f === "string" && f.trim().length > 0)
    .map((s) => (rest.formatItem ? rest.formatItem(s) : toLabel(s)));

  // 0 items → centered empty state
  if (items.length === 0) {
    return (
      <div
        className={`relative rounded-md bg-white shadow-md border border-gray-100 ${
          heightClassName ?? "h-24 sm:h-28"
        } ${className}`}
      >
        <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
          {title}
        </span>
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-gray-600">
            {rest.emptyLabel ?? "No items."}
          </span>
        </div>
      </div>
    );
  }

  // 1 item → centered, big text (like a metric)
  if (items.length === 1) {
    return (
      <div
        className={`relative rounded-md bg-white shadow-md border border-gray-100 ${
          heightClassName ?? "h-24 sm:h-28"
        } ${className}`}
      >
        <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
          {title}
        </span>
        <div
          className={`${fontClassName} flex h-full items-center justify-center`}
        >
          <span className="text-2xl font-medium text-gray-900">{items[0]}</span>
        </div>
      </div>
    );
  }

  // 2+ items → standard list under the label
  const listClass =
    rest.listStyle === "decimal"
      ? "list-decimal"
      : rest.listStyle === "none"
      ? "list-none"
      : "list-disc"; // default bullets

  return (
    <div
      className={`relative rounded-md bg-white shadow-md border border-gray-100 ${className}`}
    >
      <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
        {title}
      </span>

      <div className={`${fontClassName} px-4 pb-4 pt-8`}>
        <ul className={`${listClass} space-y-2 text-gray-800 pl-6`}>
          {items.map((it, i) => (
            <li key={`${title}-item-${i}`} className="leading-relaxed">
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Mobile version
export function MetricCardMobile({
  title,
  className = "",
  fontClassName = "",
  heightClassName,
  ...rest
}: MetricCardProps) {
  // ---------- VALUE MODE ----------
  if ("value" in rest) {
    const hasValue =
      rest.value !== null &&
      rest.value !== undefined &&
      `${rest.value}`.length > 0;
    const unitPos = rest.unitPosition ?? "right";

    return (
      <div
        className={`relative rounded-md bg-white shadow-md border border-gray-100 ${
          heightClassName ?? "h-24 sm:h-28"
        } ${className}`}
      >
        <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
          {title}
        </span>

        <div
          className={`${fontClassName} flex h-full items-center justify-center`}
        >
          {hasValue ? (
            <div className="flex items-baseline">
              {rest.unit && unitPos === "left" && (
                <span className="mr-2 text-sm text-gray-500">{rest.unit}</span>
              )}
              <span className="text-3xl font-semibold text-gray-900">
                {rest.value}
              </span>
              {rest.unit && unitPos === "right" && (
                <span className="ml-2 text-sm text-gray-500">{rest.unit}</span>
              )}
            </div>
          ) : (
            <span className="text-3xl font-semibold text-gray-300">—</span>
          )}
        </div>
      </div>
    );
  }

  // ---------- LIST MODE ----------
  const raw = Array.isArray(rest.items) ? rest.items : [];
  const items = raw
    .filter((f): f is string => typeof f === "string" && f.trim().length > 0)
    .map((s) => (rest.formatItem ? rest.formatItem(s) : toLabel(s)));

  // 0 items → centered empty state
  if (items.length === 0) {
    return (
      <div
        className={`relative rounded-md bg-white shadow-md border border-gray-100 ${
          heightClassName ?? "h-24 sm:h-28"
        } ${className}`}
      >
        <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
          {title}
        </span>
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-gray-600">
            {rest.emptyLabel ?? "No items."}
          </span>
        </div>
      </div>
    );
  }

  // 1 item → centered, big text (like a metric)
  if (items.length === 1) {
    return (
      <div
        className={`relative rounded-md bg-white shadow-md border border-gray-100 ${
          heightClassName ?? "h-24 sm:h-28"
        } ${className}`}
      >
        <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
          {title}
        </span>
        <div
          className={`${fontClassName} flex h-full items-center justify-center`}
        >
          <span className="text-2xl font-medium text-gray-900">{items[0]}</span>
        </div>
      </div>
    );
  }

  // 2+ items → standard list under the label
  const listClass =
    rest.listStyle === "decimal"
      ? "list-decimal"
      : rest.listStyle === "none"
      ? "list-none"
      : "list-disc"; // default bullets

  return (
    <div
      className={`relative rounded-md bg-white shadow-md border border-gray-100 ${className}`}
    >
      <span className="absolute left-4 top-3 text-xs font-medium text-gray-500">
        {title}
      </span>

      <div className={`${fontClassName} px-4 pb-4 pt-8`}>
        <ul className={`${listClass} space-y-2 text-gray-800 pl-6`}>
          {items.map((it, i) => (
            <li key={`${title}-item-${i}`} className="leading-relaxed">
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function toLabel(s: string) {
  return s
    .trim()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
