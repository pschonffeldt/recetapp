import { fetchFilteredRecipes } from "@/app/lib/data";
import RecipesType from "./recipes-status";
import { formatDateToLocal } from "@/app/lib/utils";
import { DeleteRecipe, ViewRecipe, UpdateRecipe } from "./recipes-buttons";
import { COUNTRIES, RECIPE_TYPES } from "@/app/lib/definitions";

export default async function RecipesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const recipes = await fetchFilteredRecipes(query, currentPage);

  const isEmpty = !recipes || recipes.length === 0;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile cards */}
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
                  <div className="flex items-center justify-between border-b pb-3">
                    <p className="font-medium">{recipe.recipe_name}</p>
                    <RecipesType type={recipe.recipe_type} />
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Ingredients: </span>
                      <span>
                        {recipe.recipe_ingredients.length
                          ? recipe.recipe_ingredients.join(", ")
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Steps: </span>
                      <span>
                        {recipe.recipe_steps.length
                          ? recipe.recipe_steps.join(", ")
                          : "—"}
                      </span>
                    </div>
                    <div className="flex flex-row text-gray-500">
                      <p className="pr-1">Created at -</p>
                      {formatDateToLocal(recipe.recipe_created_at)}
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

          {/* Desktop table */}
          <table className="hidden w-full table-fixed text-gray-900 md:table">
            <colgroup>
              <col className="w-[16%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-32" />
              <col className="w-28" />
              <col className="w-28" />
            </colgroup>

            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Recipe
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ingredients
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Steps
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium whitespace-nowrap"
                >
                  Creation date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
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
                recipes.map((recipe) => (
                  <tr
                    key={recipe.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none
            [&:first-child>td:first-child]:rounded-tl-lg
            [&:first-child>td:last-child]:rounded-tr-lg
            [&:last-child>td:first-child]:rounded-bl-lg
            [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    {/* Recipe */}
                    <td className="py-3 pl-6 pr-3 px-3 whitespace-normal break-words">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{recipe.recipe_name}</p>
                      </div>
                    </td>

                    {/* Ingredients: wrap to add height if needed */}
                    <td className="px-3 py-3 whitespace-normal break-words">
                      {recipe.recipe_ingredients.length
                        ? recipe.recipe_ingredients.join(", ")
                        : "—"}
                    </td>

                    {/* Steps: narrower column, wrap to add height */}
                    <td className="px-3 py-3 whitespace-normal break-words">
                      {recipe.recipe_steps.length
                        ? recipe.recipe_steps.join(", ")
                        : "—"}
                    </td>

                    {/* Creation date: never wrap */}
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                      {formatDateToLocal(recipe.recipe_created_at)}
                    </td>

                    {/* Type */}
                    <td className="whitespace-nowrap px-3 py-3">
                      <RecipesType type={recipe.recipe_type} />
                    </td>

                    {/* Actions */}
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
