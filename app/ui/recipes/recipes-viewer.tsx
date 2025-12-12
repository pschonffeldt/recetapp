"use client";

import { Button } from "@/app/ui/general/button";
import Link from "next/link";
import {
  DeleteRecipeOnViewer,
  ImportRecipeFromDiscover,
  RemoveImportedRecipeOnViewer,
  UpdateRecipeOnViewer,
} from "./recipes-buttons";
import { RecipeForm } from "@/app/lib/types/definitions";
import { inter } from "../branding/branding-fonts";
import { MetricCard, MetricCardMobile } from "./recipes-indicators";
import { buildIngredientLines } from "@/app/lib/ingredients";
import { formatDateToLocal, capitalizeFirst } from "@/app/lib/utils/format";
import clsx from "clsx";

type ViewerMode = "dashboard" | "discover" | "imported";

/**
 * Viewer recipe type:
 * - base is RecipeForm
 * - optionally has:
 *   - saved_by_count for “saved by X cooks”
 *   - created_by_display_name for discover viewer
 */
type ViewerRecipeData = RecipeForm & {
  saved_by_count?: number | null;
  created_by_display_name?: string | null;
};

export default function ViewerRecipe({
  recipe,
  mode = "dashboard",
}: {
  recipe: ViewerRecipeData;
  mode?: ViewerMode;
}) {
  const backHref =
    mode === "discover" ? "/dashboard/discover" : "/dashboard/recipes";

  const canEdit = mode === "dashboard"; // imported + discover = read-only

  // Ingredients list for the card
  const ingredientLines = buildIngredientLines(recipe);

  const isPublic = recipe.status === "public";
  const isImported = mode === "imported";
  const isOwned = mode === "dashboard"; // we only pass "dashboard" for recipes you own

  const savedByCount =
    typeof recipe.saved_by_count === "number" ? recipe.saved_by_count : null;

  const creatorName =
    recipe.created_by_display_name &&
    recipe.created_by_display_name.trim().length > 0
      ? recipe.created_by_display_name
      : "RecetApp cook";

  async function handleOnClick() {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#print");
    if (element) {
      html2pdf(element, { margin: 20 });
    }
  }

  return (
    <div>
      <div id="print" className="rounded-md border-gray-200 bg-gray-50 p-6">
        {/* Recipe name, visibility + creator */}
        <header className="mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {recipe.recipe_name}
              </h1>

              {mode === "discover" && (
                <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                  <span>
                    Created by{" "}
                    <span className="font-medium">
                      {recipe.created_by_display_name ?? "RecetApp cook"}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Visibility pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
              <span
                className={clsx(
                  "inline-flex h-2 w-2 rounded-full",
                  isPublic ? "bg-emerald-500" : "bg-gray-400"
                )}
                aria-hidden="true"
              />
              <span className="font-medium">
                {isPublic ? "Public" : "Private"}
              </span>
              <span className="text-gray-500">
                {isPublic ? "Visible in Discover" : "Only in your library"}
              </span>
              {isPublic && (savedByCount ?? 0) > 0 && (
                <span className="text-gray-400">
                  • Saved by {savedByCount} cook
                  {savedByCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>

          {/* Ownership / import chips */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            {isOwned && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
                Created by you
              </span>
            )}

            {isImported && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700">
                Imported into your library
              </span>
            )}
          </div>
        </header>

        {/* Stats mobile */}
        <section className="mb-6 grid grid-cols-2 gap-4 md:hidden">
          <MetricCardMobile
            title="Creation date"
            value={formatDateToLocal(recipe.recipe_created_at!)}
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Last edit"
            value={formatDateToLocal(recipe.recipe_updated_at!)}
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Recipe type"
            value={capitalizeFirst(recipe.recipe_type)}
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Preparation difficulty"
            value={capitalizeFirst(recipe.difficulty)}
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Servings"
            value={recipe.servings}
            unit="servings"
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Prep time"
            value={recipe.prep_time_min}
            unit="min"
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Recipe calories"
            value={recipe.calories_total}
            unit="kcal"
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Recipe cost"
            value={
              recipe.estimated_cost_total
                ? Number(recipe.estimated_cost_total)
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Calories / serving"
            value={
              recipe.calories_total != null &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(recipe.calories_total / recipe.servings)
                : null
            }
            unit="kcal"
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Cost / serving"
            value={
              recipe.estimated_cost_total &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(
                    (Number(recipe.estimated_cost_total) / recipe.servings) *
                      100
                  ) / 100
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />

          <MetricCardMobile
            title="Allergens"
            items={recipe.allergens}
            emptyLabel="No allergens."
            fontClassName={inter.className}
          />
          <MetricCardMobile
            title="Dietary flags"
            items={recipe.dietary_flags}
            emptyLabel="No dietary flags."
            fontClassName={inter.className}
          />
        </section>

        {/* Stats desktop */}
        <section className="mb-6 hidden gap-4 md:grid md:grid-cols-4">
          <MetricCard
            title="Creation date"
            value={formatDateToLocal(recipe.recipe_created_at!)}
            fontClassName={inter.className}
          />
          <MetricCard
            title="Last edit"
            value={formatDateToLocal(recipe.recipe_updated_at!)}
            fontClassName={inter.className}
          />
          <MetricCard
            title="Recipe type"
            value={capitalizeFirst(recipe.recipe_type)}
            fontClassName={inter.className}
          />
          <MetricCard
            title="Preparation difficulty"
            value={capitalizeFirst(recipe.difficulty)}
            fontClassName={inter.className}
          />
          <MetricCard
            title="Servings"
            value={recipe.servings}
            unit="servings"
            fontClassName={inter.className}
          />
          <MetricCard
            title="Prep time"
            value={recipe.prep_time_min}
            unit="min"
            fontClassName={inter.className}
          />
          <MetricCard
            title="Recipe calories"
            value={recipe.calories_total}
            unit="kcal"
            fontClassName={inter.className}
          />
          <MetricCard
            title="Recipe cost"
            value={
              recipe.estimated_cost_total
                ? Number(recipe.estimated_cost_total)
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />
          <MetricCard
            title="Allergens"
            items={recipe.allergens}
            emptyLabel="No allergens."
            fontClassName={inter.className}
          />
          <MetricCard
            title="Dietary flags"
            items={recipe.dietary_flags}
            emptyLabel="No dietary flags."
            fontClassName={inter.className}
          />
          <MetricCard
            title="Calories / serving"
            value={
              recipe.calories_total != null &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(recipe.calories_total / recipe.servings)
                : null
            }
            unit="kcal"
            fontClassName={inter.className}
          />
          <MetricCard
            title="Cost / serving"
            value={
              recipe.estimated_cost_total &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(
                    (Number(recipe.estimated_cost_total) / recipe.servings) *
                      100
                  ) / 100
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />
        </section>

        {/* Ingredients & Steps */}
        <section className="mb-6 grid items-stretch gap-3 sm:grid-cols-2">
          <MetricCard
            title="Steps"
            items={recipe.recipe_steps}
            emptyLabel="No steps."
            listStyle="decimal"
            fontClassName={inter.className}
            className="flex-1"
          />
          <div className="flex h-full flex-col gap-3">
            <MetricCard
              title="Ingredients"
              items={ingredientLines}
              emptyLabel="No ingredients."
              listStyle="disc"
              fontClassName={inter.className}
              className="h-full"
            />
            <MetricCard
              title="Equipment"
              items={recipe.equipment}
              emptyLabel="No equipment."
              listStyle="disc"
              fontClassName={inter.className}
              className="flex-1"
            />
          </div>
        </section>
      </div>

      {/* Buttons */}
      <section className="pb-10">
        <div className="mt-6 flex flex-wrap justify-center gap-4 px-6 lg:justify-end lg:px-0">
          <Link
            href={backHref}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Return
          </Link>

          <Button onClick={handleOnClick}>Share</Button>

          {mode === "imported" && (
            <RemoveImportedRecipeOnViewer id={recipe.id} />
          )}

          {mode === "discover" && <ImportRecipeFromDiscover id={recipe.id} />}

          {canEdit && (
            <>
              <UpdateRecipeOnViewer id={recipe.id} />
              <DeleteRecipeOnViewer id={recipe.id} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
