import { capitalizeFirst } from "@/app/lib/utils/format";

const base =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";

export function supportStatusPillClass(isSolved: boolean) {
  return [
    base,
    isSolved
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700",
  ].join(" ");
}

export function supportStatusLabel(isSolved: boolean) {
  return isSolved ? "Solved" : "Unsolved";
}

export function supportCategoryPillClass(category?: string | null) {
  const c = (category ?? "").toLowerCase();
  switch (c) {
    case "billing":
      return `${base} bg-amber-50 text-amber-800 border-amber-200`;
    case "bug":
      return `${base} bg-red-50 text-red-800 border-red-200`;
    case "feature":
      return `${base} bg-indigo-50 text-indigo-800 border-indigo-200`;
    case "account":
      return `${base} bg-emerald-50 text-emerald-800 border-emerald-200`;
    default:
      return `${base} bg-cyan-50 text-cyan-800 border-cyan-200`;
  }
}

export function supportCategoryLabel(category?: string | null) {
  return capitalizeFirst(category ?? "other");
}
