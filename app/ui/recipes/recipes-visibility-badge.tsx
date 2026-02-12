import type { RecipeForm } from "@/app/lib/types/definitions";
import clsx from "clsx";
import { Badge } from "../users/badge";

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

  const cls = isPublic
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <Badge
      className={cls}
      title={isPublic ? "Public recipe" : "Private recipe"}
    >
      <span
        className={clsx(
          "mr-2 inline-flex h-2 w-2 rounded-full",
          isPublic ? "bg-emerald-500" : "bg-gray-400",
        )}
        aria-hidden="true"
      />
      <span className="font-medium">{isPublic ? "Public" : "Private"}</span>
      <span className="ml-2 text-gray-600/80">
        {"• "} {baseText}
        {savedText ? ` • ${savedText}` : ""}
      </span>
    </Badge>
  );
}
