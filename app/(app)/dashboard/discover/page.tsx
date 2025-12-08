// app/(app)/dashboard/discover/page.tsx
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { auth } from "@/auth";
import DiscoverGrid from "@/app/ui/discover/discover-grid";
import RecipesFiltersToolbar from "@/app/ui/filters/filters-toolbar";
import Pagination from "@/app/ui/recipes/recipes-pagination";
import {
  fetchDiscoverRecipes,
  fetchDiscoverPages,
} from "@/app/lib/discover/data";
import type { Difficulty, RecipeForm } from "@/app/lib/types/definitions";

export const metadata: Metadata = { title: "Discover" };
export const dynamic = "force-dynamic";

type DiscoverSearchParams = {
  query?: string;
  type?: string;
  difficulty?: string;
  maxPrep?: string;
  sort?: string;
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<DiscoverSearchParams>;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const sp = (await searchParams) ?? {};

  const query = sp.query ?? "";
  const typeRaw = sp.type ?? "";
  const difficultyRaw = sp.difficulty ?? "";
  const maxPrepRaw = sp.maxPrep ?? "";
  const sortParam = sp.sort ?? "newest";
  const pageFromUrl = Math.max(1, Number(sp.page) || 1);

  // Normalize difficulty
  const difficulty: Difficulty | null =
    difficultyRaw === "easy" ||
    difficultyRaw === "medium" ||
    difficultyRaw === "hard"
      ? (difficultyRaw as Difficulty)
      : null;

  const sort: "newest" | "oldest" | "shortest" =
    sortParam === "oldest" || sortParam === "shortest" ? sortParam : "newest";

  const maxPrep =
    maxPrepRaw && !Number.isNaN(Number(maxPrepRaw)) ? Number(maxPrepRaw) : null;

  const type: RecipeForm["recipe_type"] | null =
    typeRaw && typeRaw.trim().length > 0
      ? (typeRaw as RecipeForm["recipe_type"])
      : null;

  // 1) Count recipes & compute total pages
  const { pages: totalPages, total: totalCount } = await fetchDiscoverPages({
    currentUserId: userId,
    search: query || null,
    type,
    difficulty,
    maxPrep,
  });

  const safePage =
    totalPages === 0 ? 1 : Math.min(pageFromUrl, Math.max(1, totalPages));

  // 2) Fetch recipes for the current page
  const recipes = await fetchDiscoverRecipes({
    currentUserId: userId,
    search: query || null,
    type,
    difficulty,
    maxPrep,
    sort,
    page: safePage,
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

      {/* Page intro */}
      <p className="mt-2 text-sm text-gray-600">
        Browse public recipes shared by the community. Only recipes marked as{" "}
        <span className="font-medium">Public</span> will appear here.
      </p>

      {/* Filters toolbar */}
      <section className="mt-4">
        <RecipesFiltersToolbar
          basePath="/dashboard/discover"
          query={query}
          type={typeRaw}
          difficultyRaw={difficultyRaw}
          maxPrepRaw={maxPrepRaw}
          sort={sort}
          hasFilters={hasFilters}
          title="Discover"
          contextLabel="community recipes"
          totalCount={totalCount}
          showSearch={true}
          showType={true}
          showDifficulty={true}
          showMaxPrep={true}
          showSort={true}
        />
      </section>

      {/* Discover grid */}
      <section className="mt-4">
        <DiscoverGrid recipes={recipes} />
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex w-full justify-center">
          <Pagination totalPages={totalPages} currentPage={safePage} />
        </div>
      )}
    </main>
  );
}
