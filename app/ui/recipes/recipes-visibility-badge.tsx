"use client";

import clsx from "clsx";
import type { RecipeForm } from "@/app/lib/types/definitions";

type Status = RecipeForm["status"]; // 'private' | 'public'

export function VisibilityBadge({
  status,
  importedCount,
}: {
  status: Status;
  importedCount?: number;
}) {
  const isPublic = status === "public";
  const count = importedCount ?? 0;

  const baseText = isPublic ? "Visible in Discover" : "Only in your library";
  const savedText =
    isPublic && count > 0
      ? `Saved by ${count} cook${count === 1 ? "" : "s"}`
      : "";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs">
      <span
        className={clsx(
          "inline-flex h-2 w-2 rounded-full",
          isPublic ? "bg-green-500" : "bg-gray-400"
        )}
        aria-hidden="true"
      />
      <span className="font-medium">{isPublic ? "Public" : "Private"}</span>
      <span className="text-gray-500">
        {/* always show base text */}
        {" • "}
        {baseText}
        {/* only show count when >= 1 */}
        {savedText && ` • ${savedText}`}
      </span>
    </div>
  );
}
