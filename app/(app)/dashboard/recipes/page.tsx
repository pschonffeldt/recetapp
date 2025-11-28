import Pagination from "@/app/ui/recipes/recipes-pagination";
import Search from "@/app/ui/recipes/recipes-search";
import RecipesTable from "@/app/ui/recipes/recipes-table";
import { CreateRecipe } from "@/app/ui/recipes/recipes-buttons";
import { inter } from "@/app/ui/branding/branding-fonts";
import { Suspense } from "react";
import { Metadata } from "next";
import { RecipesTableSkeleton } from "@/app/ui/dashboard/dashboard-skeletons";
import { fetchRecipesPages } from "@/app/lib/data";

// Set title for metadata
export const metadata: Metadata = {
  title: "Recipes",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    sort?: "name" | "date" | "type";
    order?: "asc" | "desc";
    type?: string;
  }>;
}) {
  // -----------------------------
  // 1) Normalize search params
  // -----------------------------
  const searchParams = await props.searchParams; // awaited per local typing
  const query = searchParams?.query || "";

  // Page param: coerce to number, default to 1, clamp to >= 1 here as a first guard
  const pageFromUrl = Math.max(1, Number(searchParams?.page) || 1);

  // Sort / order / type defaults
  const sort = (searchParams?.sort as "name" | "date" | "type") || "date";
  const order = (searchParams?.order as "asc" | "desc") || "desc";
  const type = searchParams?.type || "";

  // -----------------------------
  // 2) Total pages for current filters
  //    (DAL already mirrors list predicates)
  // -----------------------------
  const totalPages = await fetchRecipesPages({ query: query, type });

  // -----------------------------
  // 3) Clamp page within valid range to prevent empty pages
  //    - If there are 0 matches: visually stick to page 1
  //    - Else: min(requested, totalPages)
  // -----------------------------
  const safePage = totalPages === 0 ? 1 : Math.min(pageFromUrl, totalPages);

  // -----------------------------
  // 4) Render
  // -----------------------------
  return (
    <div className="w-full min-h-0">
      {/* Header row (title + actions) */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-xl pl-6 lg:pl-0`}>Recipes</h1>
      </div>

      {/* Toolbar: search (resets page on change inside that component) + create */}
      <div className="mt-4 flex items-center px-2 justify-between gap-2 md:mt-8 lg:px-0">
        <Search placeholder="Search recipes, ingredients or type ..." />
        <CreateRecipe />
      </div>

      {/* Data table with Suspense
         - Key includes all inputs that affect results so React refetches on change.
         - Fallback skeleton shows while the server component loads data.
      */}
      <Suspense
        key={`${query}|${type}|${sort}|${order}|${safePage}`}
        fallback={<RecipesTableSkeleton />}
      >
        <RecipesTable
          query={query}
          currentPage={safePage}
          sort={sort}
          order={order}
          type={type}
        />
      </Suspense>

      {/* Pagination row
         - Receives totalPages and the clamped page to keep controls in sync.
      */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={safePage} />
      </div>
    </div>
  );
}
