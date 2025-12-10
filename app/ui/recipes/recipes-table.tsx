import RecipesType from "./recipes-status";
import SortButton from "./recipes-sort-button";
import {
  ViewRecipe,
  UpdateRecipe,
  DeleteRecipe,
  RemoveImportedRecipe,
} from "./recipes-buttons";
import RecipesDifficulty from "./recipes-difficulty";
import { formatDateToLocal } from "@/app/lib/utils/format";
import {
  fetchFilteredRecipes,
  SortKey,
  type RecipeListItem,
} from "@/app/lib/recipes/data";
import clsx from "clsx";
import PrepTimePill from "../general/time-pill";

type RecipesTableProps = {
  userId: string;
  query: string;
  currentPage: number;
  sort: SortKey;
  order: "asc" | "desc";
  type: string | null;
};

function OwnershipBadge({ owner }: { owner: "owned" | "imported" }) {
  const label = owner === "owned" ? "Created by you" : "Imported";
  const style =
    owner === "owned"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        style
      )}
    >
      {label}
    </span>
  );
}

function VisibilityBadge({ status }: { status: "public" | "private" }) {
  const isPublic = status === "public";
  const label = isPublic ? "Public" : "Private";
  const style = isPublic
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-gray-200 bg-gray-100 text-gray-600";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        style
      )}
    >
      {label}
    </span>
  );
}

export default async function RecipesTable({
  userId,
  query,
  currentPage,
  sort,
  order,
  type,
}: RecipesTableProps) {
  const recipes: RecipeListItem[] = await fetchFilteredRecipes(
    query,
    currentPage,
    {
      sort,
      order,
      type,
      userId,
    }
  );

  const isEmpty = !recipes || recipes.length === 0;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* ============== Mobile cards ============== */}
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
                  <div className="flex flex-col place-items-start justify-between gap-1 border-b pb-2">
                    <p className="font-medium">{recipe.recipe_name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>Type:</span>
                        <RecipesType type={recipe.recipe_type} />
                      </span>
                      <span className="flex items-center gap-1">
                        <span>Difficulty:</span>
                        <RecipesDifficulty type={recipe.difficulty} />
                      </span>
                      <span className="flex items-center gap-1">
                        <span>Owner:</span>
                        <OwnershipBadge owner={recipe.owner_relationship} />
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Ingredients: </span>
                      <span>
                        {recipe.recipe_ingredients?.length
                          ? recipe.recipe_ingredients.join(", ")
                          : "—"}
                      </span>
                    </div>

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

                  <div className="mt-4 flex justify-end gap-2 border-t pt-3">
                    <ViewRecipe id={recipe.id} />
                    {recipe.owner_relationship === "owned" ? (
                      <>
                        <UpdateRecipe id={recipe.id} />
                        <DeleteRecipe id={recipe.id} />
                      </>
                    ) : (
                      <RemoveImportedRecipe id={recipe.id} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ============== Desktop table ============== */}
          <table className="mt-4 hidden w-full table-auto text-gray-900 md:table">
            <thead className="text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 sm:pl-6">
                  <SortButton column="name" label="Recipe" />
                </th>
                <th className="px-3 py-5 font-medium">
                  <SortButton column="type" label="Type" />
                </th>
                <th className="px-3 py-5 font-medium">
                  <SortButton column="difficulty" label="Difficulty" />
                </th>
                <th className="whitespace-nowrap px-3 py-5 font-medium">
                  <SortButton column="time" label="Time" />
                </th>
                <th className="whitespace-nowrap px-3 py-5 font-medium">
                  <SortButton column="date" label="Creation date" />
                </th>
                <th className="whitespace-nowrap px-3 py-5 font-medium">
                  <SortButton column="visibility" label="Visibility" />
                </th>
                <th className="px-3 py-5 font-medium">
                  <SortButton column="owner" label="Owner" />
                </th>
                <th className="px-3 py-5 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {isEmpty ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No recipes found.
                  </td>
                </tr>
              ) : (
                recipes.map((recipe) => (
                  <tr
                    key={recipe.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    {/* Recipe name */}
                    <td className="whitespace-normal py-3 pl-6 pr-3 align-middle">
                      <p className="font-medium">{recipe.recipe_name}</p>
                    </td>

                    {/* Type */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <RecipesType type={recipe.recipe_type} />
                    </td>

                    {/* Difficulty */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <RecipesDifficulty type={recipe.difficulty} />
                    </td>

                    {/* Time (prep_time_min) */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <PrepTimePill minutes={recipe.prep_time_min} />
                    </td>

                    {/* Created at */}
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600 align-middle">
                      <time
                        dateTime={new Date(
                          recipe.recipe_created_at!
                        ).toISOString()}
                      >
                        {formatDateToLocal(recipe.recipe_created_at!)}
                      </time>
                    </td>

                    {/* Visibility */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <VisibilityBadge status={recipe.status} />
                    </td>

                    {/* Owner */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <OwnershipBadge owner={recipe.owner_relationship} />
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap py-3 pl-3 pr-6 align-middle">
                      <div className="flex justify-end gap-2">
                        <ViewRecipe id={recipe.id} />
                        {recipe.owner_relationship === "owned" ? (
                          <>
                            <UpdateRecipe id={recipe.id} />
                            <DeleteRecipe id={recipe.id} />
                          </>
                        ) : (
                          <RemoveImportedRecipe id={recipe.id} />
                        )}
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
