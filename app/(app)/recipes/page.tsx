import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchRecipesPages } from "@/app/lib/recipes/data";
import RecipesFiltersToolbar from "@/app/ui/filters/filters-toolbar";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { CreateRecipe } from "@/app/ui/recipes/recipes-buttons";
import RecipesTable from "@/app/ui/recipes/recipes-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipes",
};

type SearchParams = {
  query?: string;
  page?: string;
  sort?:
    | "name"
    | "date"
    | "type"
    | "difficulty"
    | "time"
    | "visibility"
    | "owner";
  order?: "asc" | "desc";
  type?: string;
  difficulty?: string;
  maxPrep?: string;
};

export default async function Page(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const raw = props.searchParams ? await props.searchParams : undefined;
  const searchParams: SearchParams = raw ?? {};

  const qs = new URLSearchParams(
    Object.entries(searchParams).filter(
      ([, v]) => typeof v === "string" && v.trim().length > 0,
    ) as Array<[string, string]>,
  ).toString();

  const callbackUrl = `/recipes${qs ? `?${qs}` : ""}`;
  const userId = await requireUserId({ callbackUrl });

  const query = searchParams.query ?? "";
  const pageFromUrl = Math.max(1, Number(searchParams.page) || 1);

  // Keep your existing defaults
  const sort: "name" | "date" | "type" =
    (searchParams.sort as "name" | "date" | "type") || "date";
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
    <main className="flex h-full min-h-0 flex-col">
      <Breadcrumbs
        breadcrumbs={[{ label: "Recipes", href: "/recipes", active: true }]}
      />

      <section className="my-5">
        <RecipesFiltersToolbar
          basePath="/recipes"
          query={query}
          type={rawType ?? ""}
          difficultyRaw={difficultyRaw}
          maxPrepRaw={maxPrepRaw}
          sort="newest"
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

      <div className="flex-1 min-h-0 lg:p-0">
        <RecipesTable
          userId={userId}
          query={query}
          currentPage={safePage}
          sort={sort}
          order={order}
          type={type}
          searchParams={searchParams}
        />
      </div>

      <div className="mt-4 flex items-center px-2 justify-end gap-2 md:mt-8 lg:px-0">
        <CreateRecipe />
      </div>
    </main>
  );
}
