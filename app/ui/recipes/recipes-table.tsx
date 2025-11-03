import { fetchFilteredRecipes } from "@/app/lib/data";
import { formatDateToLocal } from "@/app/lib/utils";
import RecipesType from "./recipes-status";
import SortButton from "./sort-button";

export default async function RecipesTable({
  query,
  currentPage,
  sort,
  order,
  type,
}: {
  query: string;
  currentPage: number;
  sort: "name" | "date" | "type";
  order: "asc" | "desc";
  type: string;
}) {
  const recipes = await fetchFilteredRecipes(query, currentPage, {
    sort,
    order,
    type,
  });
  const isEmpty = !recipes || recipes.length === 0;

  return (
    <table className="hidden w-full table-fixed text-gray-900 mt-4 md:table">
      <colgroup>
        <col className="w-52" />
        <col className="w-[30%]" />
        <col className="w-[26%]" />
        <col className="w-32" />
        <col className="w-28" />
        <col className="w-28" />
      </colgroup>

      <thead className="text-left text-sm font-normal">
        <tr>
          <th className="px-4 py-5 border-b sm:pl-6">
            <SortButton column="name" label="Recipe" />
          </th>
          <th className="px-3 py-5 font-medium border-b">Ingredients</th>
          <th className="px-3 py-5 font-medium border-b">Steps</th>
          <th className="px-3 py-5 font-medium whitespace-nowrap border-b">
            <SortButton column="date" label="Creation date" />
          </th>
          <th className="px-3 py-5 font-medium border-b">
            <SortButton column="type" label="Type" />
          </th>
          <th className="relative py-3 pl-6 pr-3 border-b">
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
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <p className="font-medium">{recipe.recipe_name}</p>
              </td>
              <td className="px-3 py-3 whitespace-normal break-words">
                {recipe.recipe_ingredients?.length
                  ? recipe.recipe_ingredients.join(", ")
                  : "—"}
              </td>
              <td className="px-3 py-3 whitespace-normal break-words">
                {recipe.recipe_steps?.length
                  ? recipe.recipe_steps.join(", ")
                  : "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                {formatDateToLocal(recipe.recipe_created_at)}
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                <RecipesType type={recipe.recipe_type} />
              </td>
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                {/* your action buttons */}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

/* Mobile cards */

/* <div className="md:hidden">
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

                  <div className="mt-4 flex justify-end gap-2 border-t pt-3">
                    <ViewRecipe id={recipe.id} />
                    <UpdateRecipe id={recipe.id} />
                    <DeleteRecipe id={recipe.id} />
                  </div>
                </div>
              ))
            )}
          </div>*/
