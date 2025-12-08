import Link from "next/link";
import DiscoverCard from "./discover-card";
import type { DiscoverRecipeCard } from "@/app/lib/discover/data";

type Props = {
  recipes: DiscoverRecipeCard[];
  hasFilters?: boolean;
};

export default function DiscoverGrid({ recipes, hasFilters = false }: Props) {
  const isEmpty = !recipes || recipes.length === 0;

  if (isEmpty) {
    return (
      <div className="mt-4 rounded-md border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-700">
        {hasFilters ? (
          <div className="space-y-2">
            <p className="font-medium">No recipes match your filters.</p>
            <p className="text-xs text-gray-500">
              Try adjusting your search, choosing a different type or
              difficulty, or clearing all filters.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/discover"
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium">There’s nothing to discover yet.</p>
            <p className="text-xs text-gray-500">
              No public recipes have been published. Once you or other cooks set
              recipes as public, they’ll show up here.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/recipes/create"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
              >
                Create your first public recipe
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {recipes.map((recipe) => (
        <DiscoverCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
