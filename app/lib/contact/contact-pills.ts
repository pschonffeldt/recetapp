const base =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";

export function contactStatusPillClass(isSolved: boolean) {
  return [
    base,
    isSolved
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700",
  ].join(" ");
}

export function contactStatusLabel(isSolved: boolean) {
  return isSolved ? "Solved" : "Unsolved";
}

export function contactCategoryPillClass(category?: string | null) {
  const c = (category ?? "").toLowerCase();

  switch (c) {
    case "billing":
      return `${base} bg-amber-50 text-amber-800 border-amber-200`;
    case "bug":
      return `${base} bg-red-50 text-red-800 border-red-200`;
    case "feature": // Product feedback
      return `${base} bg-indigo-50 text-indigo-800 border-indigo-200`;
    case "account": // Support
      return `${base} bg-emerald-50 text-emerald-800 border-emerald-200`;
    default: // other
      return `${base} bg-cyan-50 text-cyan-800 border-cyan-200`;
  }
}

export function contactCategoryLabel(category?: string | null) {
  const c = (category ?? "").toLowerCase();

  switch (c) {
    case "account":
      return "Support";
    case "feature":
      return "Product feedback";
    case "billing":
      return "Billing / pricing";
    case "bug":
      return "Report a bug";
    default:
      return "Other";
  }
}
