export type DateFormatStyle = "short" | "long";

/**
 * Formats a date-like value into a consistent UI string.
 *
 * - "short" -> "Nov 15, 2025"
 * - "long"  -> "November 15, 2025"
 *
 * Accepts:
 * - ISO strings ("2026-02-03", "2026-02-03T10:00:00Z")
 * - Date objects
 * - timestamps
 */
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
