import RecipesType from "./recipes-status";
import SortButton from "./recipes-sort-button";
import { ViewRecipe, UpdateRecipe, DeleteRecipe } from "./recipes-buttons";
import RecipesDifficulty from "./recipes-difficulty";
import { formatDateToLocal } from "@/app/lib/utils/format";
import { fetchFilteredRecipes } from "@/app/lib/recipes/data";

type RecipesTableProps = {
  userId: string;
  query: string;
  currentPage: number;
  sort: "name" | "date" | "type";
  order: "asc" | "desc";
  type: string | null;
};

export default async function RecipesTable({
  userId,
  query,
  currentPage,
  sort,
  order,
  type,
}: RecipesTableProps) {
  // Server fetch for the current page + filters.
  // NOTE: Caller should clamp `currentPage` to avoid empty “past end” pages.
  const recipes = await fetchFilteredRecipes(userId, query, currentPage, {
    sort,
    order,
    type: type ?? "",
  });

  const isEmpty = !recipes || recipes.length === 0;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* ======= mobile view ======= */}
          <div className="md:hidden">
            {isEmpty ? (
              <div className="w-full rounded-md bg-white p-4 text-gray-500">
                No recipes found.
              </div>
            ) : (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  {/* Header row: name + type and difficulty chip */}
                  <div className="flex flex-col place-items-start justify-between border-b pb-2 gap-1">
                    <p className="font-medium">{recipe.recipe_name}</p>
                    <div className="flex items-center justify-between text-gray-500 text-sm gap-2">
                      <p>Type:</p>
                      <RecipesType type={recipe.recipe_type} />
                      <p className="pl-4">Difficulty:</p>
                      <RecipesDifficulty type={recipe.difficulty} />
                    </div>
                  </div>

                  {/* Body fields */}
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    {/* Ingredients */}
                    <div>
                      <span className="font-medium">Ingredients: </span>
                      <span>
                        {recipe.recipe_ingredients?.length
                          ? recipe.recipe_ingredients.join(", ")
                          : "—"}
                      </span>
                    </div>

                    {/* Steps (clean + truncated) */}
                    <div>
                      <span className="font-medium">Steps: </span>
                      <span>
                        {recipe.recipe_steps?.length
                          ? (() => {
                              const fullText =
                                recipe.recipe_steps
                                  .map((step: string) =>
                                    step
                                      .replace(/[^\p{L}\p{N}\s]/gu, "")
                                      .replace(/\s+/g, " ")
                                      .trim()
                                  )
                                  .join(". ") + ".";

                              const MAX_CHARS = 200;
                              if (fullText.length <= MAX_CHARS) return fullText;
                              return (
                                fullText.slice(0, MAX_CHARS).trimEnd() + "…"
                              );
                            })()
                          : "—"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-gray-500">
                      <div className="flex flex-row">
                        <p className="pr-1">Created at -</p>
                        <time
                          dateTime={new Date(
                            recipe.recipe_created_at!
                          ).toISOString()}
                        >
                          {formatDateToLocal(recipe.recipe_created_at!)}
                        </time>
                      </div>
                      <div className="flex flex-row">
                        <p className="pr-1">Last update at -</p>
                        <p>{formatDateToLocal(recipe.recipe_updated_at!)} </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end gap-2 border-t pt-3">
                    <ViewRecipe id={recipe.id} />
                    <UpdateRecipe id={recipe.id} />
                    <DeleteRecipe id={recipe.id} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ======= desktop table ======= */}
          <table className="hidden w-full table-fixed text-gray-900 mt-4 md:table">
            <colgroup>
              <col className="w-[140px]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-[120px]" />
              <col className="w-[120px]" />
              <col className="w-[120px]" />
            </colgroup>

            <thead className="text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 sm:pl-6">
                  <SortButton column="name" label="Recipe" />
                </th>
                <th className="px-3 py-5 font-medium">Ingredients</th>
                <th className="px-3 py-5 font-medium">Steps</th>
                <th className="px-3 py-5 font-medium whitespace-nowrap ">
                  <SortButton column="date" label="Creation date" />
                </th>
                <th className="px-3 py-5 font-medium">
                  <SortButton column="type" label="Type" />
                </th>
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {isEmpty ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No recipes found.
                  </td>
                </tr>
              ) : (
                recipes.map((recipe: any) => (
                  <tr
                    key={recipe.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-normal py-3 pl-6 pr-3">
                      <p className="font-medium">{recipe.recipe_name}</p>
                    </td>

                    <td className="px-3 py-3 whitespace-normal break-words">
                      {recipe.recipe_ingredients?.length
                        ? recipe.recipe_ingredients.join(", ")
                        : "—"}
                    </td>

                    <td className="px-3 py-3 whitespace-normal break-words">
                      {recipe.recipe_steps?.length
                        ? (() => {
                            const fullText =
                              recipe.recipe_steps
                                .map((step: string) =>
                                  step
                                    .replace(/[^\p{L}\p{N}\s]/gu, "")
                                    .replace(/\s+/g, " ")
                                    .trim()
                                )
                                .join(". ") + ".";

                            const MAX_CHARS = 200;
                            if (fullText.length <= MAX_CHARS) return fullText;
                            return fullText.slice(0, MAX_CHARS).trimEnd() + "…";
                          })()
                        : "—"}
                    </td>

                    <td className="whitespace-normal px-3 py-3 text-gray-600">
                      <time
                        dateTime={new Date(
                          recipe.recipe_created_at
                        ).toISOString()}
                      >
                        {formatDateToLocal(recipe.recipe_created_at)}
                      </time>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <RecipesType type={recipe.recipe_type} />
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <ViewRecipe id={recipe.id} />
                        <UpdateRecipe id={recipe.id} />
                        <DeleteRecipe id={recipe.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
