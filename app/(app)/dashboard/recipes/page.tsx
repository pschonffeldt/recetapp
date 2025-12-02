import Pagination from "@/app/ui/recipes/recipes-pagination";
import Search from "@/app/ui/recipes/recipes-search";
import RecipesTable from "@/app/ui/recipes/recipes-table";
import { CreateRecipe } from "@/app/ui/recipes/recipes-buttons";
import { inter } from "@/app/ui/branding/branding-fonts";
import { Suspense } from "react";
import type { Metadata } from "next";
import { RecipesTableSkeleton } from "@/app/ui/dashboard/dashboard-skeletons";
import { fetchRecipesPages } from "@/app/lib/data";
import { requireUserId } from "@/app/lib/auth-helpers";

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

  // Total pages for current filters (includes owned + saved recipes)
  const totalPages = await fetchRecipesPages({ query, type, userId });
  const safePage = totalPages === 0 ? 1 : Math.min(pageFromUrl, totalPages);

  return (
    <div className="w-full min-h-0">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-xl pl-6 lg:pl-0`}>Recipes</h1>
      </div>

      <div className="mt-4 flex items-center px-2 justify-between gap-2 md:mt-8 lg:px-0">
        <Search placeholder="Search recipes, ingredients or type ..." />
        <CreateRecipe />
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
