import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { inter } from "@/app/ui/fonts";
import { fetchLatestRecipes } from "@/app/lib/data";
import RecipesType from "../recipes/recipes-status";

export default async function LatestRecipes() {
  const latestRecipes = await fetchLatestRecipes();
  // Simple empty-state check
  const isEmpty = !latestRecipes || latestRecipes.length === 0;

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${inter.className} mb-4 pl-6 text-xl md:text-2xl`}>
        Latest Recipes
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {isEmpty ? (
            <div className="w-full rounded-md bg-white p-4 text-sm text-gray-500">
              You don't have any recipes yet 😔!
            </div>
          ) : (
            (latestRecipes ?? []).map((recipe, i) => (
              <div
                key={recipe.id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex items-center flex-wrap">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {recipe.recipe_name}
                    </p>
                    <p className="hidden text-sm text-wrap text-gray-500 sm:block">
                      {recipe.recipe_ingredients.length
                        ? recipe.recipe_ingredients.join(", ")
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-wrap">
                  <p
                    className={`${inter.className} truncate text-sm font-medium md:text-base`}
                  >
                    <RecipesType type={recipe.recipe_type} />
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
