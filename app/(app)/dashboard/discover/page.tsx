import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { auth } from "@/auth";
import DiscoverGrid from "@/app/ui/discover/discover-grid";
import { fetchDiscoverRecipes } from "@/app/lib/discover/data";
import type { Difficulty } from "@/app/lib/types/definitions";

export const metadata: Metadata = { title: "Discover" };
export const dynamic = "force-dynamic";

type DiscoverSearchParams = {
  query?: string;
  type?: string;
  difficulty?: Difficulty;
  maxPrep?: string;
  sort?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<DiscoverSearchParams>;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  // Next 15: searchParams is a Promise
  const sp = (await searchParams) ?? {};

  const query = sp.query ?? "";
  const type = sp.type ?? "";
  const maxPrepRaw = sp.maxPrep ?? "";
  const sortParam = sp.sort ?? "newest";

  const difficultyRaw = sp.difficulty ?? "";

  // Narrow to Difficulty | null so TS is happy
  const difficulty: Difficulty | null =
    difficultyRaw === "easy" ||
    difficultyRaw === "medium" ||
    difficultyRaw === "hard"
      ? difficultyRaw
      : null;

  const sort: "newest" | "oldest" | "shortest" =
    sortParam === "oldest" || sortParam === "shortest" ? sortParam : "newest";

  const maxPrep =
    maxPrepRaw && !Number.isNaN(Number(maxPrepRaw)) ? Number(maxPrepRaw) : null;

  const recipes = await fetchDiscoverRecipes({
    currentUserId: userId,
    search: query || null,
    type: type || null,
    difficulty,
    maxPrep,
    sort,
  });

  const hasFilters =
    !!query || !!type || !!difficulty || maxPrep !== null || sort !== "newest";

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Discover", href: "/dashboard/discover", active: true },
        ]}
      />

      {/* Filters toolbar */}
      <section className="mt-4 rounded-md bg-gray-50 p-4 md:p-6">
        <form className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
          {/* Search */}
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
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Type filter */}
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

          {/* Difficulty filter */}
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

          {/* Max prep time */}
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

          {/* Sort */}
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

          {/* Actions */}
          <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-end">
            {hasFilters && (
              <Link
                href="/dashboard/discover"
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
          Showing {recipes.length} recipe{recipes.length === 1 ? "" : "s"} from
          the community.
        </p>
      </section>

      {/* Discover grid */}
      <section className="mt-4">
        <DiscoverGrid recipes={recipes} />
      </section>
    </main>
  );
}
