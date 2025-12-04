import Pagination from "@/app/ui/recipes/recipes-pagination";
import Search from "@/app/ui/recipes/recipes-search";
import RecipesTable from "@/app/ui/recipes/recipes-table";
import { CreateRecipe } from "@/app/ui/recipes/recipes-buttons";
import { Suspense } from "react";
import type { Metadata } from "next";
import { RecipesTableSkeleton } from "@/app/ui/dashboard/dashboard-skeletons";
import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchRecipesPages } from "@/app/lib/recipes/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import RecipesFiltersToolbar from "@/app/ui/filters/filters-toolbar";

export const metadata: Metadata = {
  title: "Recipes",
};

type SearchParams = {
  query?: string;
  page?: string;
  sort?: "name" | "date" | "type";
  order?: "asc" | "desc";
  type?: string;
};

export default async function Page(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const userId = await requireUserId();

  // Works whether Next passes a Promise or a plain object
  const raw = props.searchParams ? await props.searchParams : undefined;
  const searchParams: SearchParams = raw ?? {};

  const query = searchParams.query ?? "";
  const pageFromUrl = Math.max(1, Number(searchParams.page) || 1);
  const sort: "name" | "date" | "type" = searchParams.sort || "date";
  const order: "asc" | "desc" = searchParams.order || "desc";

  // Normalize type: treat undefined, empty string or whitespace as null
  const rawType = searchParams.type;
  const type: string | null =
    rawType && rawType.trim().length > 0 ? rawType : null;

  // Are any filters active on this page? (for the Clear button + subtitle)
  const hasFilters = !!query || !!type;

  // Total pages for current filters (includes owned + saved recipes)
  const { pages: totalPages, total: totalCount } = await fetchRecipesPages({
    query,
    type,
    userId,
  });

  const safePage = totalPages === 0 ? 1 : Math.min(pageFromUrl, totalPages);

  return (
    <div className="w-full min-h-0">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes", active: true },
        ]}
      />
      {/* Action bar */}
      <div className="flex flex-col rounded-md bg-gray-50">
        {/* Search bar and create button */}
        <div className="flex items-center justify-between mt-6 gap-2 px-6 lg:px-6">
          <Search placeholder="Search recipes, ingredients or type ..." />
          <CreateRecipe />
        </div>
        {/* Filter */}
        <RecipesFiltersToolbar
          basePath="/dashboard/recipes"
          query={query}
          type={rawType ?? ""}
          difficultyRaw=""
          maxPrepRaw=""
          sort="newest"
          hasFilters={hasFilters}
          title="Your recipes"
          contextLabel="recipes"
          totalCount={totalCount}
          showSearch={false}
          showType={true}
          showDifficulty={true}
          showMaxPrep={true}
          showSort={false}
        />
      </div>

      <Suspense
        key={`${query}|${type}|${sort}|${order}|${safePage}`}
        fallback={<RecipesTableSkeleton />}
      >
        <RecipesTable
          userId={userId}
          query={query}
          currentPage={safePage}
          sort={sort}
          order={order}
          type={type}
        />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={safePage} />
      </div>
    </div>
  );
}
