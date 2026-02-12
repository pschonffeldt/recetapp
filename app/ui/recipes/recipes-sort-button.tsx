import type { SortKey } from "@/app/lib/recipes/data";
import clsx from "clsx";
import Link from "next/link";

type Props = {
  column: SortKey;
  label: string;

  // Pass through the current params so we can preserve them.
  // This avoids losing query/type/page/etc.
  searchParams: Record<string, string | string[] | undefined>;

  // Optional: if you want to force page reset on sort
  resetPage?: boolean;
};

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const v = searchParams[key];
  return Array.isArray(v) ? v[0] : (v ?? "");
}

function Arrow({ active, order }: { active: boolean; order: "asc" | "desc" }) {
  return (
    <span className="inline-flex w-3 justify-center" aria-hidden="true">
      <span
        className={clsx(
          "inline-block text-[10px] leading-none translate-y-[0.5px] opacity-70",
          active ? "opacity-90" : "opacity-0",
          active && order === "asc" && "rotate-180",
        )}
      >
        ▼
      </span>
    </span>
  );
}

export default function SortButton({
  column,
  label,
  searchParams,
  resetPage = true,
}: Props) {
  const currentSort = (getParam(searchParams, "sort") || "") as SortKey | "";
  const currentOrder = (getParam(searchParams, "order") || "desc") as
    | "asc"
    | "desc";

  const isActive = currentSort === column;
  const nextOrder: "asc" | "desc" = isActive
    ? currentOrder === "asc"
      ? "desc"
      : "asc"
    : "desc";

  const params = new URLSearchParams();

  // preserve existing params
  for (const [k, v] of Object.entries(searchParams)) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((x) => params.append(k, x));
    else params.set(k, v);
  }

  params.set("sort", column);
  params.set("order", nextOrder);
  if (resetPage) params.set("page", "1");

  return (
    <Link
      href={`?${params.toString()}`}
      className={clsx(
        "inline-flex items-center gap-1 select-none",
        "hover:text-gray-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2",
      )}
      aria-sort={
        isActive
          ? currentOrder === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
      title={`Sort by ${label}`}
    >
      <span>{label}</span>
      <Arrow active={isActive} order={currentOrder} />
    </Link>
  );
}
