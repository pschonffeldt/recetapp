import {
  fetchFilteredRecipes,
  type RecipeListItem,
  type SortKey,
} from "@/app/lib/recipes/data";
import { formatDate } from "@/app/lib/utils/format-date";
import {
  DeleteRecipe,
  RemoveImportedRecipe,
  UpdateRecipe,
  ViewRecipe,
} from "./recipes-buttons";
import RecipesDifficulty from "./recipes-difficulty-badge";
import OwnershipBadge from "./recipes-ownership-badge";
import SortButton from "./recipes-sort-button";
import RecipesTimeBadge from "./recipes-time-badge";
import RecipesType from "./recipes-type-badge";
import { VisibilityBadge } from "./recipes-visibility-badge";

type RecipesTableProps = {
  userId: string;
  query: string;
  currentPage: number;
  sort: SortKey;
  order: "asc" | "desc";
  type: string | null;

  searchParams: Record<string, string | string[] | undefined>;
};

function safeIso(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function ingredientsPreview(ingredients?: string[] | null, maxItems = 5) {
  if (!ingredients?.length) return "—";
  const clean = ingredients.map((x) => String(x).trim()).filter(Boolean);
  if (clean.length <= maxItems) return clean.join(", ");
  return `${clean.slice(0, maxItems).join(", ")}…`;
}

function stepsPreview(steps?: string[] | null, maxChars = 200) {
  if (!steps?.length) return "—";

  const full = steps
    .map((s) =>
      String(s)
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .join(". ");

  if (!full) return "—";
  if (full.length <= maxChars) return `${full}.`;
  return `${full.slice(0, maxChars).trimEnd()}…`;
}

function Actions({ id, owner }: { id: string; owner: "owned" | "imported" }) {
  return (
    <div className="flex justify-end gap-2">
      <ViewRecipe id={id} />
      {owner === "owned" ? (
        <>
          <UpdateRecipe id={id} />
          <DeleteRecipe id={id} />
        </>
      ) : (
        <RemoveImportedRecipe id={id} />
      )}
    </div>
  );
}

export default async function RecipesTable({
  userId,
  query,
  currentPage,
  sort,
  order,
  type,
  searchParams,
}: RecipesTableProps) {
  const recipes: RecipeListItem[] = await fetchFilteredRecipes(
    query,
    currentPage,
    { sort, order, type, userId },
  );

  if (!recipes?.length) {
    return (
      <div className="mt-6 rounded-md border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-600">
        No recipes found.
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {recipes.map((recipe) => {
          const createdIso = safeIso(recipe.recipe_created_at);
          const updatedIso = safeIso(recipe.recipe_updated_at);

          return (
            <div
              key={recipe.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {recipe.recipe_name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {ingredientsPreview(recipe.recipe_ingredients, 7)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <VisibilityBadge status={recipe.status} />
                  <OwnershipBadge owner={recipe.owner_relationship} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Meta
                  </p>
                  <div className="mt-2 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500">Type</span>
                      <RecipesType type={recipe.recipe_type} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500">Difficulty</span>
                      <RecipesDifficulty type={recipe.difficulty} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500">Time</span>
                      <RecipesTimeBadge minutes={recipe.prep_time_min} />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Dates
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-500">Created:</span>{" "}
                      {createdIso ? (
                        <time dateTime={createdIso}>
                          {formatDate(recipe.recipe_created_at!)}
                        </time>
                      ) : (
                        "—"
                      )}
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span>{" "}
                      {updatedIso ? (
                        <time dateTime={updatedIso}>
                          {formatDate(recipe.recipe_updated_at!)}
                        </time>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Steps
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {stepsPreview(recipe.recipe_steps)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Actions id={recipe.id} owner={recipe.owner_relationship} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop */}
      <div className="hidden md:block rounded-md border border-gray-200 bg-white h-full">
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
          <table className="min-w-[950px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">
                  <SortButton
                    column="name"
                    label="Recipe"
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton
                    column="type"
                    label="Type"
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton
                    column="difficulty"
                    label="Difficulty"
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton
                    column="time"
                    label="Time"
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton
                    column="date"
                    label="Creation date"
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton
                    column="visibility"
                    label="Visibility"
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton
                    column="owner"
                    label="Owner"
                    searchParams={searchParams}
                  />
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recipes.map((recipe) => {
                const createdIso = safeIso(recipe.recipe_created_at);

                return (
                  <tr key={recipe.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 align-middle text-gray-600">
                      <div className="font-medium text-gray-900">
                        {recipe.recipe_name}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {ingredientsPreview(recipe.recipe_ingredients, 4)}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-600">
                      <RecipesType type={recipe.recipe_type} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-600">
                      <RecipesDifficulty type={recipe.difficulty} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-600">
                      <RecipesTimeBadge minutes={recipe.prep_time_min} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-600">
                      {createdIso ? (
                        <time dateTime={createdIso}>
                          {formatDate(recipe.recipe_created_at!)}
                        </time>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-600">
                      <VisibilityBadge status={recipe.status} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-600">
                      <OwnershipBadge owner={recipe.owner_relationship} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-600">
                      <Actions
                        id={recipe.id}
                        owner={recipe.owner_relationship}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
