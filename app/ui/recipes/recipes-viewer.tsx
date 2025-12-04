"use client";

import { Button } from "@/app/ui/general/button";
import Link from "next/link";
import {
  DeleteRecipeOnViewer,
  ImportRecipeFromDiscover,
  UpdateRecipeOnViewer,
} from "./recipes-buttons";
import { RecipeForm } from "@/app/lib/types/definitions";
import { inter } from "../branding/branding-fonts";
import { MetricCard, MetricCardMobile } from "./recipes-indicators";
import { RecipeFormState } from "@/app/lib/forms/state";
import { buildIngredientLines } from "@/app/lib/ingredients";
import clsx from "clsx";
import { formatDateToLocal, capitalizeFirst } from "@/app/lib/utils/format";

// (you can keep asDate if you still use it somewhere)
const asDate = (d: string | Date) => (d instanceof Date ? d : new Date(d));

type ViewerMode = "dashboard" | "discover" | "imported";

export default function ViewerRecipe({
  recipe,
  mode = "dashboard",
}: {
  recipe: RecipeForm;
  mode?: ViewerMode;
}) {
  const backHref =
    mode === "discover" ? "/dashboard/discover" : "/dashboard/recipes";

  const canEdit = mode === "dashboard"; // imported + discover = read-only

  const initial: RecipeFormState = { message: null, errors: {} };

  async function handleOnClick() {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#print");
    html2pdf(element, { margin: 20 });
  }

  // Use shared helper
  const ingredientLines = buildIngredientLines(recipe);

  return (
    <div>
      <div id="print" className="rounded-md border-gray-200 bg-gray-50 p-6">
        {/* Recipe name and type */}
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            {recipe.recipe_name}
          </h1>

          {/* Status chip: public / private */}
          <div className="mt-2 flex items-center gap-2">
            <span className={clsx(/* existing status chip styles */)}>
              {recipe.status === "public" ? "Public recipe" : "Private recipe"}
            </span>

            {mode === "imported" && (
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Imported into your library
              </span>
            )}
          </div>
        </header>

        {/* Stats mobile */}
        <section className="mb-6 grid gap-4 sm:grid-cols-4 md:hidden grid-cols-2">
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
        <section className="hidden md:grid md:grid-cols-4 gap-4 mb-6">
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
        <section className="mb-6 grid gap-3 items-stretch sm:grid-cols-2">
          <MetricCard
            title="Ingredients"
            items={ingredientLines}
            emptyLabel="No ingredients."
            listStyle="disc"
            fontClassName={inter.className}
            className="h-full"
          />

          <div className="flex h-full flex-col gap-3">
            <MetricCard
              title="Steps"
              items={recipe.recipe_steps}
              emptyLabel="No steps."
              listStyle="decimal"
              fontClassName={inter.className}
              className="flex-1"
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

          {/* In discover mode, allow importing */}
          {mode === "discover" && <ImportRecipeFromDiscover id={recipe.id} />}

          {/* Only allow edit/delete in dashboard mode */}
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
