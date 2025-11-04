"use client";

/* ============================================
 * SortButton (Client Component)
 * - Reads current sort state from URL (?sort=&order=)
 * - Clicking the active column toggles the order asc/desc
 * - Clicking a new column starts with asc
 * - Persists changes back to the URL via router.replace()
 * - Pagination reset to page=1 is handled in setParams()
 * ============================================ */

import { useSearchParams, useRouter } from "next/navigation";
import { setParams } from "./url";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

// Server-side sort keys supported by your list query
type SortCol = "name" | "date" | "type";

export default function SortButton({
  column,
  label,
}: {
  column: SortCol;
  label: string;
}) {
  // Read the current URL query parameters
  const searchParams = useSearchParams();
  const router = useRouter();

  // Is this column currently active in the URL?
  // Default to "date" when ?sort is missing.
  const active = (searchParams.get("sort") ?? "date") === column;

  // Current sort direction for the active column (defaults to "desc")
  const order = (searchParams.get("order") ?? "desc") as "asc" | "desc";

  // Compute the *next* order to apply when the button is clicked:
  // - If this column is already active, flip the direction.
  // - If switching to a new column, start with "asc".
  const nextOrder: "asc" | "desc" = active
    ? order === "asc"
      ? "desc"
      : "asc"
    : "asc";

  // Update the URL with the next sort state.
  // NOTE: setParams() clones the read-only URLSearchParams and:
  // - sets sort/order
  // - resets page=1 when sort/order change (to avoid empty pages)
  const onClick = () => {
    router.replace(setParams(searchParams, { sort: column, order: nextOrder }));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      // Visual hint for active column; underline on hover for affordance
      className={`inline-flex items-center gap-1 font-medium hover:underline ${
        active ? "text-gray-900" : "text-gray-600"
      }`}
      // Programmatic name reflects the *action* that will happen on click
      // (Screen readers announce “Sort by X asc/desc”)
      aria-label={`Sort by ${label} ${nextOrder}`}
      // If you want a native tooltip like your pagination buttons, you can add:
      // title={`Sort by ${label} ${nextOrder}`}
    >
      {/* Column label */}
      {label}

      {/* Indicator icon:
         - Active column: up/down chevron matches current order
         - Inactive column: faint down chevron as a generic hint */}
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
