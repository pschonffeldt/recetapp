// ============================================
// Recipes Table (RSC)
// - Server component that fetches a paginated, filtered list of recipes
// - Responsive rendering: mobile “cards” and desktop “table”
// - Assumes caller clamps `currentPage` to a valid value (1..totalPages)
// ============================================

/* ================================
 * Imports (as provided)
 * ================================ */
// import { fetchNotifications } from "@/app/lib/data";
import { formatDateToLocal } from "@/app/lib/utils";
import RecipesType from "../recipes/recipes-status";

export default async function NotificationsTable({
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
  //   const notifications = await fetchNotifications();

  // Simple empty-state check; used by both mobile and desktop render paths.
  //   const isEmpty = !notifications || notifications.length === 0;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
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
                  <th className="px-3 py-5 font-medium">Recipe</th>
                  <th className="px-3 py-5 font-medium">Ingredients</th>
                  <th className="px-3 py-5 font-medium">Steps</th>
                  <th className="px-3 py-5 font-medium">Creation date</th>
                  <th className="px-3 py-5 font-medium">Type</th>
                  {/* Actions header (screen-reader only label for the column) */}
                  <th className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                <tr
                  //   key={notification.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  {/* Name */}
                  <td className="whitespace-normal py-3 pl-6 pr-3">
                    <p className="font-medium">Titulo notificación</p>
                  </td>

                  {/* Ingredients (wrap long text) */}
                  <td className="px-3 py-3 whitespace-normal break-words">
                    {/* {notification.recipe_ingredients?.length
                          ? notification.recipe_ingredients.join(", ")
                          : "—"} */}
                    <p className="font-medium">Ingredients notificación</p>
                  </td>

                  {/* Steps (wrap long text) */}
                  <td className="px-3 py-3 whitespace-normal break-words">
                    {/* {notification.recipe_steps?.length
                          ? notification.recipe_steps.join(", ")
                          : "—"} */}
                    <p className="font-medium">Steps notificación</p>
                  </td>

                  {/* Created at (machine-readable <time>) */}
                  <td className="whitespace-normal px-3 py-3 text-gray-600">
                    {/* <time
                          dateTime={new Date(
                            notification.recipe_created_at
                          ).toISOString()}
                        >
                          {formatDateToLocal(notification.recipe_created_at)}
                        </time> */}
                    <p className="font-medium">Tiempo notificación</p>
                  </td>

                  {/* Type chip */}
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* <RecipesType type={notification.recipe_type} /> */}
                    <p className="font-medium">Tipo notificación</p>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <ViewRecipe id={recipe.id} />
                          <UpdateRecipe id={recipe.id} />
                          <DeleteRecipe id={recipe.id} /> */}
                    </div>{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
