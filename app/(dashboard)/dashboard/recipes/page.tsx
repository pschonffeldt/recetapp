import Pagination from "@/app/ui/recipes/pagination";
import Search from "@/app/ui/search";
import RecipesTable from "@/app/ui/recipes/recipes-table";
import { inter } from "@/app/ui/fonts";
import { Suspense } from "react";
import { RecipesTableSkeleton } from "@/app/ui/skeletons";
import { fetchRecipesPages } from "@/app/lib/data";
import { Metadata } from "next";
import { CreateRecipe } from "@/app/ui/recipes/recipes-buttons";

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
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const pageFromUrl = Math.max(1, Number(searchParams?.page) || 1);

  const sort = (searchParams?.sort as "name" | "date" | "type") || "date";
  const order = (searchParams?.order as "asc" | "desc") || "desc";
  const type = searchParams?.type || "";

  // ✅ pages computed with SAME filters used by the list:
  const totalPages = await fetchRecipesPages({ q: query, type });

  // ✅ no redirect: clamp locally so we never fetch an empty page
  const safePage = totalPages === 0 ? 1 : Math.min(pageFromUrl, totalPages);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>Recipes</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search recipes, ingredients or type ..." />
        <CreateRecipe />
      </div>

      {/* Key includes sort/order/type so sort/filter triggers a new fetch */}
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

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={safePage} />
      </div>
    </div>
  );
}
