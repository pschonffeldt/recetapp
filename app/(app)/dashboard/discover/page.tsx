import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { auth } from "@/auth";
import DiscoverGrid from "@/app/ui/discover/discover-grid";
import { fetchDiscoverRecipes } from "@/app/lib/discover/data";
import type { Difficulty } from "@/app/lib/types/definitions";
import RecipesFiltersToolbar from "@/app/ui/filters/filters-toolbar";

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
      <RecipesFiltersToolbar
        basePath="/dashboard/discover"
        query={query}
        type={type}
        difficultyRaw={difficultyRaw}
        maxPrepRaw={maxPrepRaw}
        sort={sort}
        hasFilters={hasFilters}
        totalCount={recipes.length}
        title="Discover"
        contextLabel="community recipes"
      />

      {/* Discover grid */}
      <section className="mt-4">
        <DiscoverGrid recipes={recipes} hasFilters={hasFilters} />
      </section>
    </main>
  );
}
