"use client";

import clsx from "clsx";

type Props = { type?: string | null };

const STYLE: Record<string, string> = {
  easy: "bg-pink-500 text-white",
  medium: "bg-fuchsia-800 text-white",
  hard: "bg-orange-500 text-white",
};

const LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function RecipesDifficulty({ type }: Props) {
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
