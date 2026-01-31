import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchRecipesPages } from "@/app/lib/recipes/data";
import { RecipesTableSkeleton } from "@/app/ui/dashboard/dashboard-skeletons";
import RecipesFiltersToolbar from "@/app/ui/filters/filters-toolbar";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { CreateRecipe } from "@/app/ui/recipes/recipes-buttons";
import Pagination from "@/app/ui/recipes/recipes-pagination";
import RecipesTable from "@/app/ui/recipes/recipes-table";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Recipes",
};

type SearchParams = {
  query?: string;
  page?: string;
  sort?: "name" | "date" | "type";
  order?: "asc" | "desc";
  type?: string;
  difficulty?: string;
  maxPrep?: string;
};

export default async function Page(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const userId = await requireUserId();

  const raw = props.searchParams ? await props.searchParams : undefined;
  const searchParams: SearchParams = raw ?? {};

  const query = searchParams.query ?? "";
  const pageFromUrl = Math.max(1, Number(searchParams.page) || 1);
  const sort: "name" | "date" | "type" = searchParams.sort || "date";
  const order: "asc" | "desc" = searchParams.order || "desc";

  const rawType = searchParams.type;
  const type: string | null =
    rawType && rawType.trim().length > 0 ? rawType : null;

  // Extra filters for UI (not yet wired into DB queries)
  const difficultyRaw = searchParams.difficulty ?? "";
  const maxPrepRaw = searchParams.maxPrep ?? "";

  const { pages: totalPages, total: totalCount } = await fetchRecipesPages({
    query,
    type,
    userId,
  });

  const safePage = totalPages === 0 ? 1 : Math.min(pageFromUrl, totalPages);

  const hasFilters = !!query || !!type || !!difficultyRaw || !!maxPrepRaw;

  return (
    <div className="w-full min-h-0">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes", active: true },
        ]}
      />

      {/* Header row: title is in breadcrumbs; keep only Create button here */}
      <div className="mt-4 flex items-center px-2 justify-end gap-2 md:mt-8 lg:px-0">
        <CreateRecipe />
      </div>

      {/* Filters toolbar – same layout as Discover */}
      <section className="mt-4">
        <RecipesFiltersToolbar
          basePath="/dashboard/recipes"
          query={query}
          type={rawType ?? ""}
          difficultyRaw={difficultyRaw}
          maxPrepRaw={maxPrepRaw}
          sort="newest" // sort dropdown hidden, table headers handle sorting
          hasFilters={hasFilters}
          title="Your recipes"
          contextLabel="recipes"
          totalCount={totalCount}
          showSearch={true}
          showType={true}
          showDifficulty={true}
          showMaxPrep={true}
        />
      </section>

      <Suspense
        key={`${query}|${type}|${difficultyRaw}|${maxPrepRaw}|${sort}|${order}|${safePage}`}
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
