"use client";

import { Badge, BadgeMuted } from "../users/badge";

type DifficultyValue = "easy" | "medium" | "hard" | "other";

function normalizeDifficulty(input?: string | null): DifficultyValue {
  const v = (input ?? "").trim().toLowerCase();
  if (v === "easy") return "easy";
  if (v === "medium") return "medium";
  if (v === "hard") return "hard";
  return v ? "other" : "other";
}

function titleCase(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export default function RecipesDifficulty({ type }: { type?: string | null }) {
  const value = normalizeDifficulty(type);
  const raw = (type ?? "").trim();

  if (!raw) return <BadgeMuted>—</BadgeMuted>;

  const label =
    value === "other" ? titleCase(raw.toLowerCase()) : titleCase(value);

  const cls =
    value === "easy"
      ? "border-pink-200 bg-pink-50 text-pink-700"
      : value === "medium"
        ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
        : value === "hard"
          ? "border-orange-200 bg-orange-50 text-orange-800"
          : "border-gray-200 bg-gray-50 text-gray-700";

  return <Badge className={cls}>{label}</Badge>;
}
