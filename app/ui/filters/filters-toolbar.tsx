"use client";

import clsx from "clsx";
import { Button } from "../general/button";
import { useRouter } from "next/navigation";

type Props = {
  basePath: string;

  // Core filter values (all optional so pages can opt-out)
  query?: string;
  type?: string;
  difficultyRaw?: string;
  maxPrepRaw?: string;
  sort?: "newest" | "oldest" | "shortest";

  hasFilters: boolean;

  // UX / text
  title?: string; // e.g. "Discover" / "Your recipes"
  contextLabel?: string; // e.g. "community recipes" / "recipes"
  totalCount?: number; // optional – if absent, we show text without a number

  // Feature flags – turn fields on/off per page
  showSearch?: boolean;
  showType?: boolean;
  showDifficulty?: boolean;
  showMaxPrep?: boolean;
};

function FilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 shadow-sm">
      {label}
    </span>
  );
}

function prettyLabel(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function RecipesFiltersToolbar(props: Props) {
  const {
    basePath,
    query = "",
    type = "",
    difficultyRaw = "",
    maxPrepRaw = "",
    sort = "newest",
    hasFilters,
    title = "Discover",
    contextLabel = "community recipes",
    totalCount,
    showSearch = true,
    showType = true,
    showDifficulty = true,
    showMaxPrep = true,
    // showSort = true,
  } = props;

  const countText = (() => {
    if (totalCount == null) {
      return hasFilters
        ? `Found results matching your filters`
        : `Showing ${contextLabel}`;
    }

    // If your label already includes "recipes", swap it for "recipe" when needed.
    const label =
      totalCount === 1
        ? contextLabel.replace(/\brecipes\b/i, "recipe")
        : contextLabel.replace(/\brecipe\b/i, "recipes");

    return hasFilters
      ? `Found ${totalCount} ${label}`
      : `Showing ${totalCount} ${label}`;
  })();

  const router = useRouter();

  return (
    <section className="mt-4 rounded-md bg-gray-50 p-4 md:p-6">
      <form className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
        {/* Search */}
        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="discover-query"
              className="block text-xs font-medium text-gray-700"
            >
              Search recipes
            </label>
            <input
              id="discover-query"
              name="query"
              type="text"
              defaultValue={query}
              placeholder="Search by recipe name..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Type filter */}
        {showType && (
          <div className="w-full min-w-[140px] md:w-auto">
            <label
              htmlFor="discover-type"
              className="block text-xs font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="discover-type"
              name="type"
              defaultValue={type}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All types</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        )}

        {/* Difficulty */}
        {showDifficulty && (
          <div className="w-full min-w-[140px] md:w-auto">
            <label
              htmlFor="discover-difficulty"
              className="block text-xs font-medium text-gray-700"
            >
              Difficulty
            </label>
            <select
              id="discover-difficulty"
              name="difficulty"
              defaultValue={difficultyRaw}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        {/* Max prep time */}
        {showMaxPrep && (
          <div className="w-full min-w-[140px] md:w-auto">
            <label
              htmlFor="discover-maxPrep"
              className="block text-xs font-medium text-gray-700"
            >
              Max prep time (min)
            </label>
            <input
              id="discover-maxPrep"
              name="maxPrep"
              type="number"
              min={0}
              defaultValue={maxPrepRaw}
              placeholder="e.g. 30"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Actions (Apply) */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-end">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      {/* Summary + chips (always rendered to avoid layout jump) */}
      <div className="mt-2 flex min-h-[28px] flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <p>{countText}</p>
        <div
          className={clsx(
            "flex flex-wrap items-center gap-2",
            !hasFilters && "opacity-0 pointer-events-none",
          )}
        >
          {/* Active filter chips */}
          {hasFilters && (
            <>
              {query && <FilterChip label={`Search: "${query}"`} />}
              {type && <FilterChip label={`Type: ${prettyLabel(type)}`} />}
              {difficultyRaw && (
                <FilterChip
                  label={`Difficulty: ${prettyLabel(difficultyRaw)}`}
                />
              )}
              {maxPrepRaw && <FilterChip label={`Max ${maxPrepRaw} min`} />}

              <Button
                type="button"
                onClick={() => router.push(basePath)}
                className="h-8"
              >
                Clear filters
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
