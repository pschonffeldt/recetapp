// ============================================
// Recipes Page (SSR)
// - Lists recipes with search, filters, sorting, and pagination
// - Clamps page within valid bounds to avoid empty pages after filtering
// - Uses Suspense to show a skeleton while the table loads
// ============================================

/* ================================
 * Imports (grouped by role)
 * ================================ */

// Page UI blocks
import Pagination from "@/app/ui/recipes/pagination";
import Search from "@/app/ui/search";
import RecipesTable from "@/app/ui/recipes/recipes-table";
import { CreateRecipe } from "@/app/ui/recipes/recipes-buttons";

// Style & framework
import { inter } from "@/app/ui/fonts";
import { Suspense } from "react";
import { Metadata } from "next";

// Data loading & skeletons
import { RecipesTableSkeleton } from "@/app/ui/skeletons";
import { fetchRecipesPages } from "@/app/lib/data";

/* ================================
 * Metadata
 * ================================ */

// Set title for metadata
export const metadata: Metadata = {
  title: "Recipes",
};

/* ================================
 * Page Component (Server Component)
 * ================================ */
/**
 * Reads searchParams (query, page, sort, order, type), computes total pages,
 * clamps the requested page into a safe range, and renders the table + pagination.
 *
 * Notes:
 * - `searchParams` is awaited here because it's typed as a Promise in this codebase.
 *   In standard Next.js App Router, `searchParams` is usually a plain object.
 * - We compute `totalPages` first, then clamp `page` to avoid requesting offsets past the end.
 * - The <Suspense> key includes query/type/sort/order/page to force a refetch when any change.
 * - Pagination component receives both `totalPages` and the clamped `currentPage`.
 */
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
    <div className="w-full">
      {/* Header row (title + actions) */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>Recipes</h1>
      </div>

      {/* Toolbar: search (resets page on change inside that component) + create */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
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
