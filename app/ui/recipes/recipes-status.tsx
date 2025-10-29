"use client";

import clsx from "clsx";

type Props = { type?: string | null };

const STYLE: Record<string, string> = {
  breakfast: "bg-blue-500 text-white",
  lunch: "bg-green-500 text-white",
  dinner: "bg-purple-500 text-white",
  dessert: "bg-yellow-500 text-white",
  snack: "bg-red-500 text-white",
};

const LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  dessert: "Dessert",
  snack: "Snack",
};

export default function RecipesType({ type }: Props) {
  const key = String(type ?? "")
    .trim()
    .toLowerCase();

  const label = LABEL[key] ?? (key ? key[0].toUpperCase() + key.slice(1) : "—");
  const cls = STYLE[key] ?? "bg-gray-200 text-gray-700";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        cls
      )}
    >
      {label}
    </span>
  );
}
