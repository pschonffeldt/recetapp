"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../general/button";

type Props = {
  basePath: string;

  // Current values (from URL)
  query?: string;
  type?: string;
  difficultyRaw?: string;
  maxPrepRaw?: string;
  sort?: "newest" | "oldest" | "shortest";

  hasFilters: boolean;

  // UX / text
  title?: string;
  contextLabel?: string;
  totalCount?: number;

  // Feature flags
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

export default function RecipesFiltersToolbar({
  basePath,
  query = "",
  type = "",
  difficultyRaw = "",
  maxPrepRaw = "",
  // sort = "newest",
  hasFilters,
  // title = "Discover",
  contextLabel = "community recipes",
  totalCount,
  showSearch = true,
  showType = true,
  showDifficulty = true,
  showMaxPrep = true,
}: Props) {
  const router = useRouter();

  // Controlled UI state
  const [queryValue, setQueryValue] = useState(query);
  const [typeValue, setTypeValue] = useState(type);
  const [difficultyValue, setDifficultyValue] = useState(difficultyRaw);
  const [maxPrepValue, setMaxPrepValue] = useState(maxPrepRaw);

  // Keep inputs in sync when navigation updates URL/searchParams
  useEffect(() => setQueryValue(query), [query]);
  useEffect(() => setTypeValue(type), [type]);
  useEffect(() => setDifficultyValue(difficultyRaw), [difficultyRaw]);
  useEffect(() => setMaxPrepValue(maxPrepRaw), [maxPrepRaw]);

  const countText = (() => {
    if (totalCount == null) {
      return hasFilters
        ? `Found results matching your filters`
        : `Showing ${contextLabel}`;
    }

    const label =
      totalCount === 1
        ? contextLabel.replace(/\brecipes\b/i, "recipe")
        : contextLabel.replace(/\brecipe\b/i, "recipes");

    return hasFilters
      ? `Found ${totalCount} ${label}`
      : `Showing ${totalCount} ${label}`;
  })();

  function buildUrl() {
    const sp = new URLSearchParams();

    if (queryValue.trim()) sp.set("query", queryValue.trim());
    if (typeValue) sp.set("type", typeValue);
    if (difficultyValue) sp.set("difficulty", difficultyValue);
    if (maxPrepValue !== "" && String(maxPrepValue).trim() !== "") {
      sp.set("maxPrep", String(maxPrepValue).trim());
    }

    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl());
  }

  function onClear() {
    // Reset UI state
    setQueryValue("");
    setTypeValue("");
    setDifficultyValue("");
    setMaxPrepValue("");

    // Reset URL
    router.push(basePath);
  }

  return (
    <section className="mt-4 rounded-md bg-gray-50 p-4 md:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end"
      >
        {/* Search */}
        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="recipes-query"
              className="block text-xs font-medium text-gray-700"
            >
              Search recipes
            </label>
            <input
              id="recipes-query"
              value={queryValue}
              onChange={(e) => setQueryValue(e.target.value)}
              placeholder="Search by recipe name..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Type filter */}
        {showType && (
          <div className="w-full min-w-[140px] md:w-auto">
            <label
              htmlFor="recipes-type"
              className="block text-xs font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="recipes-type"
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
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
              htmlFor="recipes-difficulty"
              className="block text-xs font-medium text-gray-700"
            >
              Difficulty
            </label>
            <select
              id="recipes-difficulty"
              value={difficultyValue}
              onChange={(e) => setDifficultyValue(e.target.value)}
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
              htmlFor="recipes-maxPrep"
              className="block text-xs font-medium text-gray-700"
            >
              Max prep time (min)
            </label>
            <input
              id="recipes-maxPrep"
              type="number"
              min={0}
              value={maxPrepValue}
              onChange={(e) => setMaxPrepValue(e.target.value)}
              placeholder="e.g. 30"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-end">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      {/* Summary + chips */}
      <div className="mt-2 flex min-h-[28px] flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <p>{countText}</p>

        <div
          className={clsx(
            "flex flex-wrap items-center gap-2",
            !hasFilters && "opacity-0 pointer-events-none",
          )}
        >
          {hasFilters ? (
            <>
              {query && <FilterChip label={`Search: "${query}"`} />}
              {type && <FilterChip label={`Type: ${prettyLabel(type)}`} />}
              {difficultyRaw && (
                <FilterChip
                  label={`Difficulty: ${prettyLabel(difficultyRaw)}`}
                />
              )}
              {maxPrepRaw && <FilterChip label={`Max ${maxPrepRaw} min`} />}

              <Button type="button" onClick={onClear} className="h-8">
                Clear filters
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
