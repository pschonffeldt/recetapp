import Link from "next/link";

type Props = {
  basePath: string; // e.g. "/dashboard/discover" or "/dashboard/recipes"
  query: string;
  type: string;
  difficultyRaw: string;
  maxPrepRaw: string;
  sort: "newest" | "oldest" | "shortest";
  hasFilters: boolean;
  totalCount: number;
  title?: string; // <- new (for the little caption)
  contextLabel?: string; // e.g. "from the community" vs "in your cookbook"
};

export default function RecipesFiltersToolbar({
  basePath,
  query,
  type,
  difficultyRaw,
  maxPrepRaw,
  sort,
  hasFilters,
  totalCount,
  title = "Filters",
  contextLabel = "recipes",
}: Props) {
  return (
    <section className="mt-4 rounded-md bg-gray-50 p-4 md:p-6">
      <form className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="recipes-query"
            className="block text-xs font-medium text-gray-700"
          >
            Search recipes
          </label>
          <input
            id="recipes-query"
            name="query"
            type="text"
            defaultValue={query}
            placeholder="Search by recipe name..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Type filter */}
        <div className="w-full min-w-[140px] md:w-auto">
          <label
            htmlFor="recipes-type"
            className="block text-xs font-medium text-gray-700"
          >
            Type
          </label>
          <select
            id="recipes-type"
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

        {/* Difficulty filter */}
        <div className="w-full min-w-[140px] md:w-auto">
          <label
            htmlFor="recipes-difficulty"
            className="block text-xs font-medium text-gray-700"
          >
            Difficulty
          </label>
          <select
            id="recipes-difficulty"
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

        {/* Max prep time */}
        <div className="w-full min-w-[140px] md:w-auto">
          <label
            htmlFor="recipes-maxPrep"
            className="block text-xs font-medium text-gray-700"
          >
            Max prep time (min)
          </label>
          <input
            id="recipes-maxPrep"
            name="maxPrep"
            type="number"
            min={0}
            defaultValue={maxPrepRaw}
            placeholder="e.g. 30"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Sort */}
        <div className="w-full min-w-[140px] md:w-auto">
          <label
            htmlFor="recipes-sort"
            className="block text-xs font-medium text-gray-700"
          >
            Sort by
          </label>
          <select
            id="recipes-sort"
            name="sort"
            defaultValue={sort}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="shortest">Shortest prep time</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-end">
          {hasFilters && (
            <Link
              href={basePath}
              className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Clear
            </Link>
          )}
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
          >
            Apply filters
          </button>
        </div>
      </form>

      <p className="mt-2 text-xs text-gray-500">
        {title}: showing {totalCount} {contextLabel}
      </p>
    </section>
  );
}
