// app/lib/utils/format-date.ts

export type DateFormatStyle = "short" | "long";

/** "Nov 15, 2025" / "November 15, 2025" */
export function formatDate(
  value: string | number | Date,
  style: DateFormatStyle = "short",
  locale = "en-US",
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const month: "short" | "long" = style === "long" ? "long" : "short";

  return new Intl.DateTimeFormat(locale, {
    month,
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/** "Nov 15, 2025, 09:30" (time included) */
export function formatDateTime(
  value: string | number | Date,
  style: DateFormatStyle = "short",
  locale = "en-US",
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const month: "short" | "long" = style === "long" ? "long" : "short";

  return new Intl.DateTimeFormat(locale, {
    month,
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
