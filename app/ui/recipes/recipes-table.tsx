// ============================================
// Recipes Table (RSC)
// - Server component that fetches a paginated, filtered list of recipes
// - Responsive rendering: mobile “cards” and desktop “table”
// - Assumes caller clamps `currentPage` to a valid value (1..totalPages)
// ============================================

/* ================================
 * Imports (as provided)
 * ================================ */
import { fetchFilteredRecipes } from "@/app/lib/data";
import { formatDateToLocal } from "@/app/lib/utils";
import RecipesType from "./recipes-status";
import SortButton from "./sort-button";
import { ViewRecipe, UpdateRecipe, DeleteRecipe } from "./recipes-buttons";

/* ================================
 * Component
 * ================================ */
/**
 * Props:
 * - query: free-text search across name/ingredients/steps/type
 * - currentPage: 1-based page index (caller must clamp to valid range)
 * - sort/order: server-side sort key and direction
 * - type: exact recipe_type filter (expects canonical value)
 *
 * Data flow:
 * - Calls DAL `fetchFilteredRecipes(query, currentPage, { sort, order, type })`
 *   which applies LIMIT/OFFSET and identical predicates to count/pages logic.
 * - Renders a mobile card layout (md:hidden) and a desktop table (md:table).
 */
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
  // Server fetch for the current page + filters.
  // NOTE: Caller should clamp `currentPage` to avoid empty “past end” pages.
  const recipes = await fetchFilteredRecipes(query, currentPage, {
    sort,
    order,
    type,
  });

  // Simple empty-state check; used by both mobile and desktop render paths.
  const isEmpty = !recipes || recipes.length === 0;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* ============================================
              Mobile cards (visible < md)
              - Compact, stacked view of each recipe
              - Actions row mirrors desktop actions
             ============================================ */}
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
                  {/* Header row: name + type chip */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <p className="font-medium">{recipe.recipe_name}</p>
                    <RecipesType type={recipe.recipe_type} />
                  </div>

                  {/* Body fields */}
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    {/* Ingredients list (comma-joined) */}
                    <div>
                      <span className="font-medium">Ingredients: </span>
                      <span>
                        {recipe.recipe_ingredients?.length
                          ? recipe.recipe_ingredients.join(", ")
                          : "—"}
                      </span>
                    </div>

                    {/* Steps list (comma-joined) */}
                    {/* TODO: If `recipe_steps` can be null/undefined from DB,
                             consider `recipe.recipe_steps?.length` to avoid runtime errors. */}
                    <div>
                      <span className="font-medium">Steps: </span>
                      <span>
                        {recipe.recipe_steps.length
                          ? recipe.recipe_steps.join(", ")
                          : "—"}
                      </span>
                    </div>

                    {/* Created at (machine-readable <time>) */}
                    <div className="flex flex-row text-gray-500">
                      <p className="pr-1">Created at -</p>
                      <time
                        dateTime={new Date(
                          recipe.recipe_created_at
                        ).toISOString()}
                      >
                        {formatDateToLocal(recipe.recipe_created_at)}
                      </time>
                    </div>
                  </div>

                  {/* Actions: view / edit / delete */}
                  {/* A11y: The icon-only buttons have aria-label/sr-only text inside their components. */}
                  <div className="mt-4 flex justify-end gap-2 border-t pt-3">
                    <ViewRecipe id={recipe.id} />
                    <UpdateRecipe id={recipe.id} />
                    <DeleteRecipe id={recipe.id} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ============================================
              Desktop table (visible ≥ md)
              - Fixed layout columns via <colgroup> to control widths
              - Sortable columns use <SortButton>
             ============================================ */}
          <table className="hidden w-full table-fixed text-gray-900 mt-4 md:table">
            <colgroup>
              {/* Recipe Name */}
              <col className="w-[140px]" />
              {/* Recipe Ingredients */}
              <col className="w-[25%]" />
              {/* Recipe Steps */}
              <col className="w-[25%]" />
              {/* Recipe Creation date */}
              <col className="w-[120px]" />
              {/* Recipe Type */}
              <col className="w-[120px]" />
              {/* Recipe Buttons (actions) */}
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
                {/* Actions header (screen-reader only label for the column) */}
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {isEmpty ? (
                // Unified empty state row (spans all columns)
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
                    {/* Name */}
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <p className="font-medium">{recipe.recipe_name}</p>
                    </td>

                    {/* Ingredients (wrap long text) */}
                    <td className="px-3 py-3 whitespace-normal break-words">
                      {recipe.recipe_ingredients?.length
                        ? recipe.recipe_ingredients.join(", ")
                        : "—"}
                    </td>

                    {/* Steps (wrap long text) */}
                    <td className="px-3 py-3 whitespace-normal break-words">
                      {recipe.recipe_steps?.length
                        ? recipe.recipe_steps.join(", ")
                        : "—"}
                    </td>

                    {/* Created at (machine-readable <time>) */}
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                      <time
                        dateTime={new Date(
                          recipe.recipe_created_at
                        ).toISOString()}
                      >
                        {formatDateToLocal(recipe.recipe_created_at)}
                      </time>
                    </td>

                    {/* Type chip */}
                    <td className="whitespace-nowrap px-3 py-3">
                      <RecipesType type={recipe.recipe_type} />
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <ViewRecipe id={recipe.id} />
                        <UpdateRecipe id={recipe.id} />
                        <DeleteRecipe id={recipe.id} />
                      </div>{" "}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* End desktop table */}
        </div>
      </div>
    </div>
  );
}
