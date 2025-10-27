// app/ui/recipes/table.tsx (or wherever yours lives)
import { fetchFilteredRecipes } from "@/app/lib/data";
import RecipesType from "./recipes-status";
import { formatDateToLocal } from "@/app/lib/utils";

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
                    <div className="text-gray-500">
                      {formatDateToLocal(recipe.recipe_created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table */}
          <table className="hidden min-w-full text-gray-900 md:table">
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
                <th scope="col" className="px-3 py-5 font-medium">
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
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{recipe.recipe_name}</p>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      {recipe.recipe_ingredients.length
                        ? recipe.recipe_ingredients.join(", ")
                        : "—"}
                    </td>

                    <td className="px-3 py-3">
                      {recipe.recipe_steps.length
                        ? recipe.recipe_steps.join(" • ")
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                      {formatDateToLocal(recipe.recipe_created_at)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <RecipesType type={recipe.recipe_type} />
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {/* actions go here later */}
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
