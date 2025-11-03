"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { setParams } from "./url";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

type SortCol = "name" | "date" | "type";

export default function SortButton({
  column,
  label,
}: {
  column: SortCol;
  label: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const active = (searchParams.get("sort") ?? "date") === column;
  const order = (searchParams.get("order") ?? "desc") as "asc" | "desc";
  const nextOrder: "asc" | "desc" = active
    ? order === "asc"
      ? "desc"
      : "asc"
    : "asc";

  const onClick = () => {
    router.replace(setParams(searchParams, { sort: column, order: nextOrder }));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-medium hover:underline ${
        active ? "text-gray-900" : "text-gray-600"
      }`}
      aria-label={`Sort by ${label} ${nextOrder}`}
    >
      {label}
      {active ? (
        order === "asc" ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )
      ) : (
        <ChevronDownIcon className="h-4 w-4 opacity-30" />
      )}
    </button>
  );
}
