// app/ui/recipes/recipes-filters-toolbar.tsx (or wherever you put it)
"use client";

import Link from "next/link";
import { Button } from "../general/button";

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
  contextLabel?: string; // e.g. "recipes"
  totalCount?: number; // optional – if absent, we show text without a number

  // Feature flags – turn fields on/off per page
  showSearch?: boolean;
  showType?: boolean;
  showDifficulty?: boolean;
  showMaxPrep?: boolean;
  showSort?: boolean;
};

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
    contextLabel = "recipes",
    totalCount,

    showSearch = true,
    showType = true,
    showDifficulty = true,
    showMaxPrep = true,
    showSort = true,
  } = props;

  return (
    <section className="rounded-md bg-gray-50 p-4 md:p-6">
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
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Sort */}
        {showSort && (
          <div className="w-full min-w-[140px] md:w-auto">
            <label
              htmlFor="discover-sort"
              className="block text-xs font-medium text-gray-700"
            >
              Sort by
            </label>
            <select
              id="discover-sort"
              name="sort"
              defaultValue={sort}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="shortest">Shortest prep time</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-end">
          {hasFilters && (
            <Link
              href={basePath}
              //   className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              {/* Clear */}
              <Button type="submit">Clear</Button>
            </Link>
          )}
          {/* <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
          >
            Apply filters
          </button> */}
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      {/* Footer text – uses numbers when provided */}
      <p className="mt-2 text-xs text-gray-500">
        {title}:{" "}
        {totalCount != null
          ? `showing ${totalCount} ${contextLabel}`
          : `showing ${contextLabel}`}
      </p>
    </section>
  );
}
