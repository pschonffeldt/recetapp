"use client";

import { Badge, BadgeMuted } from "../users/badge";

type RecipeTypeValue =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack"
  | "other";

function normalizeType(input?: string | null): RecipeTypeValue {
  const v = (input ?? "").trim().toLowerCase();
  if (v === "breakfast") return "breakfast";
  if (v === "lunch") return "lunch";
  if (v === "dinner") return "dinner";
  if (v === "dessert") return "dessert";
  if (v === "snack") return "snack";
  return v ? "other" : "other";
}

function titleCase(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export default function RecipesType({ type }: { type?: string | null }) {
  const value = normalizeType(type);
  const raw = (type ?? "").trim();

  if (!raw) return <BadgeMuted>—</BadgeMuted>;

  const label =
    value === "other" ? titleCase(raw.toLowerCase()) : titleCase(value);

  const cls =
    value === "breakfast"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : value === "lunch"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : value === "dinner"
          ? "border-purple-200 bg-purple-50 text-purple-700"
          : value === "dessert"
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : value === "snack"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-gray-200 bg-gray-50 text-gray-700";

  return <Badge className={cls}>{label}</Badge>;
}
